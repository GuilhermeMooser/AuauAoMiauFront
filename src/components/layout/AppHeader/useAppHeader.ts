import {toast} from "@/hooks/use-toast";
import {useError} from "@/hooks/useError";
import {useModal} from "@/hooks/useModal";
import {useNotificationBell} from "@/hooks/useNotification";
import {logout} from "@/services/auth";
import {getAuth} from "@/utils/auth";
import {useMutation} from "@tanstack/react-query";
import {useNavigate} from "react-router-dom";

export const useAppHeader = () => {
  const navigate = useNavigate();
  const auth = getAuth();

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const {isModalOpen, handleOpenModal, handleCloseModal} = useModal();
  const {errorMessage, clearError, setErrorMessage} = useError();

  const handleLogout = () => {
    handleOpenModal();
  };

  const handleLogoutConfirm = () => {
    logoutMutation();
  };

  const {mutate: logoutMutation} = useMutation({
    mutationFn: logout,

    onSuccess: () => {
      handleCloseModal();
      toast({
        title: "Sucesso",
        description: "A sessão foi finalizada com sucesso.",
        variant: "warning",
      });
      navigate("/login");
    },

    onError: () => {
      handleCloseModal();
      setErrorMessage("Falha ao encerrar a sessão.");
    },
  });

  /**
   * Notification
   */
  const {pending, open, setOpen, clearAll, dismissOne, loading} =
    useNotificationBell();

  return {
    auth,
    isModalOpen,
    errorMessage,
    clearError,
    handleLogoutConfirm,
    handleCloseModal,
    getInitials,
    handleLogout,
    notifications: {
      pending,
      open,
      setOpen,
      clearAll,
      dismissOne,
      loading,
    },
  };
};
