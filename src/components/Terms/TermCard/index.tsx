import { Terms } from "@/types/terms";
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Edit, Eye } from "lucide-react";
import { formatDate } from "@/utils/formatDate";
import { Button } from "@/components/ui/button";

export type TermCardProps = {
    term: Terms;
    handleEditClick: (term: Terms) => void;
    handleViewTerm: (term: Terms) => void;
};

export default function TermCard(
    {
        term,
        handleEditClick,
        handleViewTerm
    }: TermCardProps
) {
    return (
        <Card
            key={term.id}
            className="bg-gradient-card border-border shadow-soft hover:shadow-medium transition-all flex flex-col h-full"
        >
            <CardHeader className="flex-shrink-0">
                <div className="flex flex-col">
                    <div className="flex items-center justify-between mb-1">
                        {/* <CardTitle className="text-xl text-foreground">
                            {animal.name}
                        </CardTitle> */}

                        <Badge
                            className={`${term.audit?.deletedAt === null
                                ? "bg-success text-success-foreground"
                                : "bg-muted text-muted-foreground"
                                }`}
                        >
                            {term.audit?.deletedAt === null ? "Ativo" : "Inativo"}
                        </Badge>
                    </div>
                </div>
                <CardDescription>
                    Cadastrado em {formatDate(term.audit.createdAt)}
                </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col">
                <div className="space-y-4 flex-grow flex flex-col">
                    {/* Profile icon - altura fixa */}
                    {/* <div className="w-full h-32 bg-gradient-primary rounded-lg flex items-center justify-center flex-shrink-0">
                        <Heart className="h-16 w-16 text-white opacity-50" />
                    </div>
                    <div className="space-y-2 flex-shrink-0">
                        <div className="flex items-center space-x-2 text-sm">
                            <div className="flex items-center space-x-1">
                                <Box className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                <span className="text-muted-foreground truncate">Sexo:</span>
                                <span className="text-foreground truncate">{animal.gender == AnimalGender.Male ? 'Macho' : 'Fêmea'}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                                <Pill className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                <span className="text-muted-foreground">Castrado: </span>
                                <span className="text-foreground">{animal.castrated ? 'Sim' : 'Não'}</span>
                            </div>
                        </div>
                    </div> */}
                    {/* <div className="space-y-2 flex-shrink-0">
                        <div className="flex items-center space-x-2 text-sm">
                            <div className="flex items-center space-x-1">
                                <Hourglass className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                <span className="text-muted-foreground truncate">Idade:</span>
                                <span className="text-foreground truncate">{animal.age}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                                <PawPrint className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                <span className="text-muted-foreground truncate">Tipo:</span>
                                <span className="text-foreground truncate">{animal.type.type}</span>
                            </div>
                        </div>
                    </div> */}
                    {/* <div className="space-y-2 flex-shrink-0">
                        <div className="flex items-center space-x-2 text-sm">

                            <div className="flex items-center space-x-1">
                                <Pill className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                <span className="text-muted-foreground">Raça: </span>
                                <span className="text-foreground">{animal.breed}</span>
                            </div>
                        </div>
                    </div>
                    <div className="space-y-2 flex-shrink-0">
                        <div className="flex flex-col items-center space-x-2 text-sm">
                            {animal?.dtOfRescue && (
                                <div className="flex items-center space-x-1">
                                    <Box className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                    <span className="text-muted-foreground truncate">Data de resgate:</span>
                                    <span className="text-foreground truncate">{formatDate(animal?.dtOfRescue)}</span>
                                </div>

                            )}
                            {animal?.dtOfAdoption && (
                                <div className="flex items-center space-x-1">
                                    <Box className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                    <span className="text-muted-foreground truncate">Data de adoção:</span>
                                    <span className="text-foreground truncate">{formatDate(animal?.dtOfAdoption)}</span>
                                </div>
                            )}
                            {animal?.dtOfDeath && (
                                <div className="flex items-center space-x-1">
                                    <Box className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                    <span className="text-muted-foreground truncate">Data da morte:</span>
                                    <span className="text-foreground truncate">{formatDate(animal?.dtOfDeath)}</span>
                                </div>
                            )}
                        </div>
                    </div> */}
                    {/* Actions - sempre no final */}
                    <div className="flex flex-col sm:flex-row gap-2 pt-2 mt-auto">
                        <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                            onClick={() => handleEditClick(term)}
                        >
                            <Edit className="h-3 w-3 sm:mr-1" />
                            <span className="hidden sm:inline ml-1">Editar</span>
                        </Button>
                        <Button
                            variant="secondary"
                            size="sm"
                            className="flex-1"
                            onClick={() => handleViewTerm(term)}
                        >
                            <Eye className="h-3 w-3 sm:mr-1" />
                            <span className="hidden sm:inline ml-1">Ver Detalhes</span>
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
