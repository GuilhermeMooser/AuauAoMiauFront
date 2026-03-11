import { toast } from "@/hooks/use-toast";
import { useError } from "@/hooks/useError";
import { authLogin } from "@/services/auth";
import { LoginDto, LoginFormData } from "@/types/login";
import { authenticate } from "@/utils/auth";
import { mutationErrorHandling } from "@/utils/errorHandling";
import { loginSchema } from "@/validations/Login/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

export const useLogin = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { errorMessage, clearError, setErrorMessage } = useError();

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handlePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleButtonOkClick = (data: LoginFormData) => {
    setIsLoading(true);
    loginMutate(data);
  };

  const { mutate: loginMutate } = useMutation({
    mutationFn: async ({ email, password }: LoginDto) => {
      return (await authLogin({ email, password })).data;
    },
    onSuccess: (data) => {
      authenticate(data);
      setIsLoading(false);
      toast({
        title: "Sucesso",
        description: "Autenticação realizada",
        variant: "success",
      });
      navigate("/admin/animais");
    },
    onError: (error) => {
      setIsLoading(false);
      mutationErrorHandling(error, "Falha ao realizar login", () => {
        if (isAxiosError(error) && error.response?.data.statusCode === 400) {
          setErrorMessage("Acesso não autorizado");
          return true;
        }
      });
    },
  });

  return {
    errors,
    showPassword,
    isLoading,
    errorMessage,
    clearError,
    handleButtonOkClick,
    handleSubmit,
    handlePasswordVisibility,
    register,
  };
};
