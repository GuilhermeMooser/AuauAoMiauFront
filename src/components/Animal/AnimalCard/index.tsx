// import { AnimalGender, MinimalAnimal } from "@/types/animal";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Box, Edit, Eye, Heart, Hourglass, Leaf, PawPrint, Pill, ShieldCheck } from "lucide-react";
// import { formatDate } from "@/utils/formatDate";
// import { Button } from "@/components/ui/button";

// export type AnimalCardProps = {
//     animal: MinimalAnimal;
//     handleEditClick: (animal: MinimalAnimal) => void;
//     handleViewAnimal: (animal: MinimalAnimal) => void;
// };

// export default function AnimalCard({
//     animal,
//     handleEditClick,
//     handleViewAnimal
// }: AnimalCardProps) {
//     return (
//         <Card
//             key={animal.id}
//             className="bg-gradient-card border-border shadow-soft hover:shadow-medium transition-all flex flex-col h-full"
//         >
//             <CardHeader className="flex-shrink-0">
//                 <div className="flex flex-col">
//                     <div className="flex items-center justify-between mb-1">
//                         <CardTitle className="text-xl text-foreground">
//                             {animal.name}
//                         </CardTitle>

//                         <Badge
//                             className={`${animal.audit.deletedAt === null
//                                 ? "bg-success text-success-foreground"
//                                 : "bg-muted text-muted-foreground"
//                                 }`}
//                         >
//                             {animal.audit.deletedAt === null ? "Ativo" : "Inativo"}
//                         </Badge>
//                         {animal.dtOfAdoption && (
//                             <Badge variant="secondary">
//                                 <ShieldCheck className="h-3 w-3 mr-1" />
//                                 Adotado
//                             </Badge>
//                         )}
//                     </div>
//                 </div>
//                 <CardDescription>
//                     Cadastrado em {formatDate(animal.audit.createdAt)}
//                 </CardDescription>
//             </CardHeader>
//             <CardContent className="flex-grow flex flex-col">
//                 <div className="space-y-4 flex-grow flex flex-col">
//                     {/* Profile icon - altura fixa */}
//                     <div className="w-full h-32 bg-gradient-primary rounded-lg flex items-center justify-center flex-shrink-0">
//                         <Heart className="h-16 w-16 text-white opacity-50" />
//                     </div>
//                     <div className="space-y-2 flex-shrink-0">
//                         <div className="flex items-center space-x-2 text-sm">
//                             <div className="flex items-center space-x-1">
//                                 <Box className="h-4 w-4 text-muted-foreground flex-shrink-0" />
//                                 <span className="text-muted-foreground truncate">Sexo:</span>
//                                 <span className="text-foreground truncate">{animal.gender == AnimalGender.Male ? 'Macho' : 'Fêmea'}</span>
//                             </div>
//                             <div className="flex items-center space-x-1">
//                                 <Pill className="h-4 w-4 text-muted-foreground flex-shrink-0" />
//                                 <span className="text-muted-foreground">Castrado: </span>
//                                 <span className="text-foreground">{animal.castrated ? 'Sim' : 'Não'}</span>
//                             </div>
//                         </div>
//                     </div>
//                     <div className="space-y-2 flex-shrink-0">
//                         <div className="flex items-center space-x-2 text-sm">
//                             <div className="flex items-center space-x-1">
//                                 <Hourglass className="h-4 w-4 text-muted-foreground flex-shrink-0" />
//                                 <span className="text-muted-foreground truncate">Idade:</span>
//                                 <span className="text-foreground truncate">{animal.age}</span>
//                             </div>
//                             <div className="flex items-center space-x-1">
//                                 <PawPrint className="h-4 w-4 text-muted-foreground flex-shrink-0" />
//                                 <span className="text-muted-foreground truncate">Tipo:</span>
//                                 <span className="text-foreground truncate">{animal.type.type}</span>
//                             </div>
//                         </div>
//                     </div>
//                     <div className="space-y-2 flex-shrink-0">
//                         <div className="flex items-center space-x-2 text-sm">

