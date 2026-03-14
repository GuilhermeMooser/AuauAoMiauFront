import {
  CreateUserDto,
  CreateUserFormData,
  UpdateUserDto,
  UpdateUserFormData,
  UserFormData,
} from "@/types";
import { createUserSchema, updateUserSchema } from "@/validations/User/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { UserFormProps } from ".";
import { getAuth } from "@/utils/auth";
import { Role } from "@/constants/roles";
import { useModal } from "@/hooks/useModal";
import { useMutation, useQuery } from "@tanstack/react-query";
import { userRolesCache } from "@/constants/cacheNames";
import {
  createUser,
  deleteUser,
  getUsersRoles,
  updateUser,
} from "@/services/users";
import { useState } from "react";
import { useFormError } from "@/hooks/useFormError";
import { mutationErrorHandling } from "@/utils/errorHandling";
import { toast } from "@/hooks/use-toast";
import { useError } from "@/hooks/useError";

type Props = {
  user: UserFormProps["user"];
  mode: UserFormProps["mode"];
  onCancel: UserFormProps["onCancel"];
  onCreateSuccess: UserFormProps["onCreateSuccess"];
  onUpdateSuccess: UserFormProps["onUpdateSuccess"];
  onDeleteSuccess: UserFormProps["onDeleteSuccess"];
};

export const useUserForm = ({
  user,
  mode,
  onCancel,
  onCreateSuccess,
  onUpdateSuccess,
  onDeleteSuccess,
}: Props) => {
  const auth = getAuth();
  const isReadOnly = mode === "view";
  const isEditing = mode === "edit";
  const { onError } = useFormError<UserFormData>();
  const { errorMessage, clearError, setErrorMessage } = useError();

  const schema = mode === "edit" ? updateUserSchema : createUserSchema;

  const form = useForm<CreateUserFormData | UpdateUserFormData>({
    resolver: zodResolver(schema),
    defaultValues:
      mode === "edit"
        ? {
            user: user?.name || "",
            email: user?.email || "",
            cpf: user?.cpf || "",
            password: "",
            roleId: user ? String(user.role.id) : "",
            active: user?.active,
          }
        : {
            user: "",
            email: "",
            cpf: "",
            password: "",
            roleId: "",
          },
  });

  /** Fetch UserRolesData */
  const { data: userRolesData = [], isLoading: isLoadingUserRoles } = useQuery({
    queryKey: [userRolesCache],
    queryFn: () => getUsersRoles(),
  });

  /** Delete User */
  const canExcludeUser = mode === "edit" && auth?.user.role.name === Role.Admin;
  const isSameUserLogged = user?.id === auth?.user.id;

  const {
    isModalOpen: isModalDeleteUserOpen,
    handleOpenModal: handleOpenDeleteUserModal,
    handleCloseModal: handleCloseDeleteUserModal,
  } = useModal();

  const handleDeleteUser = () => {
    handleOpenDeleteUserModal();
  };

  const handleDeleteUserConfirm = () => {
    if (!user?.id) return;
    deleteUserMutation(user.id);
  };

  const { mutate: deleteUserMutation } = useMutation({
    mutationFn: async (id: string) => {
      return await deleteUser(id);
    },
    onSuccess: () => {
      if (!user?.id) return;
      if (onDeleteSuccess) {
        onDeleteSuccess(user.id);
      }
      handleCloseDeleteUserModal();
      handleCloseModal();
    },
    onError: (error) => {
      mutationErrorHandling(
        error,
        "Falha ao excluir o usuário",
        setErrorMessage
      );
    },
  });

  /* Control password visibility*/
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handleChangeVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  /** Actions */
  const [submitting, setSubmitting] = useState<boolean>(false);

  const handleButtonConfirm = (
    data: CreateUserFormData | UpdateUserFormData
  ) => {
    if (mode === "create") {
      const createData = data as CreateUserFormData;
      createUserMutation({
        user: createData.user,
        cpf: createData.cpf,
        email: createData.email,
        password: createData.password,
        roleId: createData.roleId,
      });
    } else if (mode === "edit") {
      if (!user?.id) {
        setErrorMessage("O código do adotante não pode ser nulo");
        return;
      }

      const updateData = data as UpdateUserFormData;

      const payload: UpdateUserDto = {
        id: user.id,
        user: updateData.user,
        cpf: updateData.cpf,
        email: updateData.email,
        roleId: updateData.roleId,
        active: updateData.active,
        password:
          updateData.password && updateData.password.trim() !== ""
            ? updateData.password
            : undefined,
      };

      updateUserMutation(payload);
    }
    setSubmitting(true);
  };

  const handleCloseModal = () => {
    onCancel();
    form.reset();
  };

  /** Mutations */

  const { mutate: createUserMutation } = useMutation({
    mutationFn: async (createUserDto: CreateUserDto) => {
      return (await createUser(createUserDto)).data;
    },
    onSuccess: (data) => {
      setSubmitting(false);
      toast({
        title: "Sucesso",
        description: "Usuário criado com sucesso",
        variant: "success",
      });
      if (onCreateSuccess) {
        onCreateSuccess(data);
      }
      handleCloseModal();
    },
    onError: (error) => {
      setSubmitting(false);
      mutationErrorHandling(error, "Falha ao criar usuário", setErrorMessage);
    },
  });

  const { mutate: updateUserMutation } = useMutation({
    mutationFn: async (updateUserDto: UpdateUserDto) => {
      return (await updateUser(updateUserDto)).data;
    },
    onSuccess: (data) => {
      setSubmitting(false);
      toast({
        title: "Sucesso",
        description: "Usuário atualizado com sucesso",
        variant: "success",
      });
      if (onUpdateSuccess) {
        onUpdateSuccess(data);
      }
      handleCloseModal();
    },
    onError: (error) => {
      setSubmitting(false);
      mutationErrorHandling(
        error,
        "Falha ao atualizar o adotante",
        setErrorMessage
      );
    },
  });

  return {
    canExcludeUser,
    form,
    isReadOnly,
    userRolesData,
    isLoadingUserRoles,
    showPassword,
    submitting,
    errorMessage,
    isModalDeleteUserOpen,
    isEditing,
    isSameUserLogged,
    handleCloseDeleteUserModal,
    handleDeleteUserConfirm,
    clearError,
    onError,
    handleButtonConfirm,
    handleCloseModal,
    handleChangeVisibility,
    handleDeleteUser,
  };
};
