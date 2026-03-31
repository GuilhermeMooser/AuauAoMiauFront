import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Heart, Shield, Users } from "lucide-react";
import { useLogin } from "./useLogin";
import { InputPassword } from "@/components/ui/input-password";
import Alert from "@/components/Alert";

export default function Login() {
  const {
    isLoading,
    showPassword,
    errors,
    errorMessage,
    clearError,
    register,
    handleButtonOkClick,
    handleSubmit,
    handlePasswordVisibility,
  } = useLogin();

  return (
    <>
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-6 md:space-y-8">
          <div className="text-center space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-2">
              <div className="bg-gradient-primary p-3 rounded-xl shadow-glow">
                <Heart className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-hero bg-clip-text text-transparent">
                Do Auau ao Miau
              </h1>
            </div>
            <p className="text-sm sm:text-base text-muted-foreground">
              Sistema de Gerenciamento ONG
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-6 md:mb-8">
            <div className="bg-gradient-card rounded-lg p-2 sm:p-4 text-center border border-border">
              <Shield className="h-4 w-4 sm:h-6 sm:w-6 text-primary mx-auto mb-1 sm:mb-2" />
              <p className="text-xs text-muted-foreground">Seguro</p>
            </div>
            <div className="bg-gradient-card rounded-lg p-2 sm:p-4 text-center border border-border">
              <Users className="h-4 w-4 sm:h-6 sm:w-6 text-primary mx-auto mb-1 sm:mb-2" />
              <p className="text-xs text-muted-foreground">Colaborativo</p>
            </div>
            <div className="bg-gradient-card rounded-lg p-2 sm:p-4 text-center border border-border">
              <Heart className="h-4 w-4 sm:h-6 sm:w-6 text-primary mx-auto mb-1 sm:mb-2" />
              <p className="text-xs text-muted-foreground">Com Amor</p>
            </div>
          </div>

          <Card className="bg-gradient-card border-border shadow-large">
            <CardHeader className="space-y-1 px-4 sm:px-6">
              <CardTitle className="text-xl sm:text-2xl text-center">
                Entrar
              </CardTitle>
              <CardDescription className="text-center text-sm sm:text-base">
                Acesse sua conta para continuar
              </CardDescription>
            </CardHeader>
            <CardContent className="px-4 sm:px-6">
              <form
                className="space-y-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSubmit(handleButtonOkClick)();
                }}
              >
                <div className="space-y-2">
                  <Label htmlFor="username">Email</Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="Digite seu email"
                    {...register("email")}
                    className="bg-background border-border"
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Senha</Label>
                  <InputPassword
                    id="password"
                    type="password"
                    placeholder="Digite sua senha"
                    {...register("password")}
                    className="bg-background border-border"
                    showPassword={showPassword}
                    handlePasswordView={handlePasswordVisibility}
                  />

                  {errors.password && (
                    <p className="text-sm text-destructive">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  // onClick={(e) => {
                  //   e.stopPropagation();
                  //   handleSubmit(handleButtonOkClick)()
                  // }
                  // }
                  loading={isLoading}
                  loadingText="Entrando..."

                >
                  Entrar
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
      <Alert
        content={errorMessage}
        isOpen={!!errorMessage}
        onClose={clearError}
      />
    </>
  );
}
