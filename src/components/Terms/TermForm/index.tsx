import { Terms } from "@/types/terms";
import { useTermForm } from "./useTermForm";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    ChevronLeft,
    ChevronRight,
    Loader2,
    PawPrint,
    Plus,
    Search,
    Trash2,
    UserRound,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Alert from "@/components/Alert";
import ConfirmModal from "@/components/ConfirmModal";

export type TermFormProps = {
    term?: Terms;
    onCancel: () => void;
    mode: "create" | "edit" | "view";
    onCreateSuccess?: (newTerm: Terms) => void;
    onUpdateSuccess?: (updatedTerm: Terms) => void;
    onDeleteSuccess?: (deletedId: string) => void;
}

export default function TermForm({
    mode,
    onCancel,
    term,
    onCreateSuccess,
    onDeleteSuccess,
    onUpdateSuccess
}: TermFormProps) {
    const {
        form,
        navigate,
        isReadOnly,
        canExcludeTerm,
        handleDeleteTerm,
        handleCloseModal,
        submitting,
        handleButtonConfirm,
        onError,
        errorMessage,
        clearError,
        isModalDeleteTermOpen,
        handleCloseDeleteTermModal,
        handleDeleteTermConfirm,
        searchTermAnimal,
        setSearchTermAnimal,
        animalsData,
        animalIsLoading,
        animalPage,
        setAnimalPage,
        animalTotalPages,
        searchTermAdopter,
        setSearchTermAdopter,
        adoptersData,
        adopterIsLoading,
        adopterPage,
        setAdopterPage,
        adopterTotalPages,
    } = useTermForm({
        mode,
        onCancel,
        term,
        onCreateSuccess,
        onDeleteSuccess,
        onUpdateSuccess
    });

    const selectedAnimalId = form.watch("animalId");
    const selectedAdopterId = form.watch("adopterId");

    const isExisting = !!term;

    return (
        <>
            <Form {...form}>
                {/* ── Animal ──────────────────────────────────────────────── */}
                {canExcludeTerm && (
                    <div
                        className="transition hover:text-red-500 cursor-pointer flex justify-end"
                        onClick={handleDeleteTerm}
                    >
                        <Trash2 className="h-4 w-4" />
                    </div>
                )}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                                <PawPrint className="h-5 w-5" />
                                Animal
                            </div>
                            {!isReadOnly && !isExisting && (
                                <button
                                    type="button"
                                    className="border-2 p-1 rounded-sm hover:border-primary/60 hover:bg-muted/40"
                                    onClick={() => navigate("/admin/animais")}
                                >
                                    <Plus className="h-4 w-4" />
                                </button>
                            )}
                        </CardTitle>
                        <CardDescription>
                            {isExisting
                                ? "Animal vinculado a este termo"
                                : "Pesquise e selecione o animal para o termo de compromisso"}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {isExisting ? (
                            <button
                                type="button"
                                onClick={() => navigate("/admin/animais")}
                                className="flex flex-col items-start gap-1 rounded-lg border border-primary bg-primary/10 ring-1 ring-primary p-3 text-left text-sm w-full sm:w-auto hover:bg-primary/20 transition-all cursor-pointer"
                            >
                                <div className="flex items-center justify-between w-full gap-2">
                                    <span className="font-medium">{term.animal.name}</span>
                                    <Badge variant="default" className="text-[10px] px-1.5 py-0 shrink-0">
                                        Vinculado
                                    </Badge>
                                </div>
                                {term.animal.breed && (
                                    <span className="text-xs text-muted-foreground">
                                        {term.animal.breed}
                                    </span>
                                )}
                                <div className="flex flex-wrap gap-1 mt-0.5">
                                    <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                                        {term.animal.gender === "M" ? "Macho" : "Fêmea"}
                                    </Badge>
                                    {term.animal.age != null && (
                                        <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                                            {term.animal.age} {term.animal.age === 1 ? "ano" : "anos"}
                                        </Badge>
                                    )}
                                    {term.animal.castrated && (
                                        <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                                            Castrado
                                        </Badge>
                                    )}
                                    {term.animal.dtOfAdoption && (
                                        <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                                            Adotado em {new Date(term.animal.dtOfAdoption).toLocaleDateString("pt-BR")}
                                        </Badge>
                                    )}
                                </div>
                            </button>
                        ) : (
                            <>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        className="pl-9"
                                        placeholder="Pesquisar animal pelo nome..."
                                        value={searchTermAnimal}
                                        onChange={(e) => {
                                            setSearchTermAnimal(e.target.value);
                                            setAnimalPage(1);
                                        }}
                                    />
                                </div>

                                <FormField
                                    control={form.control}
                                    name="animalId"
                                    render={({ field }) => (
                                        <FormItem className="hidden">
                                            <FormControl>
                                                <Input {...field} />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />

                                {animalIsLoading ? (
                                    <div className="flex justify-center py-6">
                                        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                                    </div>
                                ) : animalsData.items.length === 0 ? (
                                    <p className="text-sm text-muted-foreground text-center py-4 border border-dashed border-border rounded-lg">
                                        Nenhum animal encontrado.
                                    </p>
                                ) : (
                                    <div className="space-y-3">
                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                            {animalsData.items.map((animal) => {
                                                const isSelected = selectedAnimalId === animal.id;
                                                const hasTerm = (animal.terms?.length ?? 0) > 0;

                                                return (
                                                    <button
                                                        key={animal.id}
                                                        type="button"
                                                        disabled={hasTerm}
                                                        onClick={() => {
                                                            if (!hasTerm) form.setValue("animalId", animal.id, { shouldValidate: true });
                                                        }}
                                                        className={`relative flex flex-col items-start gap-1 rounded-lg border p-3 text-left text-sm transition-all
                                                            ${hasTerm
                                                                ? "border-border bg-muted/30 opacity-50 cursor-not-allowed"
                                                                : isSelected
                                                                    ? "border-primary bg-primary/10 ring-1 ring-primary cursor-pointer hover:border-primary/60 hover:bg-muted/40"
                                                                    : "border-border bg-background cursor-pointer hover:border-primary/60 hover:bg-muted/40"
                                                            }`}
                                                    >
                                                        <div className="flex w-full items-center justify-between gap-1">
                                                            <span className="font-medium truncate">{animal.name}</span>
                                                            {hasTerm ? (
                                                                <Badge variant="secondary" className="text-[10px] px-1.5 py-0 shrink-0">
                                                                    Indisponível
                                                                </Badge>
                                                            ) : isSelected && (
                                                                <Badge variant="default" className="text-[10px] px-1.5 py-0 shrink-0">
                                                                    Selecionado
                                                                </Badge>
                                                            )}
                                                        </div>
                                                        {animal.breed && (
                                                            <span className="text-xs text-muted-foreground truncate w-full">
                                                                {animal.breed}
                                                            </span>
                                                        )}
                                                    </button>
                                                );
                                            })}
                                        </div>

                                        {animalTotalPages > 1 && (
                                            <div className="flex items-center justify-between pt-1">
                                                <span className="text-xs text-muted-foreground">
                                                    Página {animalPage} de {animalTotalPages}
                                                </span>
                                                <div className="flex items-center gap-1">
                                                    <Button type="button" variant="outline" size="icon" className="h-7 w-7"
                                                        disabled={animalPage <= 1}
                                                        onClick={() => setAnimalPage((p) => Math.max(1, p - 1))}>
                                                        <ChevronLeft className="h-3.5 w-3.5" />
                                                    </Button>
                                                    <Button type="button" variant="outline" size="icon" className="h-7 w-7"
                                                        disabled={animalPage >= animalTotalPages}
                                                        onClick={() => setAnimalPage((p) => Math.min(animalTotalPages, p + 1))}>
                                                        <ChevronRight className="h-3.5 w-3.5" />
                                                    </Button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                <FormField
                                    control={form.control}
                                    name="animalId"
                                    render={() => <FormMessage />}
                                />
                            </>
                        )}
                    </CardContent>
                </Card>

                {/* ── Adotante ─────────────────────────────────────────────── */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                                <UserRound className="h-5 w-5" />
                                Adotante
                            </div>
                            {!isReadOnly && !isExisting && (
                                <button
                                    type="button"
                                    className="border-2 p-1 rounded-sm hover:border-primary/60 hover:bg-muted/40"
                                    onClick={() => navigate("/admin/adotantes")}
                                >
                                    <Plus className="h-4 w-4" />
                                </button>
                            )}
                        </CardTitle>
                        <CardDescription>
                            {isExisting
                                ? "Adotante vinculado a este termo"
                                : "Pesquise e selecione o adotante para o termo de compromisso"}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {isExisting ? (
                            <button
                                type="button"
                                onClick={() => navigate("/admin/adotantes")}
                                className="flex flex-col items-start gap-1 rounded-lg border border-primary bg-primary/10 ring-1 ring-primary p-3 text-left text-sm w-full sm:w-auto hover:bg-primary/20 transition-all cursor-pointer"
                            >
                                <div className="flex items-center justify-between w-full gap-2">
                                    <span className="font-medium">{term.adopter.name}</span>
                                    <Badge variant="default" className="text-[10px] px-1.5 py-0 shrink-0">
                                        Vinculado
                                    </Badge>
                                </div>
                                <span className="text-xs text-muted-foreground">
                                    CPF: {term.adopter.cpf}
                                </span>
                                {term.adopter.email && (
                                    <span className="text-xs text-muted-foreground">
                                        {term.adopter.email}
                                    </span>
                                )}
                            </button>
                        ) : (
                            <>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        className="pl-9"
                                        placeholder="Pesquisar adotante pelo nome..."
                                        value={searchTermAdopter}
                                        onChange={(e) => {
                                            setSearchTermAdopter(e.target.value);
                                            setAdopterPage(1);
                                        }}
                                    />
                                </div>

                                <FormField
                                    control={form.control}
                                    name="adopterId"
                                    render={({ field }) => (
                                        <FormItem className="hidden">
                                            <FormControl>
                                                <Input {...field} />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />

                                {adopterIsLoading ? (
                                    <div className="flex justify-center py-6">
                                        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                                    </div>
                                ) : adoptersData.items.length === 0 ? (
                                    <p className="text-sm text-muted-foreground text-center py-4 border border-dashed border-border rounded-lg">
                                        Nenhum adotante encontrado.
                                    </p>
                                ) : (
                                    <div className="space-y-3">
                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                            {adoptersData.items.map((adopter) => {
                                                const isSelected = selectedAdopterId === adopter.id;
                                                return (
                                                    <button
                                                        key={adopter.id}
                                                        type="button"
                                                        onClick={() =>
                                                            form.setValue("adopterId", adopter.id, { shouldValidate: true })
                                                        }
                                                        className={`relative flex flex-col items-start gap-1 rounded-lg border p-3 text-left text-sm transition-all cursor-pointer hover:border-primary/60 hover:bg-muted/40
                                                            ${isSelected
                                                                ? "border-primary bg-primary/10 ring-1 ring-primary"
                                                                : "border-border bg-background"
                                                            }`}
                                                    >
                                                        <div className="flex w-full items-center justify-between gap-1">
                                                            <span className="font-medium truncate">{adopter.name}</span>
                                                            {isSelected && (
                                                                <Badge variant="default" className="text-[10px] px-1.5 py-0 shrink-0">
                                                                    Selecionado
                                                                </Badge>
                                                            )}
                                                        </div>
                                                        {adopter.email && (
                                                            <span className="text-xs text-muted-foreground truncate w-full">
                                                                {adopter.email}
                                                            </span>
                                                        )}
                                                    </button>
                                                );
                                            })}
                                        </div>

                                        {adopterTotalPages > 1 && (
                                            <div className="flex items-center justify-between pt-1">
                                                <span className="text-xs text-muted-foreground">
                                                    Página {adopterPage} de {adopterTotalPages}
                                                </span>
                                                <div className="flex items-center gap-1">
                                                    <Button type="button" variant="outline" size="icon" className="h-7 w-7"
                                                        disabled={adopterPage <= 1}
                                                        onClick={() => setAdopterPage((p) => Math.max(1, p - 1))}>
                                                        <ChevronLeft className="h-3.5 w-3.5" />
                                                    </Button>
                                                    <Button type="button" variant="outline" size="icon" className="h-7 w-7"
                                                        disabled={adopterPage >= adopterTotalPages}
                                                        onClick={() => setAdopterPage((p) => Math.min(adopterTotalPages, p + 1))}>
                                                        <ChevronRight className="h-3.5 w-3.5" />
                                                    </Button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                <FormField
                                    control={form.control}
                                    name="adopterId"
                                    render={() => <FormMessage />}
                                />
                            </>
                        )}
                    </CardContent>
                </Card>

                {/* ── Actions ─────────────────────────────────────────────── */}
                <div className="flex justify-end space-x-4">
                    <Button type="button" variant="outline" onClick={handleCloseModal}>
                        {isReadOnly ? "Fechar" : "Cancelar"}
                    </Button>
                    {!isReadOnly && (
                        <Button
                            onClick={form.handleSubmit(
                                handleButtonConfirm,
                                (errors) => console.log("Erros Zod:", errors)
                            )}
                        >
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
                isOpen={isModalDeleteTermOpen}
                onClose={handleCloseDeleteTermModal}
                onNotConfirm={handleCloseDeleteTermModal}
                onConfirm={handleDeleteTermConfirm}
                content={"Deseja excluir este termo de compromisso?"}
            />
        </>
    );
}
