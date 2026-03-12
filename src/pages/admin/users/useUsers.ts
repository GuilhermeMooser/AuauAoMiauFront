import {GLOBAL_ERROR_HANDLERS} from "@/constants/errorHandlers";
import {useError} from "@/hooks/useError";
import {useModal} from "@/hooks/useModal";
import {useQueryCachePagination} from "@/hooks/useQueryCachePagination";
import {useQueryError} from "@/hooks/useQueryError";
import {findUserById, getUsersPaginated} from "@/services/users";
import {MinimalUser, User} from "@/types";
import {mutationErrorHandling} from "@/utils/errorHandling";
import {PaginationUtils} from "@/utils/paginationUtils";
import {useInfiniteQuery, useMutation} from "@tanstack/react-query";
import {AxiosError} from "axios";
import {useCallback, useEffect, useState} from "react";

type ModalAction = "edit" | "view";

export const useUsers = () => {
  const {errorMessage, clearError, setErrorMessage} = useError();
  const [selectedUser, setSelectedUser] = useState<User | undefined>();
  const [pendingAction, setPendingAction] = useState<ModalAction | null>(null);

  /** Create */
  const {
    isModalOpen: isCreateModalOpen,
    handleCloseModal: handleCloseCreateModal,
    handleOpenModal: handleOpenCreateModal,
  } = useModal();

  const handleCloseCreateModalFn = () => {
    handleCloseCreateModal();
    setSelectedUser(undefined);
  };

  /** Edit */
  const {
    isModalOpen: isEditModalOpen,
    handleCloseModal: handleCloseEditModal,
    handleOpenModal: handleOpenEditModal,
  } = useModal();

  const handleCloseEditModalFn = () => {
    setPendingAction(null);
    handleCloseEditModal();
    setSelectedUser(undefined);
  };

  /** View */
  const {
    isModalOpen: isViewModalOpen,
    handleCloseModal: handleCloseViewModal,
    handleOpenModal: handleOpenViewModal,
  } = useModal();

  const handleCloseViewModalFn = () => {
    setPendingAction(null);
    handleCloseViewModal();
    setSelectedUser(undefined);
  };

  /** FilterInputSearch */
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchTerm), 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleChangeFilter = (value: string) => {
    setSearchTerm(value);
  };

  /** Pagination */
  const {
    data,
    error: errorUsersFetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["users", debouncedSearch],
    queryFn: async ({pageParam = 1}) => {
      const response = getUsersPaginated(
        debouncedSearch,
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

  const usersData = {
    items: data?.pages.flatMap((page) => page.items) ?? [],
    meta: data?.pages[data.pages.length - 1]?.meta,
  };

  useQueryError({
    error: errorUsersFetch,
    setErrorMessage,
    clearErrorMessage: clearError,
    statusHandlers: [
      ...GLOBAL_ERROR_HANDLERS,
      {statusCode: 401, message: "Acesso não autorizado."},
      {statusCode: 404, message: "Os usuários não foram encontrados."},
    ],
  });

  /** Functions and Logic */
  const handleEditClick = (user: MinimalUser) => {
    setPendingAction("edit");
    getUserById(user.id);
  };

  const handleViewClick = (user: MinimalUser) => {
    setPendingAction("view");
    getUserById(user.id);
  };

  const {mutate: getUserById} = useMutation({
    mutationFn: async (id: string) => {
      return (await findUserById(id)).data;
    },

    onSuccess: (data) => {
      setSelectedUser(data);
      if (pendingAction === "edit") {
        handleOpenEditModal();
      } else if (pendingAction === "view") {
        handleOpenViewModal();
      }
    },
    onError: (error) => {
      mutationErrorHandling(
        error,
        "Falha ao buscar usuários",
        setErrorMessage,
        () => {
          if (
            error instanceof AxiosError &&
            error.response?.data.statusCode === 404
          ) {
            setErrorMessage("Usuário não encontrado");
            return true;
          }
        },
      );
    },
  });

  /** Handlers */
  const {addItemOnScreen, updateItemOnScreen, removeItemFromScreen} =
    useQueryCachePagination();

  const handleCreateSuccess = useCallback(
    (newUser: User) => {
      const queryKey = ["users", debouncedSearch];
      addItemOnScreen<User>(queryKey, newUser, false);
    },
    [debouncedSearch, addItemOnScreen],
  );

  const handleUpdateSuccess = useCallback(
    (updatedUser: User) => {
      updateItemOnScreen<User>(["users"], updatedUser);
    },
    [updateItemOnScreen],
  );

  const handleDeleteSuccess = useCallback(
    (deletedId: string) => {
      removeItemFromScreen<User>(["users"], deletedId);
    },
    [removeItemFromScreen],
  );

  return {
    isCreateModalOpen,
    searchTerm,
    hasNextPage,
    isFetchingNextPage,
    usersData,
    isEditModalOpen,
    selectedUser,
    isViewModalOpen,
    errorMessage,
    clearError,
    handleCloseViewModalFn,
    handleCloseEditModalFn,
    handleEditClick,
    handleViewClick,
    fetchNextPage,
    handleChangeFilter,
    handleCloseCreateModalFn,
    handleOpenCreateModal,
    handleUpdateSuccess,
    handleCreateSuccess,
    handleDeleteSuccess,
  };
};
