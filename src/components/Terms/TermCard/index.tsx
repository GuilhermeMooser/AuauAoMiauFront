// import { Terms } from "@/types/terms";
// import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Edit, Eye } from "lucide-react";
// import { formatDate } from "@/utils/formatDate";
// import { Button } from "@/components/ui/button";

// export type TermCardProps = {
//     term: Terms;
//     handleEditClick: (term: Terms) => void;
//     handleViewTerm: (term: Terms) => void;
// };

// export default function TermCard(
//     {
//         term,
//         handleEditClick,
//         handleViewTerm
//     }: TermCardProps
// ) {
//     return (
//         <Card
//             key={term.id}
//             className="bg-gradient-card border-border shadow-soft hover:shadow-medium transition-all flex flex-col h-full"
//         >
//             <CardHeader className="flex-shrink-0">
//                 <div className="flex flex-col">
//                     <div className="flex items-center justify-between mb-1">
//                         {/* <CardTitle className="text-xl text-foreground">
//                             {animal.name}
//                         </CardTitle> */}

//                         <Badge
//                             className={`${term.audit?.deletedAt === null
//                                 ? "bg-success text-success-foreground"
//                                 : "bg-muted text-muted-foreground"
//                                 }`}
//                         >
//                             {term.audit?.deletedAt === null ? "Ativo" : "Inativo"}
//                         </Badge>
//                     </div>
//                 </div>
//                 <CardDescription>
//                     Cadastrado em {formatDate(term.audit.createdAt)}
//                 </CardDescription>
//             </CardHeader>
//             <CardContent className="flex-grow flex flex-col">
//                 <div className="space-y-4 flex-grow flex flex-col">

//                     {/* Actions - sempre no final */}
//                     <div className="flex flex-col sm:flex-row gap-2 pt-2 mt-auto">
//                         <Button
//                             variant="outline"
//                             size="sm"
//                             className="flex-1"
//                             onClick={() => {}}
//                         >
//                             <Edit className="h-3 w-3 sm:mr-1" />
//                             <span className="hidden sm:inline ml-1">Ver PDF</span>
//                         </Button>
//                         <Button
//                             variant="secondary"
//                             size="sm"
//                             className="flex-1"
//                             onClick={() => handleViewTerm(term)}
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

import { Terms } from "@/types/terms";
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Eye, FileText, PawPrint, FileCheck2, UserRound } from "lucide-react";
import { formatDate } from "@/utils/formatDate";
import { Button } from "@/components/ui/button";
import { AnimalGender } from "@/types/animal";
import { formatCPF } from "@/utils/format";

export type TermCardProps = {
    term: Terms;
    handleEditClick: (term: Terms) => void;
    handleViewTerm: (term: Terms) => void;
};

export default function TermCard({ term, handleEditClick, handleViewTerm }: TermCardProps) {
    const isActive = term.audit?.deletedAt === null;

    return (
        <Card className="bg-gradient-card border-border shadow-soft hover:shadow-medium transition-all flex flex-col h-full">
            <CardHeader className="flex-shrink-0 pb-3">
                <div className="flex items-start justify-between gap-2 mb-1">
                    <div className="flex items-center gap-2">
                        <FileCheck2 className="h-5 w-5 text-muted-foreground shrink-0" />
                        <span className="text-base font-semibold text-foreground leading-tight truncate">
                            Termo de Compromisso
                        </span>
                    </div>
                    <Badge className={isActive ? "bg-success text-success-foreground shrink-0" : "bg-muted text-muted-foreground shrink-0"}>
                        {isActive ? "Ativo" : "Inativo"}
                    </Badge>
                </div>
                <CardDescription>
                    Cadastrado em {formatDate(term.audit.createdAt)}
                </CardDescription>
            </CardHeader>

            <CardContent className="flex-grow flex flex-col">
                <div className="space-y-4 flex-grow flex flex-col">

                    {/* Banner */}
                    <div className="w-full h-28 bg-gradient-primary rounded-lg flex items-center justify-center flex-shrink-0">
                        <FileText className="h-14 w-14 text-white opacity-40" />
                    </div>

                    {/* Animal */}
                    <div className="flex-shrink-0 space-y-1">
                        <div className="flex items-center gap-1.5 mb-1">
                            <PawPrint className="h-3.5 w-3.5 text-muted-foreground" />
                            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Animal</span>
                        </div>
                        <p className="text-sm font-medium text-foreground">{term.animal.name}</p>
                        <div className="flex flex-wrap gap-1">
                            <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                                {term.animal.breed}
                            </Badge>
                            <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                                {term.animal.gender === AnimalGender.Male ? "Macho" : "Fêmea"}
                            </Badge>
                            <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                                {term.animal.age} {term.animal.age === 1 ? "ano" : "anos"}
                            </Badge>
                            {term.animal.castrated && (
                                <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                                    Castrado
                                </Badge>
                            )}
                        </div>
                    </div>

                    <div className="border-t border-border" />

                    {/* Adotante */}
                    <div className="flex-shrink-0 space-y-1">
                        <div className="flex items-center gap-1.5 mb-1">
                            <UserRound className="h-3.5 w-3.5 text-muted-foreground" />
                            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Adotante</span>
                        </div>
                        <p className="text-sm font-medium text-foreground">{term.adopter.name}</p>
                        <p className="text-xs text-muted-foreground">{formatCPF(term.adopter.cpf)}</p>
                        <p className="text-xs text-muted-foreground truncate">{term.adopter.email}</p>
                    </div>

                    <div className="border-t border-border" />

                    {/* Data de adoção */}
                    <div className="flex-shrink-0 min-h-[1.25rem]">
                        {term.animal.dtOfAdoption && (
                            <div className="flex items-center gap-2 text-sm">
                                <CalendarDays className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                                <span className="text-muted-foreground">Adoção:</span>
                                <span className="text-foreground">{formatDate(term.animal.dtOfAdoption)}</span>
                            </div>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-2 pt-2 mt-auto">
                        <Button variant="outline" size="sm" className="flex-1" onClick={() => { }} disabled={true}>
                            <FileText className="h-3 w-3 sm:mr-1" />
                            <span className="hidden sm:inline ml-1">Ver PDF</span>
                        </Button>
                        <Button variant="secondary" size="sm" className="flex-1" onClick={() => handleViewTerm(term)}>
                            <Eye className="h-3 w-3 sm:mr-1" />
                            <span className="hidden sm:inline ml-1">Ver Detalhes</span>
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
