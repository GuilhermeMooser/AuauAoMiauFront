import {GLOBAL_ERROR_HANDLERS} from "@/constants/errorHandlers";
import {useError} from "@/hooks/useError";
import {useModal} from "@/hooks/useModal";
import {useQueryCachePagination} from "@/hooks/useQueryCachePagination";
import {useQueryError} from "@/hooks/useQueryError";
import {findTermById, getTermsPaginated} from "@/services/terms";
import {TermFilterFormData, TermFilters, Terms} from "@/types/terms";
import {mutationErrorHandling} from "@/utils/errorHandling";
import {PaginationUtils} from "@/utils/paginationUtils";
import {useInfiniteQuery, useMutation} from "@tanstack/react-query";
import {AxiosError} from "axios";
import {useCallback, useState} from "react";

type ModalAction = "edit" | "view";

export const useTerms = () => {
  const {
    isModalOpen: isCreateModalOpen,
    handleCloseModal: handleCloseCreateModal,
    handleOpenModal: handleOpenCreateModal,
  } = useModal();

  const handleCloseCreateModalFn = () => {
    handleCloseCreateModal();
    setSelectedTerm(undefined);
  };

  const {
    isModalOpen: isEditModalOpen,
    handleCloseModal: handleCloseEditModal,
    handleOpenModal: handleOpenEditModal,
  } = useModal();

  const {
    isModalOpen: isViewModalOpen,
    handleCloseModal: handleCloseViewModal,
    handleOpenModal: handleOpenViewModal,
  } = useModal();

  const [pendingAction, setPendingAction] = useState<ModalAction | null>(null);

  const handleCloseEditModalFn = () => {
    setPendingAction(null);
    handleCloseEditModal();
    setSelectedTerm(undefined);
  };

  const handleCloseViewModalFn = () => {
    setPendingAction(null);
    handleCloseViewModal();
    setSelectedTerm(undefined);
  };

  const {errorMessage, clearError, setErrorMessage} = useError();

  /** Filters */
  const [showFilters, setShowFilters] = useState(false);
  const onToggleFilters = () => {
    setShowFilters((prev) => !prev);
  };

  const [searchTerm, setSearchTerm] = useState("");
  const handleChangeFilter = (value: string) => {
    setSearchTerm(value);
  };

  const [activeFilters, setActiveFilter] = useState<TermFilters>({});
  const filtersCount = Object.values(activeFilters).filter(
    // (v) => v !== undefined && v !== null && v !== ""
    (v) => v !== undefined && v !== null,
  ).length;

  const handleApplyFilter = (data: TermFilterFormData) => {
    setActiveFilter(data);
    setShowFilters(false);
  };

  const handleClearFilter = () => {
    setActiveFilter({});
  };

  /** Functions and logics */
  const [selectedTerm, setSelectedTerm] = useState<Terms | undefined>();

  const handleEditClick = (term: Terms) => {
    setPendingAction("edit");
    getTermById(term.id);
  };

  const handleViewClick = (term: Terms) => {
    setPendingAction("view");
    getTermById(term.id);
  };

  const {mutate: getTermById} = useMutation({
    mutationFn: async (id: string) => {
      return (await findTermById(id)).data;
    },

    onSuccess: (data) => {
      setSelectedTerm(data);
      if (pendingAction === "edit") {
        handleOpenEditModal();
      } else if (pendingAction === "view") {
        handleOpenViewModal();
      }
    },
    onError: (error) => {
      mutationErrorHandling(
        error,
        "Falha ao buscar termo",
        setErrorMessage,
        () => {
          if (
            error instanceof AxiosError &&
            error.response?.data.statusCode === 404
          ) {
            setErrorMessage("Termo não encontrado");
            return true;
          }
        },
      );
    },
  });

  /** Pagination */

  const {
    data,
    error: errorTermsFetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["terms", searchTerm, activeFilters],
    queryFn: async ({pageParam = 1}) => {
      const response = getTermsPaginated(
        searchTerm,
        activeFilters,
        pageParam,
        PaginationUtils.limit,
      );
      return response;
    },
    getNextPageParam: (lastPage) => {
      const {currentPage, totalPages} = lastPage.meta;
      return currentPage < totalPages ? currentPage + 1 : undefined;
    },
    initialPageParam: 1,
    enabled: true,
    staleTime: 30000,
  });

  const termsData = {
    items: data?.pages.flatMap((page) => page.items) ?? [],
    meta: data?.pages[data.pages.length - 1]?.meta,
  };

  useQueryError({
    error: errorTermsFetch,
    setErrorMessage,
    clearErrorMessage: clearError,
    statusHandlers: [
      ...GLOBAL_ERROR_HANDLERS,
      {statusCode: 401, message: "Acesso não autorizado."},
      {statusCode: 404, message: "Os termos não foram encontrados."},
    ],
  });

  /** Handlers */
  const {addItemOnScreen, updateItemOnScreen, removeItemFromScreen} =
    useQueryCachePagination();

  const handleCreateSuccess = useCallback(
    (newTerm: Terms) => {
      const queryKey = ["terms", searchTerm, activeFilters];
      addItemOnScreen<Terms>(queryKey, newTerm, false);
    },
    [searchTerm, activeFilters, addItemOnScreen],
  );

  const handleUpdateSuccess = useCallback(
    (updatedTerm: Terms) => {
      updateItemOnScreen<Terms>(["terms"], updatedTerm);
    },
    [updateItemOnScreen],
  );

  const handleDeleteSuccess = useCallback(
    (deletedId: string) => {
      removeItemFromScreen<Terms>(["terms"], deletedId);
    },
    [removeItemFromScreen],
  );

  return {
    isCreateModalOpen,
    isEditModalOpen,
    isViewModalOpen,
    handleOpenCreateModal,
    handleCloseCreateModalFn,
    handleCloseEditModalFn,
    handleCloseViewModalFn,
    searchTerm,
    filtersCount,
    showFilters,
    activeFilters,
    onToggleFilters,
    handleChangeFilter,
    handleApplyFilter,
    handleClearFilter,
    termsData,
    selectedTerm,
    isFetchingNextPage,
    hasNextPage,
    errorMessage,
    clearError,
    handleEditClick,
    handleViewClick,
    fetchNextPage,
    handleCreateSuccess,
    handleUpdateSuccess,
    handleDeleteSuccess,
  };
};
