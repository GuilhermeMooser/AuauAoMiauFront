import { AnimalGender, MinimalAnimal } from "@/types/animal";
import { useAnimalCard } from "./useAnimalCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Box, Edit, Eye, Heart, Hourglass, Leaf, PawPrint, Pill, ShieldCheck } from "lucide-react";
import { formatDate } from "@/utils/formatDate";
import { Button } from "@/components/ui/button";

export type AnimalCardProps = {
    animal: MinimalAnimal;
    handleEditClick: (animal: MinimalAnimal) => void;
    handleViewAnimal: (animal: MinimalAnimal) => void;
};

export default function AnimalCard({
    animal,
    handleEditClick,
    handleViewAnimal
}: AnimalCardProps) {
    return (
        <Card
            key={animal.id}
            className="bg-gradient-card border-border shadow-soft hover:shadow-medium transition-all flex flex-col h-full"
        >
            <CardHeader className="flex-shrink-0">
                <div className="flex flex-col">
                    <div className="flex items-center justify-between mb-1">
                        <CardTitle className="text-xl text-foreground">
                            {animal.name}
                        </CardTitle>

                        <Badge
                            className={`${animal.audit.deletedAt === null
                                ? "bg-success text-success-foreground"
                                : "bg-muted text-muted-foreground"
                                }`}
                        >
                            {animal.audit.deletedAt === null ? "Ativo" : "Inativo"}
                        </Badge>
                        {animal.dtOfAdoption && (
                            <Badge variant="secondary">
                                <ShieldCheck className="h-3 w-3 mr-1" />
                                Adotado
                            </Badge>
                        )}
                    </div>
                </div>
                <CardDescription>
                    Cadastrado em {formatDate(animal.audit.createdAt)}
                </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col">
                <div className="space-y-4 flex-grow flex flex-col">
                    {/* Profile icon - altura fixa */}
                    <div className="w-full h-32 bg-gradient-primary rounded-lg flex items-center justify-center flex-shrink-0">
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
                    </div>
                    <div className="space-y-2 flex-shrink-0">
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
                    </div>
                    <div className="space-y-2 flex-shrink-0">
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
                            <div className="flex items-center space-x-1">
                                <Box className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                <span className="text-muted-foreground truncate">Data de resgate:</span>
                                <span className="text-foreground truncate">{formatDate(animal?.dtOfRescue)}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                                <Box className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                <span className="text-muted-foreground truncate">Data de adoção:</span>
                                <span className="text-foreground truncate">{formatDate(animal?.dtOfAdoption)}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                                <Box className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                <span className="text-muted-foreground truncate">Data da morte:</span>
                                <span className="text-foreground truncate">{formatDate(animal?.dtOfDeath)}</span>
                            </div>
                        </div>
                    </div>
                    {/* Actions - sempre no final */}
                    <div className="flex flex-col sm:flex-row gap-2 pt-2 mt-auto">
                        <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                            onClick={() => handleEditClick(animal)}
                        >
                            <Edit className="h-3 w-3 sm:mr-1" />
                            <span className="hidden sm:inline ml-1">Editar</span>
                        </Button>
                        <Button
                            variant="secondary"
                            size="sm"
                            className="flex-1"
                            onClick={() => handleViewAnimal(animal)}
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