import { GLOBAL_ERROR_HANDLERS } from "@/constants/errorHandlers";
import {useError} from "@/hooks/useError";
import {useModal} from "@/hooks/useModal";
import {useQueryCachePagination} from "@/hooks/useQueryCachePagination";
import { useQueryError } from "@/hooks/useQueryError";
import {getAnimalsPaginated} from "@/services/animal";
import {AnimalFilterFormData, AnimalFilters} from "@/types/animal";
import {PaginationUtils} from "@/utils/paginationUtils";
import {useInfiniteQuery} from "@tanstack/react-query";
import {useCallback, useState} from "react";

type ModalAction = "edit" | "view";

export const useAnimal = () => {
  const {
    isModalOpen: isCreateModalOpen,
    handleCloseModal: handleCloseCreateModal,
    handleOpenModal: handleOpenCreateModal,
  } = useModal();

  const handleCloseCreateModalFn = () => {
    handleCloseCreateModal();
    // setSelectedAdopter(undefined);
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
    // setSelectedAdopter(undefined);
  };

  const handleCloseViewModalFn = () => {
    setPendingAction(null);
    handleCloseViewModal();
    // setSelectedAdopter(undefined);
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

  const [activeFilters, setActiveFilter] = useState<AnimalFilters>({});
  const filtersCount = Object.values(activeFilters).filter(
    (v) => v !== undefined && v !== null,
    // (v) => v !== undefined && v !== null && v !== "",
  ).length;

  const handleApplyFilter = (data: AnimalFilterFormData) => {
    setActiveFilter(data);
    setShowFilters(false);
  };

  const handleClearFilter = () => {
    setActiveFilter({});
  };

  /** Functions and logics */

  //   const [selectedAdopter, setSelectedAdopter] = useState<Adopter | undefined>();

  //   const handleEditClick = (adopter: MinimalAdopter) => {
  //     setPendingAction("edit");
  //     getAdopterById(adopter.id);
  //   };

  //   const handleViewClick = (adopter: MinimalAdopter) => {
  //     setPendingAction("view");
  //     getAdopterById(adopter.id);
  //   };

  //   const {mutate: getAdopterById} = useMutation({
  //     mutationFn: async (id: string) => {
  //       return (await findAdopterById(id)).data;
  //     },

  //     onSuccess: (data) => {
  //       setSelectedAdopter(data);
  //       if (pendingAction === "edit") {
  //         handleOpenEditModal();
  //       } else if (pendingAction === "view") {
  //         handleOpenViewModal();
  //       }
  //     },
  //     onError: (error) => {
  //       mutationErrorHandling(
  //         error,
  //         "Falha ao buscar adotante",
  //         setErrorMessage,
  //         () => {
  //           if (
  //             error instanceof AxiosError &&
  //             error.response?.data.statusCode === 404
  //           ) {
  //             setErrorMessage("Adotante não encontrado");
  //             return true;
  //           }
  //         },
  //       );
  //     },
  //   });

  //   /** Pagination */

  const {
    data,
    error: errorAnimalsFetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["animals", searchTerm, activeFilters],
    queryFn: async ({pageParam = 1}) => {
      const response = getAnimalsPaginated(
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

    const animalsData = {
      items: data?.pages.flatMap((page) => page.items) ?? [],
      meta: data?.pages[data.pages.length - 1]?.meta,
    };

    useQueryError({
      error: errorAnimalsFetch,
      setErrorMessage,
      clearErrorMessage: clearError,
      statusHandlers: [
        ...GLOBAL_ERROR_HANDLERS,
        {statusCode: 401, message: "Acesso não autorizado."},
        {statusCode: 404, message: "Os animais não foram encontrados."},
      ],
    });

  //   /** Handlers */
  //   const {addItemOnScreen, updateItemOnScreen, removeItemFromScreen} =
  //     useQueryCachePagination();

  //   const handleCreateSuccess = useCallback(
  //     (newAdopter: Adopter) => {
  //       const queryKey = ["adopters", searchTerm, activeFilters];
  //       addItemOnScreen<Adopter>(queryKey, newAdopter, false);
  //     },
  //     [searchTerm, activeFilters, addItemOnScreen],
  //   );

  //   const handleUpdateSuccess = useCallback(
  //     (updatedAdopter: Adopter) => {
  //       updateItemOnScreen<Adopter>(["adopters"], updatedAdopter);
  //     },
  //     [updateItemOnScreen],
  //   );

  //   const handleDeleteSuccess = useCallback(
  //     (deletedId: string) => {
  //       removeItemFromScreen<Adopter>(["adopters"], deletedId);
  //     },
  //     [removeItemFromScreen],
  //   );

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
    animalsData,
    // selectedAdopter,
    isFetchingNextPage,
    hasNextPage,
    errorMessage,
    clearError,
    handleEditClick: () => {},
    handleViewClick: () => {},
    fetchNextPage,
    // handleCreateSuccess,
    // handleUpdateSuccess,
    // handleDeleteSuccess,
  };
};
