import { LogOut, Bell, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAppHeader } from "./useAppHeader";
import ConfirmModal from "@/components/ConfirmModal";
import Alert from "@/components/Alert";
import WhatsAppIcon from '@mui/icons-material/WhatsApp';

export default function AppHeader() {
  const {
    auth,
    isModalOpen,
    errorMessage,
    clearError,
    handleLogoutConfirm,
    handleCloseModal,
    handleLogout,
    getInitials,
    notifications,
    handleWhatsappSend
  } = useAppHeader();

  const { pending, open, setOpen, clearAll, dismissOne, loading } = notifications;

  return (
    <>
      <header className="h-16 border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="flex items-center justify-between h-full px-4">
          <div className="flex items-center space-x-2 md:space-x-4 min-w-0">
            <SidebarTrigger className="hover:bg-muted" />
            <div className="hidden sm:block">
              <h1 className="text-base md:text-lg font-semibold text-foreground truncate">
                Sistema de Gerenciamento ONG
              </h1>
            </div>
          </div>

          <div className="flex items-center space-x-2 md:space-x-4">
            {/* Sino */}
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={() => setOpen(true)}
            >
              <Bell className="h-4 w-4" />
              {pending.length > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-destructive text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {pending.length > 9 ? '9+' : pending.length}
                </span>
              )}
            </Button>

            {/* User Menu — seu código existente sem alteração */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-gradient-primary text-white">
                      {getInitials(auth?.user.name || "U")}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{auth?.user.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">{auth?.user.email}</p>
                    <p className="text-xs leading-none text-muted-foreground capitalize">
                      {auth?.user.role.name}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sair</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Modal de notificações */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle>Adotantes para notificar</DialogTitle>
              {pending.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground text-xs"
                  onClick={clearAll}
                >
                  Limpar tudo
                </Button>
              )}
            </div>
          </DialogHeader>

          {loading ? (
            <p className="text-sm text-muted-foreground text-center py-6">Carregando...</p>
          ) : pending.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">
              Nenhum adotante pendente
            </p>
          ) : (
            <ul className="divide-y divide-border max-h-96 overflow-y-auto">
              {pending.map(a => (
                <li key={a.id} className="flex items-center justify-between py-3">
                  <div className="w-full pr-4">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">{a.name}</p>

                      <button
                        onClick={() => handleWhatsappSend(a.phone)}
                        className="text-green-500 hover:text-green-400 transition-colors"
                      >
                        <WhatsAppIcon className="text-base" />
                      </button>
                    </div>

                    <p className="text-xs text-muted-foreground">
                      <span className="text-xs text-white">Email:</span> {a.email}
                    </p>

                    <p className="text-xs text-muted-foreground">
                      <span className="text-xs text-white">Telefone Principal:</span> {a.phone}
                    </p>
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-destructive mb-6"
                    onClick={() => dismissOne(a.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </DialogContent>
      </Dialog>

      <Alert content={errorMessage} isOpen={!!errorMessage} onClose={clearError} />
      <ConfirmModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onNotConfirm={handleCloseModal}
        onConfirm={handleLogoutConfirm}
        content="Deseja encerrar a sessão?"
      />
    </>
  );
}