import { User } from "@/types";
import { useUserForm } from "./useUserForm";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Icon from "@/components/Icon";
import { Loader2, User as UserIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { MaskedInput } from "@/components/ui/masked-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { InputPassword } from "@/components/ui/input-password";
import { Button } from "@/components/ui/button";
import Alert from "@/components/Alert";
import ConfirmModal from "@/components/ConfirmModal";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";

export type UserFormProps = {
  user?: User;
  mode: "create" | "edit" | "view";
  onCancel: () => void;
  onCreateSuccess?: (newUser: User) => void;
  onUpdateSuccess?: (updatedUser: User) => void;
  onDeleteSuccess?: (deletedId: string) => void;
};

export default function UserForm({
  user,
  mode,
  onCancel,
  onCreateSuccess,
  onUpdateSuccess,
  onDeleteSuccess,
}: UserFormProps) {
  const {
    form,
    canExcludeUser,
    userRolesData,
    isReadOnly,
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
    handleChangeVisibility,
    handleDeleteUser,
    handleCloseModal,
  } = useUserForm({
    user,
    mode,
    onCancel,
    onCreateSuccess,
    onUpdateSuccess,
    onDeleteSuccess,
  });

  return (
    <>
      <Form {...form}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between gap-2">
              <div className="flex justify-between  w-full">
                <div className="flex items-center gap-2">
                  <UserIcon className="h-5 w-5" />
                  Informações do Usuário
                </div>
                {isEditing && (
                  <div>
                    <Badge
                      className={`${
                        user?.active
                          ? "bg-success text-success-foreground"
                          : "bg-red-600 hover:bg-red-700"
                      }`}
                    >
                      {user?.active ? "Ativo" : "Inativo"}
                    </Badge>
                  </div>
                )}
              </div>

              {canExcludeUser && (
                <button
                  className={`transition hover:text-red-500 ${
                    isSameUserLogged ? "text-zinc-900 hover:text-zinc-800" : ""
                  }`}
                  onClick={handleDeleteUser}
                  disabled={isSameUserLogged}
                >
                  <Icon name="Trash2" />
                </button>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <FormField
                control={form.control}
                name="user"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>*Nome (Login)</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isReadOnly}
                        placeholder="Nome Completo"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>*Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        {...field}
                        disabled={isReadOnly}
                        placeholder="email@gmail.com"
                        className="bg-[#020817] border border-border text-white"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>*Senha</FormLabel>
                    <FormControl>
                      <InputPassword
                        {...field}
                        id="password"
                        type="password"
                        placeholder="Digite sua senha"
                        disabled={isReadOnly}
                        className="bg-[#020817] border border-border text-white"
                        showPassword={showPassword}
                        handlePasswordView={handleChangeVisibility}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="cpf"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>*CPF</FormLabel>
                    <FormControl>
                      <MaskedInput
                        mask="999.999.999-99"
                        {...field}
                        disabled={isReadOnly}
                        placeholder="000.000.000-00"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="roleId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>*Tipo de usuário</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled={isLoadingUserRoles}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o tipo de usuário" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {userRolesData?.map((userRole) => (
                            <SelectItem
                              key={userRole.id}
                              value={`${userRole.id}`}
                            >
                              {userRole.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {isEditing && (
              <div className="w-64">
                <FormField
                  control={form.control}
                  name="active"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between rounded-2xl border p-4 shadow-sm hover:shadow-md transition-all">
                        <div className="flex flex-col">
                          <FormLabel className="text-sm font-medium">
                            Status do usuário
                          </FormLabel>
                          <p className="text-xs text-muted-foreground">
                            Defina se o usuário está ativo
                          </p>
                        </div>

                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            disabled={isReadOnly}
                            className="rounded-md h-5 w-5"
                          />
                        </FormControl>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={handleCloseModal}>
            {isReadOnly ? "Fechar" : "Cancelar"}
          </Button>
          {!isReadOnly && (
            <Button onClick={form.handleSubmit(handleButtonConfirm, onError)}>
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {mode === "edit" ? "Atualizando..." : "Cadastrando..."}
                </>
              ) : (
                <>{mode === "edit" ? "Atualizar" : "Cadastrar"}</>
              )}
            </Button>
          )}
        </div>
      </Form>
      <Alert
        content={errorMessage}
        isOpen={!!errorMessage}
        onClose={clearError}
      />
      <ConfirmModal
        isOpen={isModalDeleteUserOpen}
        onClose={handleCloseDeleteUserModal}
        onNotConfirm={handleCloseDeleteUserModal}
        onConfirm={handleDeleteUserConfirm}
        content={"Deseja excluir este usuário ?"}
      />
    </>
  );
}
