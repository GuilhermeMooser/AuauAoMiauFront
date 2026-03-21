import {GLOBAL_ERROR_HANDLERS} from "@/constants/errorHandlers";
import {useError} from "@/hooks/useError";
import {useModal} from "@/hooks/useModal";
import {useQueryCachePagination} from "@/hooks/useQueryCachePagination";
import {useQueryError} from "@/hooks/useQueryError";
import {findAnimalById, getAnimalsPaginated} from "@/services/animal";
import {
  Animal,
  AnimalFilterFormData,
  AnimalFilters,
  MinimalAnimal,
} from "@/types/animal";
import {mutationErrorHandling} from "@/utils/errorHandling";
import {PaginationUtils} from "@/utils/paginationUtils";
import {useInfiniteQuery, useMutation} from "@tanstack/react-query";
import {AxiosError} from "axios";
import {useCallback, useEffect, useState} from "react";

type ModalAction = "edit" | "view";

export const useAnimal = () => {
  const {
    isModalOpen: isCreateModalOpen,
    handleCloseModal: handleCloseCreateModal,
    handleOpenModal: handleOpenCreateModal,
  } = useModal();

  const handleCloseCreateModalFn = () => {
    handleCloseCreateModal();
    setSelectedAnimal(undefined);
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
    setSelectedAnimal(undefined);
  };

  const handleCloseViewModalFn = () => {
    setPendingAction(null);
    handleCloseViewModal();
    setSelectedAnimal(undefined);
  };

  const {errorMessage, clearError, setErrorMessage} = useError();

  /** Filters */
  const [showFilters, setShowFilters] = useState(false);
  const onToggleFilters = () => {
    setShowFilters((prev) => !prev);
  };

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchTerm), 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

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

  const [selectedAnimal, setSelectedAnimal] = useState<Animal | undefined>();

  const handleEditClick = (animal: MinimalAnimal) => {
    setPendingAction("edit");
    getAnimalById(animal.id);
  };

  const handleViewClick = (animal: MinimalAnimal) => {
    setPendingAction("view");
    getAnimalById(animal.id);
  };

  const {mutate: getAnimalById} = useMutation({
    mutationFn: async (id: string) => {
      return (await findAnimalById(id)).data;
    },

    onSuccess: (data) => {
      setSelectedAnimal(data);
      if (pendingAction === "edit") {
        handleOpenEditModal();
      } else if (pendingAction === "view") {
        handleOpenViewModal();
      }
    },
    onError: (error) => {
      mutationErrorHandling(
        error,
        "Falha ao buscar animal",
        setErrorMessage,
        () => {
          if (
            error instanceof AxiosError &&
            error.response?.data.statusCode === 404
          ) {
            setErrorMessage("Animal não encontrado");
            return true;
          }
        },
      );
    },
  });

  //   /** Pagination */

  const {
    data,
    error: errorAnimalsFetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["animals", debouncedSearch, activeFilters],
    queryFn: async ({pageParam = 1}) => {
      const response = getAnimalsPaginated(
        debouncedSearch,
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
  const {addItemOnScreen, updateItemOnScreen, removeItemFromScreen} =
    useQueryCachePagination();

  const handleCreateSuccess = useCallback(
    (newAnimal: Animal) => {
      const queryKey = ["animals", debouncedSearch, activeFilters];
      addItemOnScreen<Animal>(queryKey, newAnimal, false);
    },
    [debouncedSearch, activeFilters, addItemOnScreen],
  );

  const handleUpdateSuccess = useCallback(
    (updatedAnimal: Animal) => {
      updateItemOnScreen<Animal>(["animals"], {
        ...updatedAnimal,
        totalCost: calculateNewTotalCost(updatedAnimal),
      });
    },
    [updateItemOnScreen],
  );

  const calculateNewTotalCost = (animal: Animal): number => {
    const expenses = animal?.expenses ?? [];

    return expenses?.reduce((total, e) => {
      return total + Number(e.value || 0);
    }, 0);
  };

  const handleDeleteSuccess = useCallback(
    (deletedId: string) => {
      removeItemFromScreen<Animal>(["animals"], deletedId);
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
    animalsData,
    selectedAnimal,
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