//                             <div className="flex items-center space-x-1">
//                                 <Pill className="h-4 w-4 text-muted-foreground flex-shrink-0" />
//                                 <span className="text-muted-foreground">Raça: </span>
//                                 <span className="text-foreground">{animal.breed}</span>
//                             </div>
//                         </div>
//                     </div>
//                     <div className="space-y-2 flex-shrink-0">
//                         <div className="flex flex-col items-center space-x-2 text-sm">
//                             {animal?.dtOfRescue && (
//                                 <div className="flex items-center space-x-1">
//                                     <Box className="h-4 w-4 text-muted-foreground flex-shrink-0" />
//                                     <span className="text-muted-foreground truncate">Data de resgate:</span>
//                                     <span className="text-foreground truncate">{formatDate(animal?.dtOfRescue)}</span>
//                                 </div>

//                             )}
//                             {animal?.dtOfAdoption && (
//                                 <div className="flex items-center space-x-1">
//                                     <Box className="h-4 w-4 text-muted-foreground flex-shrink-0" />
//                                     <span className="text-muted-foreground truncate">Data de adoção:</span>
//                                     <span className="text-foreground truncate">{formatDate(animal?.dtOfAdoption)}</span>
//                                 </div>
//                             )}
//                             {animal?.dtOfDeath && (
//                                 <div className="flex items-center space-x-1">
//                                     <Box className="h-4 w-4 text-muted-foreground flex-shrink-0" />
//                                     <span className="text-muted-foreground truncate">Data da morte:</span>
//                                     <span className="text-foreground truncate">{formatDate(animal?.dtOfDeath)}</span>
//                                 </div>
//                             )}
//                         </div>
//                     </div>
//                     {/* Actions - sempre no final */}
//                     <div className="flex flex-col sm:flex-row gap-2 pt-2 mt-auto">
//                         <Button
//                             variant="outline"
//                             size="sm"
//                             className="flex-1"
//                             onClick={() => handleEditClick(animal)}
//                         >
//                             <Edit className="h-3 w-3 sm:mr-1" />
//                             <span className="hidden sm:inline ml-1">Editar</span>
//                         </Button>
//                         <Button
//                             variant="secondary"
//                             size="sm"
//                             className="flex-1"
//                             onClick={() => handleViewAnimal(animal)}
//                         >
//                             <Eye className="h-3 w-3 sm:mr-1" />
//                             <span className="hidden sm:inline ml-1">Ver Detalhes</span>
//                         </Button>
//                     </div>
//                 </div>
//             </CardContent>
//         </Card>
//     )

// }

