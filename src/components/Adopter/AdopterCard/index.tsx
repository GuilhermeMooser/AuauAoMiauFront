import { Badge } from "@/components/ui/badge";
import { Users, Mail, Phone, Clock, Edit, Eye } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MinimalAdopter } from "@/types";
import { Button } from "@/components/ui/button";
import { useAdopterCard } from "./useAdopterCard";
import { formatDate } from "@/utils/formatDate";
import { formatCPF, formatPhoneNumber } from "@/utils/format";

export type AdopterCardProps = {
  adopter: MinimalAdopter;
  handleEditClick: (adopter: MinimalAdopter) => void;
  handleViewAdopter: (adopter: MinimalAdopter) => void;
};

export default function AdopterCard({
  adopter,
  handleEditClick,
  handleViewAdopter,
}: AdopterCardProps) {
  const {
    contactValue,
    isPhoneContact,
    isContactDue,
    daysUntilContact,
  } = useAdopterCard({ adopter });

  return (
    <Card
      key={adopter.id}
      className="bg-gradient-card border-border shadow-soft hover:shadow-medium transition-all flex flex-col h-full"
    >
      <CardHeader className="flex-shrink-0">
        <div className="flex flex-col">
          <div className="flex items-center justify-between mb-1">
            <CardTitle className="text-xl text-foreground">
              {adopter.name}
            </CardTitle>

            <Badge
              className={`${adopter.audit.deletedAt === null
                ? "bg-success text-success-foreground"
                : "bg-muted text-muted-foreground"
                }`}
            >
              {adopter.audit.deletedAt === null ? "Ativo" : "Inativo"}
            </Badge>
          </div>

          <div className="flex items-center justify-end h-6">
            {isContactDue && adopter.activeNotification && (
              <Badge variant="destructive" className="text-xs">
                <Clock className="h-3 w-3 mr-1" />
                Contato Vencido
              </Badge>
            )}
          </div>
        </div>
        <CardDescription>
          Cadastrado em {formatDate(adopter.audit.createdAt)}
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-grow flex flex-col">
        <div className="space-y-4 flex-grow flex flex-col">
          {/* Profile icon - altura fixa */}
          <div className="w-full h-32 bg-gradient-primary rounded-lg flex items-center justify-center flex-shrink-0">
            <Users className="h-16 w-16 text-white opacity-50" />
          </div>

          {/* Contact info - altura fixa */}
          <div className="space-y-2 flex-shrink-0">
            <div className="flex items-center space-x-2 text-sm">
              <Mail className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <span className="text-foreground truncate">{adopter.email}</span>
            </div>
            {/* Espaço reservado para telefone - sempre ocupa espaço */}
            <div className="flex items-center space-x-2 text-sm h-5">
              {isPhoneContact && (
                <>
                  <Phone className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <span className="text-foreground">
                    {formatPhoneNumber(contactValue!)}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Basic info - altura fixa */}
          <div className="space-y-1 text-sm flex-shrink-0">
            <div>
              <span className="text-muted-foreground">CPF: </span>
              <span className="text-foreground">{formatCPF(adopter.cpf)}</span>
            </div>
          </div>

          {/* Location - altura fixa */}
          <div className="text-sm flex-shrink-0 h-5">
            {adopter?.addresses && (
              <>
                <span className="text-muted-foreground">Localização: </span>
                <span className="text-foreground">
                  {adopter?.addresses[0].city.name},{" "}
                  {adopter?.addresses[0].city.stateUf.acronym}
                </span>
              </>
            )}
          </div>

          {/* Próximo contato - altura fixa */}
          <div className="text-sm flex-shrink-0 min-h-[3rem]">
            {adopter.activeNotification && adopter.dtToNotify ? (
              <>
                <span className="text-muted-foreground">Próximo contato: </span>

                <span
                  className={
                    isContactDue
                      ? "text-destructive font-medium"
                      : "text-foreground"
                  }
                >
                  {formatDate(adopter.dtToNotify)}

                  {daysUntilContact !== null && (
                    <span className="ml-1 text-muted-foreground">
                      (
                      {daysUntilContact > 0
                        ? `em ${daysUntilContact} dias`
                        : daysUntilContact === 0
                          ? "hoje"
                          : `venceu há ${Math.abs(daysUntilContact)} dias`}
                      )
                    </span>
                  )}
                </span>
              </>
            ) : (
              <Badge variant="outline" className="text-xs">
                Notificações Desativadas
              </Badge>
            )}
          </div>

          {/* Animais - altura fixa */}
          <div className="flex-shrink-0 min-h-[4rem]">
            <p className="text-sm text-muted-foreground mb-1">
              Animais adotados ({adopter?.animals?.length})
            </p>
            {adopter?.animals?.length ?? 0 > 0 ? (
              <div className="flex flex-wrap gap-1 items-center">
                {adopter?.animals?.slice(0, 3).map((animal, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {animal.name}
                  </Badge>
                ))}
                {(adopter?.animals?.length ?? 0) - 3 > 0 && (
                  <span className="text-xs text-muted-foreground">
                    +{(adopter?.animals?.length ?? 0) - 3} outros
                  </span>
                )}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground">
                Nenhum animal adotado
              </p>
            )}
          </div>

          {/* Actions - sempre no final */}
          <div className="flex flex-col sm:flex-row gap-2 pt-2 mt-auto">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => handleEditClick(adopter)}
            >
              <Edit className="h-3 w-3 sm:mr-1" />
              <span className="hidden sm:inline ml-1">Editar</span>
            </Button>
            <Button
              variant="secondary"
              size="sm"
              className="flex-1"
              onClick={() => handleViewAdopter(adopter)}
            >
              <Eye className="h-3 w-3 sm:mr-1" />
              <span className="hidden sm:inline ml-1">Ver Detalhes</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
