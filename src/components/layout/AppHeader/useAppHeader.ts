import {toast} from "@/hooks/use-toast";
import {useError} from "@/hooks/useError";
import {useModal} from "@/hooks/useModal";
import {useNotificationBell} from "@/hooks/useNotification";
import {logout} from "@/services/auth";
import {getAuth} from "@/utils/auth";
import {formatPhoneNumber} from "@/utils/format";
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

  const handleWhatsappSend = (phone: string) => {
    console.log(phone)
    const message = "Olá, como está o animal adotado ?";
    const encodedMessage = encodeURIComponent(message);

    const phoneNumber = phone && formatPhoneNumber(phone);
    const cleanPhone = phoneNumber?.replace(/\D/g, "");

    const whatsAppUrl = cleanPhone
      ? `https://wa.me/55${cleanPhone}?text=${encodedMessage}`
      : `https://wa.me/?text=${encodedMessage}`;

    window.open(whatsAppUrl, "_blank");
  };

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
    handleWhatsappSend,
  };
};