import { AnimalGender, MinimalAnimal } from "@/types/animal";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Edit, Eye, Heart, ShieldCheck, Scissors, PawPrint, CalendarDays, FileText, Coins } from "lucide-react";
import { formatDate } from "@/utils/formatDate";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/utils/format";

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
    const isAdopted = !!animal.dtOfAdoption;
    const isDead = !!animal.dtOfDeath;
    const termsCount = animal.terms?.length ?? 0;

    const statusLabel = isDead ? "Óbito" : isAdopted ? "Adotado" : "Disponível";
    const statusClass = isDead
        ? "bg-muted text-muted-foreground"
        : isAdopted
            ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
            : "bg-success text-success-foreground";

    return (
        <Card className="bg-gradient-card border-border shadow-soft hover:shadow-medium transition-all flex flex-col h-full">
            <CardHeader className="flex-shrink-0 pb-3">
                <div className="flex items-start justify-between gap-2 mb-1">
                    <CardTitle className="text-xl text-foreground leading-tight">
                        {animal.name}
                    </CardTitle>
                    <div className="flex flex-wrap justify-end gap-1 shrink-0">
                        <Badge className={statusLabel === "Disponível" ? "bg-success text-success-foreground" : statusClass}>
                            {isAdopted && <ShieldCheck className="h-3 w-3 mr-1" />}
                            {statusLabel}
                        </Badge>
                        {animal.audit.deletedAt !== null && (
                            <Badge className="bg-muted text-muted-foreground">Inativo</Badge>
                        )}
                    </div>
                </div>
                <CardDescription>
                    Cadastrado em {formatDate(animal.audit.createdAt)}
                </CardDescription>
            </CardHeader>

            <CardContent className="flex-grow flex flex-col">
                <div className="space-y-4 flex-grow flex flex-col">
                    {/* Banner */}
                    {animal.imageUrl ? (
                        <div className="rounded-lg w-full overflow-hidden bg-muted/40">
                            <img
                                src={`${import.meta.env.VITE_API_URL}${animal.imageUrl}`}
                                alt={animal.name}
                                className="w-full h-auto object-contain"
                            />
                        </div>
                    ) : (
                        <div className="w-full h-28 bg-gradient-primary rounded-lg flex items-center justify-center flex-shrink-0">
                            <Heart className="h-14 w-14 text-white opacity-40" />
                        </div>
                    )}

                    {/* Tipo + Raça */}
                    <div className="flex items-center gap-3 text-sm flex-shrink-0">
                        <div className="flex items-center gap-1">
                            <PawPrint className="h-4 w-4 text-muted-foreground" />
                            <span className="text-foreground font-medium">{animal.type.type}</span>
                        </div>
                        <span className="text-muted-foreground">·</span>
                        <span className="text-muted-foreground truncate">{animal.breed}</span>
                    </div>

                    {/* Sexo + Castrado + Idade */}
                    <div className="flex flex-wrap gap-2 flex-shrink-0">
                        <Badge variant="outline" className="text-xs gap-1">
                            {animal.gender === AnimalGender.Male
                                ? <Heart className="h-3 w-3" />
                                : <Heart className="h-3 w-3" />}
                            {animal.gender === AnimalGender.Male ? "Macho" : "Fêmea"}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                            {animal.age} {animal.age === 1 ? "ano" : "anos"}
                        </Badge>
                        {animal.castrated && (
                            <Badge variant="outline" className="text-xs gap-1">
                                <Scissors className="h-3 w-3" />
                                Castrado
                            </Badge>
                        )}
                    </div>

                    {/* Total Cost */}
                    <div className="space-y-1 text-sm flex-shrink-0">
                        {animal.totalCost && (
                            <div className="flex items-center gap-2">
                                <Coins className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                                <span className="text-muted-foreground">Total gasto:</span>
                                <span className="text-foreground">{formatPrice(animal.totalCost)}</span>
                            </div>
                        )}
                    </div>

                    {/* Datas */}
                    <div className="space-y-1 text-sm flex-shrink-0 min-h-[3.5rem]">
                        {animal.dtOfRescue && (
                            <div className="flex items-center gap-2">
                                <CalendarDays className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                                <span className="text-muted-foreground">Resgate:</span>
                                <span className="text-foreground">{formatDate(animal.dtOfRescue)}</span>
                            </div>
                        )}
                        {animal.dtOfAdoption && (
                            <div className="flex items-center gap-2">
                                <CalendarDays className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                                <span className="text-muted-foreground">Adoção:</span>
                                <span className="text-foreground">{formatDate(animal.dtOfAdoption)}</span>
                            </div>
                        )}
                        {animal.dtOfDeath && (
                            <div className="flex items-center gap-2">
                                <CalendarDays className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                                <span className="text-muted-foreground">Óbito:</span>
                                <span className="text-foreground">{formatDate(animal.dtOfDeath)}</span>
                            </div>
                        )}
                    </div>

                    {/* Termos */}
                    <div className="flex-shrink-0 min-h-[2rem]">
                        <div className="flex items-center gap-2">
                            <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">
                                {termsCount === 0
                                    ? "Nenhum termo vinculado"
                                    : `${termsCount} termo${termsCount > 1 ? "s" : ""} vinculado${termsCount > 1 ? "s" : ""}`}
                            </span>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-2 pt-2 mt-auto">
                        <Button variant="outline" size="sm" className="flex-1" onClick={() => handleEditClick(animal)}>
                            <Edit className="h-3 w-3 sm:mr-1" />
                            <span className="hidden sm:inline ml-1">Editar</span>
                        </Button>
                        <Button variant="secondary" size="sm" className="flex-1" onClick={() => handleViewAnimal(animal)}>
                            <Eye className="h-3 w-3 sm:mr-1" />
                            <span className="hidden sm:inline ml-1">Ver Detalhes</span>
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}