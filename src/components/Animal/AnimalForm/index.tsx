import { useAnimalForm } from "./useAnimalForm";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
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
    CalendarDays,
    Coins,
    FileText,
    Loader2,
    PawPrint,
    Plus,
    Stethoscope,
    Trash2,
    UserRound,
} from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Alert from "@/components/Alert";
import Icon from "@/components/Icon";
import ConfirmModal from "@/components/ConfirmModal";

import { Input } from "@/components/ui/input";
import { DatePicker } from "@/components/ui/date-picker";
import { Checkbox } from "@/components/ui/checkbox";
import { Animal, procedureConfig, ProcedureType } from "@/types/animal";
import { Textarea } from "@/components/ui/textarea";
import { AnimalProcedureEnum } from "@/types/animalProcedures";
import { formatPrice } from "@/utils/format";
import AnimalImageCard from "../AnimalImageCard";

export type AnimalFormProps = {
    animal?: Animal;
    onCancel: () => void;
    mode: "create" | "edit" | "view";
    onCreateSuccess?: (newAnimal: Animal) => void;
    onUpdateSuccess?: (updatedAnimal: Animal) => void;
    onDeleteSuccess?: (deletedId: string) => void;
}

export default function AnimalForm({
    mode,
    onCancel,
    animal,
    onCreateSuccess,
    onDeleteSuccess,
    onUpdateSuccess
}: AnimalFormProps) {
    const {
        form,
        isReadOnly,
        canExcludeAnimal,
        handleDeleteAnimal,
        animalTypesData,
        isLoadingAnimalType,
        expensesFields,
        appendExpense,
        removeExpense,
        animalProceduresFields,
        appendAnimalProcedures,
        removeAnimalProcedures,
        handleAddAnimalProcedureExpense,
        handleRemoveAnimalProcedureExpense,
        getProceduresByType,
        handleCloseModal,
        submitting,
        handleButtonConfirm,
        onError,
        errorMessage,
        clearError,
        isModalDeleteAnimalOpen,
        handleCloseDeleteAnimalModal,
        handleDeleteAnimalConfirm,
        navigate,
        isModalDeleteTermOpen,
        handleDeleteTerm,
        handleCloseDeleteTermModal,
        handleDeleteTermConfirm,
        isCreateMode,
        animalImageUrl,
    } = useAnimalForm(
        {
            mode,
            onCancel,
            animal,
            onCreateSuccess,
            onDeleteSuccess,
            onUpdateSuccess
        }
    )

    return (
        <>
            <Form {...form}>
                {
                    !isCreateMode && !!animal?.totalCost && (
                        <>
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center justify-between gap-2">
                                        <div className="flex items-center gap-2">
                                            <PawPrint className="h-5 w-5" />
                                            Total Gasto
                                        </div>
                                        <div>{formatPrice(animal.totalCost)}</div>
                                    </CardTitle>
                                </CardHeader>
                            </Card>
                        </>
                    )
                }

                {/* ── Informações Básicas ──────────────────────────────────── */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                                <PawPrint className="h-5 w-5" />
                                Informações Básicas
                            </div>
                            {canExcludeAnimal && (
                                <div
                                    className="transition hover:text-red-500 cursor-pointer"
                                    onClick={handleDeleteAnimal}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </div>
                            )}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 gap-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>*Nome do Animal</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                disabled={isReadOnly}
                                                placeholder="Nome do animal"
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
                                name="typeId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>*Tipo</FormLabel>
                                        <Select
                                            onValueChange={(val) => field.onChange(Number(val))}
                                            value={field.value > 0 ? field.value.toString() : undefined}
                                            disabled={isReadOnly || isLoadingAnimalType}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Selecione o tipo" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {animalTypesData?.map((type) => (
                                                    <SelectItem key={type.id} value={type.id.toString()}>
                                                        {type.type}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="breed"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>*Raça</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                disabled={isReadOnly}
                                                placeholder="Ex: Labrador, SRD"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <FormField
                                control={form.control}
                                name="size"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>*Porte</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                            disabled={isReadOnly}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Selecione o porte" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="pequeno">Pequeno</SelectItem>
                                                <SelectItem value="medio">Médio</SelectItem>
                                                <SelectItem value="grande">Grande</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="gender"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>*Sexo</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                            disabled={isReadOnly}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Selecione o sexo" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="M">Macho</SelectItem>
                                                <SelectItem value="F">Fêmea</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="color"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>*Cor / Pelagem</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                disabled={isReadOnly}
                                                placeholder="Ex: Caramelo, Preto"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <FormField
                                control={form.control}
                                name="age"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>*Idade (anos)</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                value={field.value ?? ""}
                                                onChange={(e) => {
                                                    const value = e.target.value.replace(
                                                        /\D/g,
                                                        ""
                                                    );
                                                    field.onChange(
                                                        value === "" ? undefined : Number(value)
                                                    );
                                                }}
                                                disabled={isReadOnly}
                                                inputMode="numeric"
                                                placeholder="Ex: 2"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="sm:col-span-2">
                                <FormField
                                    control={form.control}
                                    name="locationOfRescue"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Local de resgate</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    disabled={isReadOnly}
                                                    placeholder="Ex: Rua das flores"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="castrated"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                        <FormControl>
                                            <Checkbox
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                                disabled={isReadOnly}
                                            />
                                        </FormControl>
                                        <div className="space-y-1 leading-none">
                                            <FormLabel className="flex items-center gap-2">
                                                Castrado(a)
                                            </FormLabel>
                                            <p className="text-xs text-muted-foreground">
                                                Marque se o animal já foi castrado(a)
                                            </p>
                                        </div>
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="additionalInfo"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Informações Adicionais</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            {...field}
                                            disabled={isReadOnly}
                                            placeholder="Comportamento, características especiais, cuidados necessários..."
                                            rows={3}
                                            className="resize-none"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </CardContent>
                </Card>

                <AnimalImageCard
                    imageUrl={animalImageUrl}
                    isReadOnly={isReadOnly}
                    onFileChange={(file) => form.setValue("imageFile", file)}
                />
                {/* ── Datas e Histórico ────────────────────────────────────── */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <CalendarDays className="h-5 w-5" />
                            Datas e Histórico
                        </CardTitle>
                        <CardDescription>
                            Registre as datas importantes do animal
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="dtOfBirth"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel>Data de Nascimento</FormLabel>
                                        <FormControl className="bg-[#020817]">
                                            <DatePicker
                                                disabled={isReadOnly}
                                                date={field.value}
                                                onDateChange={field.onChange}
                                                placeholder="Selecione a data"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="dtOfRescue"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel>Data de Resgate</FormLabel>
                                        <FormControl className="bg-[#020817]">
                                            <DatePicker
                                                disabled={isReadOnly}
                                                date={field.value}
                                                onDateChange={field.onChange}
                                                placeholder="Selecione a data"
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
                                name="dtOfAdoption"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel>Data de Adoção</FormLabel>
                                        <FormControl className="bg-[#020817]">
                                            <DatePicker
                                                disabled={isReadOnly}
                                                date={field.value}
                                                onDateChange={field.onChange}
                                                placeholder="Selecione a data"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="dtOfDeath"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel>Data de Óbito</FormLabel>
                                        <FormControl className="bg-[#020817]">
                                            <DatePicker
                                                disabled={isReadOnly}
                                                date={field.value}
                                                onDateChange={field.onChange}
                                                placeholder="Selecione a data"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* ── Gastos ────────────────────────────────── */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Coins className="h-5 w-5" />
                            Gastos
                        </CardTitle>
                        <CardDescription>
                            Registre gastos importantes do animal
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {expensesFields.map((field, index) => (
                            <Card key={field.id} className="border-border">
                                <CardContent className="pt-4">
                                    <div className="flex items-center justify-between mb-4">
                                        <Badge variant="outline">Gasto {index + 1}</Badge>
                                        {!isReadOnly && (
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => removeExpense(index)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        )}
                                    </div>

                                    <div className="space-y-4">
                                        <div className="grid grid-cols-1 sm:grid-cols-1 gap-4">
                                            <FormField
                                                control={form.control}
                                                name={`expenses.${index}.description`}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>*Descrição</FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                {...field}
                                                                disabled={isReadOnly}
                                                                placeholder="Ex: Consulta veterinária"
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
                                                name={`expenses.${index}.value`}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>*Valor (R$)</FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                {...field}
                                                                value={field.value ?? ""}
                                                                onChange={(e) => {
                                                                    const value = e.target.value.replace(/[^\d,.]/, "");
                                                                    field.onChange(value === "" ? undefined : Number(value));
                                                                }}
                                                                disabled={isReadOnly}
                                                                inputMode="decimal"
                                                                placeholder="Ex: 150.00"
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name={`expenses.${index}.paymentType`}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Forma de Pagamento</FormLabel>
                                                        <Select
                                                            onValueChange={field.onChange}
                                                            defaultValue={field.value}
                                                            disabled={isReadOnly}
                                                        >
                                                            <FormControl>
                                                                <SelectTrigger>
                                                                    <SelectValue placeholder="Selecione a forma" />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                <SelectItem value="dinheiro">Dinheiro</SelectItem>
                                                                <SelectItem value="pix">Pix</SelectItem>
                                                                <SelectItem value="cartao_credito">Cartão de Crédito</SelectItem>
                                                                <SelectItem value="cartao_debito">Cartão de Débito</SelectItem>
                                                                <SelectItem value="transferencia">Transferência</SelectItem>
                                                                <SelectItem value="boleto">Boleto</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}

                        {!isReadOnly && (
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() =>
                                    appendExpense({
                                        description: "",
                                        value: 0,
                                        paymentType: "",
                                    })
                                }
                                className="w-full"
                            >
                                <Plus className="mr-2 h-4 w-4" />
                                Adicionar Gasto
                            </Button>
                        )}
                    </CardContent>
                </Card>

                {/* ── Procedimentos Médicos ────────────────────────────────── */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Stethoscope className="h-5 w-5" />
                            Procedimentos
                        </CardTitle>
                        <CardDescription>
                            Registre vacinas, medicamentos, cirurgias e outros procedimentos
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {(Object.keys(procedureConfig) as ProcedureType[]).map(
                            (type, sectionIdx) => {
                                const config = procedureConfig[type];
                                const iconName = config.icon;
                                const filteredProcedures = getProceduresByType(type);

                                return (
                                    <div key={type}>
                                        {sectionIdx > 0 && (
                                            <div className="border-t border-border mb-6" />
                                        )}

                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-2">
                                                <Icon name={iconName} className="h-4 w-4 text-muted-foreground" />
                                                <span className="text-sm font-medium">
                                                    {config.label}
                                                </span>
                                                <Badge variant="outline" className="text-xs">
                                                    {filteredProcedures.length}
                                                </Badge>
                                            </div>
                                            {!isReadOnly && (
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() =>
                                                        appendAnimalProcedures({
                                                            description: "",
                                                            procedureType: type as AnimalProcedureEnum,
                                                            veterinarian: "",
                                                            observation: "",
                                                        })
                                                    }
                                                >
                                                    <Plus className="mr-2 h-3 w-3" />
                                                    Adicionar {config.singularLabel}
                                                </Button>
                                            )}
                                        </div>

                                        {filteredProcedures.length === 0 && (
                                            <p className="text-sm text-muted-foreground text-center py-4 border border-dashed border-border rounded-lg">
                                                Nenhum(a) {config.label.toLowerCase()} registrado(a).
                                            </p>
                                        )}

                                        <div className="space-y-4">
                                            {filteredProcedures.map(({ originalIndex }, relIdx) => (
                                                <Card
                                                    key={animalProceduresFields[originalIndex].id}
                                                    className="border-border"
                                                >
                                                    <CardContent className="pt-4">
                                                        <div className="flex items-center justify-between mb-4">
                                                            <Badge variant="outline">
                                                                {config.singularLabel} {relIdx + 1}
                                                            </Badge>
                                                            {!isReadOnly && (
                                                                <Button
                                                                    type="button"
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={() =>
                                                                        removeAnimalProcedures(originalIndex)
                                                                    }
                                                                >
                                                                    <Trash2 className="h-4 w-4" />
                                                                </Button>
                                                            )}
                                                        </div>

                                                        <div className="space-y-4">
                                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                                <FormField
                                                                    control={form.control}
                                                                    name={`animalProcedures.${originalIndex}.description`}
                                                                    render={({ field }) => (
                                                                        <FormItem>
                                                                            <FormLabel>*Descrição</FormLabel>
                                                                            <FormControl>
                                                                                <Input
                                                                                    {...field}
                                                                                    disabled={isReadOnly}
                                                                                    placeholder="Descrição do procedimento"
                                                                                />
                                                                            </FormControl>
                                                                            <FormMessage />
                                                                        </FormItem>
                                                                    )}
                                                                />
                                                                <FormField
                                                                    control={form.control}
                                                                    name={`animalProcedures.${originalIndex}.veterinarian`}
                                                                    render={({ field }) => (
                                                                        <FormItem>
                                                                            <FormLabel>Veterinário</FormLabel>
                                                                            <FormControl>
                                                                                <Input
                                                                                    {...field}
                                                                                    disabled={isReadOnly}
                                                                                    placeholder="Nome do veterinário"
                                                                                />
                                                                            </FormControl>
                                                                            <FormMessage />
                                                                        </FormItem>
                                                                    )}
                                                                />
                                                            </div>

                                                            {type === "VACCINE" && (
                                                                <>
                                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                                        <FormField
                                                                            control={form.control}
                                                                            name={`animalProcedures.${originalIndex}.vaccineName`}
                                                                            render={({ field }) => (
                                                                                <FormItem>
                                                                                    <FormLabel>*Nome da Vacina</FormLabel>
                                                                                    <FormControl>
                                                                                        <Input
                                                                                            {...field}
                                                                                            disabled={isReadOnly}
                                                                                            placeholder="Ex: V10, Antirrábica"
                                                                                        />
                                                                                    </FormControl>
                                                                                    <FormMessage />
                                                                                </FormItem>
                                                                            )}
                                                                        />
                                                                        <FormField
                                                                            control={form.control}
                                                                            name={`animalProcedures.${originalIndex}.vaccineType`}
                                                                            render={({ field }) => (
                                                                                <FormItem>
                                                                                    <FormLabel>Tipo de Vacina</FormLabel>
                                                                                    <FormControl>
                                                                                        <Input
                                                                                            {...field}
                                                                                            disabled={isReadOnly}
                                                                                            placeholder="Ex: Polivalente"
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
                                                                            name={`animalProcedures.${originalIndex}.batch`}
                                                                            render={({ field }) => (
                                                                                <FormItem>
                                                                                    <FormLabel>Lote</FormLabel>
                                                                                    <FormControl>
                                                                                        <Input
                                                                                            {...field}
                                                                                            disabled={isReadOnly}
                                                                                            placeholder="Ex: LOT123456"
                                                                                        />
                                                                                    </FormControl>
                                                                                    <FormMessage />
                                                                                </FormItem>
                                                                            )}
                                                                        />
                                                                        <FormField
                                                                            control={form.control}
                                                                            name={`animalProcedures.${originalIndex}.manufacturer`}
                                                                            render={({ field }) => (
                                                                                <FormItem>
                                                                                    <FormLabel>Fabricante</FormLabel>
                                                                                    <FormControl>
                                                                                        <Input
                                                                                            {...field}
                                                                                            disabled={isReadOnly}
                                                                                            placeholder="Ex: MSD Animal Health"
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
                                                                            name={`animalProcedures.${originalIndex}.dtOfProcedure`}
                                                                            render={({ field }) => (
                                                                                <FormItem className="flex flex-col">
                                                                                    <FormLabel>Data de Aplicação</FormLabel>
                                                                                    <FormControl className="bg-[#020817]">
                                                                                        <DatePicker
                                                                                            disabled={isReadOnly}
                                                                                            date={field.value}
                                                                                            onDateChange={field.onChange}
                                                                                            placeholder="Selecione a data"
                                                                                        />
                                                                                    </FormControl>
                                                                                    <FormMessage />
                                                                                </FormItem>
                                                                            )}
                                                                        />
                                                                        <FormField
                                                                            control={form.control}
                                                                            name={`animalProcedures.${originalIndex}.dtOfExpiration`}
                                                                            render={({ field }) => (
                                                                                <FormItem className="flex flex-col">
                                                                                    <FormLabel>Data de Vencimento</FormLabel>
                                                                                    <FormControl className="bg-[#020817]">
                                                                                        <DatePicker
                                                                                            disabled={isReadOnly}
                                                                                            date={field.value}
                                                                                            onDateChange={field.onChange}
                                                                                            placeholder="Selecione a data"
                                                                                        />
                                                                                    </FormControl>
                                                                                    <FormMessage />
                                                                                </FormItem>
                                                                            )}
                                                                        />
                                                                    </div>
                                                                </>
                                                            )}

                                                            {type === "MEDICINE" && (
                                                                <>
                                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                                        <FormField
                                                                            control={form.control}
                                                                            name={`animalProcedures.${originalIndex}.medicineName`}
                                                                            render={({ field }) => (
                                                                                <FormItem>
                                                                                    <FormLabel>*Nome do Medicamento</FormLabel>
                                                                                    <FormControl>
                                                                                        <Input
                                                                                            {...field}
                                                                                            disabled={isReadOnly}
                                                                                            placeholder="Ex: Amoxicilina"
                                                                                        />
                                                                                    </FormControl>
                                                                                    <FormMessage />
                                                                                </FormItem>
                                                                            )}
                                                                        />
                                                                        <FormField
                                                                            control={form.control}
                                                                            name={`animalProcedures.${originalIndex}.reason`}
                                                                            render={({ field }) => (
                                                                                <FormItem>
                                                                                    <FormLabel>*Motivo</FormLabel>
                                                                                    <FormControl>
                                                                                        <Input
                                                                                            {...field}
                                                                                            disabled={isReadOnly}
                                                                                            placeholder="Ex: Infecção bacteriana"
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
                                                                            name={`animalProcedures.${originalIndex}.dosage`}
                                                                            render={({ field }) => (
                                                                                <FormItem>
                                                                                    <FormLabel>Dosagem</FormLabel>
                                                                                    <FormControl>
                                                                                        <Input
                                                                                            {...field}
                                                                                            disabled={isReadOnly}
                                                                                            placeholder="Ex: 250mg"
                                                                                        />
                                                                                    </FormControl>
                                                                                    <FormMessage />
                                                                                </FormItem>
                                                                            )}
                                                                        />
                                                                        <FormField
                                                                            control={form.control}
                                                                            name={`animalProcedures.${originalIndex}.frequency`}
                                                                            render={({ field }) => (
                                                                                <FormItem>
                                                                                    <FormLabel>Frequência</FormLabel>
                                                                                    <FormControl>
                                                                                        <Input
                                                                                            {...field}
                                                                                            disabled={isReadOnly}
                                                                                            placeholder="Ex: A cada 12 horas"
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
                                                                            name={`animalProcedures.${originalIndex}.dtOfStart`}
                                                                            render={({ field }) => (
                                                                                <FormItem className="flex flex-col">
                                                                                    <FormLabel>*Data de Início</FormLabel>
                                                                                    <FormControl className="bg-[#020817]">
                                                                                        <DatePicker
                                                                                            disabled={isReadOnly}
                                                                                            date={field.value}
                                                                                            onDateChange={field.onChange}
                                                                                            placeholder="Selecione a data"
                                                                                        />
                                                                                    </FormControl>
                                                                                    <FormMessage />
                                                                                </FormItem>
                                                                            )}
                                                                        />
                                                                        <FormField
                                                                            control={form.control}
                                                                            name={`animalProcedures.${originalIndex}.dtOfEnd`}
                                                                            render={({ field }) => (
                                                                                <FormItem className="flex flex-col">
                                                                                    <FormLabel>Data de Fim</FormLabel>
                                                                                    <FormControl className="bg-[#020817]">
                                                                                        <DatePicker
                                                                                            disabled={isReadOnly}
                                                                                            date={field.value}
                                                                                            onDateChange={field.onChange}
                                                                                            placeholder="Selecione a data"
                                                                                        />
                                                                                    </FormControl>
                                                                                    <FormMessage />
                                                                                </FormItem>
                                                                            )}
                                                                        />
                                                                    </div>
                                                                    {/* <FormField
                                                                        control={form.control}
                                                                        name={`animalProcedures.${originalIndex}.recomendations`}
                                                                        render={({ field }) => (
                                                                            <FormItem>
                                                                                <FormLabel>Recomendações</FormLabel>
                                                                                <FormControl>
                                                                                    <Textarea
                                                                                        {...field}
                                                                                        disabled={isReadOnly}
                                                                                        placeholder="Recomendações do veterinário..."
                                                                                        rows={2}
                                                                                    />
                                                                                </FormControl>
                                                                                <FormMessage />
                                                                            </FormItem>
                                                                        )}
                                                                    /> */}
                                                                </>
                                                            )}

                                                            {type === "SURGERY" && (
                                                                <>
                                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                                        <FormField
                                                                            control={form.control}
                                                                            name={`animalProcedures.${originalIndex}.surgeryName`}
                                                                            render={({ field }) => (
                                                                                <FormItem>
                                                                                    <FormLabel>*Nome da Cirurgia</FormLabel>
                                                                                    <FormControl>
                                                                                        <Input
                                                                                            {...field}
                                                                                            disabled={isReadOnly}
                                                                                            placeholder="Ex: Castração, Remoção de Tumor"
                                                                                        />
                                                                                    </FormControl>
                                                                                    <FormMessage />
                                                                                </FormItem>
                                                                            )}
                                                                        />
                                                                        <FormField
                                                                            control={form.control}
                                                                            name={`animalProcedures.${originalIndex}.surgeryType`}
                                                                            render={({ field }) => (
                                                                                <FormItem>
                                                                                    <FormLabel>Tipo de Cirurgia</FormLabel>
                                                                                    <FormControl>
                                                                                        <Input
                                                                                            {...field}
                                                                                            disabled={isReadOnly}
                                                                                            placeholder="Ex: Eletiva, Emergência"
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
                                                                            name={`animalProcedures.${originalIndex}.local`}
                                                                            render={({ field }) => (
                                                                                <FormItem>
                                                                                    <FormLabel>Local</FormLabel>
                                                                                    <FormControl>
                                                                                        <Input
                                                                                            {...field}
                                                                                            disabled={isReadOnly}
                                                                                            placeholder="Ex: Clínica Veterinária XYZ"
                                                                                        />
                                                                                    </FormControl>
                                                                                    <FormMessage />
                                                                                </FormItem>
                                                                            )}
                                                                        />
                                                                        <FormField
                                                                            control={form.control}
                                                                            name={`animalProcedures.${originalIndex}.dtOfProcedure`}
                                                                            render={({ field }) => (
                                                                                <FormItem className="flex flex-col">
                                                                                    <FormLabel>Data da Cirurgia</FormLabel>
                                                                                    <FormControl className="bg-[#020817]">
                                                                                        <DatePicker
                                                                                            disabled={isReadOnly}
                                                                                            date={field.value}
                                                                                            onDateChange={field.onChange}
                                                                                            placeholder="Selecione a data"
                                                                                        />
                                                                                    </FormControl>
                                                                                    <FormMessage />
                                                                                </FormItem>
                                                                            )}
                                                                        />
                                                                    </div>
                                                                    <FormField
                                                                        control={form.control}
                                                                        name={`animalProcedures.${originalIndex}.dtOfDuration`}
                                                                        render={({ field }) => (
                                                                            <FormItem className="flex flex-col">
                                                                                <FormLabel>Data de Alta / Duração</FormLabel>
                                                                                <FormControl className="bg-[#020817]">
                                                                                    <DatePicker
                                                                                        disabled={isReadOnly}
                                                                                        date={field.value}
                                                                                        onDateChange={field.onChange}
                                                                                        placeholder="Selecione a data"
                                                                                    />
                                                                                </FormControl>
                                                                                <FormMessage />
                                                                            </FormItem>
                                                                        )}
                                                                    />
                                                                </>
                                                            )}

                                                            {type === "MISCELLANEOUS" && (
                                                                <FormField
                                                                    control={form.control}
                                                                    name={`animalProcedures.${originalIndex}.dtOfProcedure`}
                                                                    render={({ field }) => (
                                                                        <FormItem className="flex flex-col">
                                                                            <FormLabel>Data do Procedimento</FormLabel>
                                                                            <FormControl className="bg-[#020817]">
                                                                                <DatePicker
                                                                                    disabled={isReadOnly}
                                                                                    date={field.value}
                                                                                    onDateChange={field.onChange}
                                                                                    placeholder="Selecione a data"
                                                                                />
                                                                            </FormControl>
                                                                            <FormMessage />
                                                                        </FormItem>
                                                                    )}
                                                                />
                                                            )}

                                                            <FormField
                                                                control={form.control}
                                                                name={`animalProcedures.${originalIndex}.observation`}
                                                                render={({ field }) => (
                                                                    <FormItem>
                                                                        <FormLabel>Observação</FormLabel>
                                                                        <FormControl>
                                                                            <Textarea
                                                                                {...field}
                                                                                disabled={isReadOnly}
                                                                                placeholder="Observações adicionais..."
                                                                                rows={2}
                                                                            />
                                                                        </FormControl>
                                                                        <FormMessage />
                                                                    </FormItem>
                                                                )}
                                                            />
                                                            <div className={`mt-4 pt-4 border-t border-border`}>
                                                                <div className="flex items-center justify-between mb-3">
                                                                    <div className="flex items-center gap-2">
                                                                        <Coins className="h-4 w-4 text-muted-foreground" />
                                                                        <span className="text-sm font-medium">Gastos</span>
                                                                        <Badge variant="outline" className="text-xs">
                                                                            {(form.watch(`animalProcedures.${originalIndex}.expenses`) ?? []).length}
                                                                        </Badge>
                                                                    </div>
                                                                    {!isReadOnly && (
                                                                        <Button
                                                                            type="button"
                                                                            variant="outline"
                                                                            size="sm"
                                                                            onClick={() =>
                                                                                handleAddAnimalProcedureExpense(originalIndex, {
                                                                                    id: "",
                                                                                    description: "",
                                                                                    value: 0,
                                                                                    paymentType: "",
                                                                                })
                                                                            }
                                                                        >
                                                                            <Plus className="mr-2 h-3 w-3" />
                                                                            Adicionar Gasto
                                                                        </Button>
                                                                    )}
                                                                </div>

                                                                {(form.watch(`animalProcedures.${originalIndex}.expenses`) ?? []).length === 0 && (
                                                                    <p className="text-sm text-muted-foreground text-center py-3 border border-dashed border-border rounded-lg">
                                                                        Nenhum gasto registrado para este procedimento.
                                                                    </p>
                                                                )}

                                                                <div className="space-y-3">
                                                                    {(form.watch(`animalProcedures.${originalIndex}.expenses`) ?? []).map(
                                                                        (_, expIdx) => (
                                                                            <Card key={expIdx} className="border-border bg-muted/20">
                                                                                <CardContent className="pt-4">
                                                                                    <div className="flex items-center justify-between mb-3">
                                                                                        <Badge variant="outline" className="text-xs">
                                                                                            Gasto {expIdx + 1}
                                                                                        </Badge>
                                                                                        {!isReadOnly && canExcludeAnimal && (
                                                                                            <Button
                                                                                                type="button"
                                                                                                variant="ghost"
                                                                                                size="sm"
                                                                                                onClick={() =>
                                                                                                    handleRemoveAnimalProcedureExpense(originalIndex, expIdx)
                                                                                                }
                                                                                            >
                                                                                                <Trash2 className="h-4 w-4" />
                                                                                            </Button>
                                                                                        )}
                                                                                    </div>

                                                                                    <div className="space-y-3">
                                                                                        <div className="grid grid-cols-1 sm:grid-cols-1 gap-3">
                                                                                            <FormField
                                                                                                control={form.control}
                                                                                                name={`animalProcedures.${originalIndex}.expenses.${expIdx}.description`}
                                                                                                render={({ field }) => (
                                                                                                    <FormItem>
                                                                                                        <FormLabel>Descrição</FormLabel>
                                                                                                        <FormControl>
                                                                                                            <Input
                                                                                                                {...field}
                                                                                                                disabled={isReadOnly}
                                                                                                                placeholder="Ex: Compra do medicamento"
                                                                                                            />
                                                                                                        </FormControl>
                                                                                                        <FormMessage />
                                                                                                    </FormItem>
                                                                                                )}
                                                                                            />
                                                                                        </div>

                                                                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                                                            <FormField
                                                                                                control={form.control}
                                                                                                name={`animalProcedures.${originalIndex}.expenses.${expIdx}.value`}
                                                                                                render={({ field }) => (
                                                                                                    <FormItem>
                                                                                                        <FormLabel>Valor (R$)</FormLabel>
                                                                                                        <FormControl>
                                                                                                            <Input
                                                                                                                {...field}
                                                                                                                value={field.value ?? ""}
                                                                                                                onChange={(e) => {
                                                                                                                    const value = e.target.value.replace(/[^\d,.]/, "");
                                                                                                                    field.onChange(value === "" ? undefined : Number(value));
                                                                                                                }}
                                                                                                                disabled={isReadOnly}
                                                                                                                inputMode="decimal"
                                                                                                                placeholder="Ex: 80.00"
                                                                                                            />
                                                                                                        </FormControl>
                                                                                                        <FormMessage />
                                                                                                    </FormItem>
                                                                                                )}
                                                                                            />
                                                                                            <FormField
                                                                                                control={form.control}
                                                                                                name={`animalProcedures.${originalIndex}.expenses.${expIdx}.paymentType`}
                                                                                                render={({ field }) => (
                                                                                                    <FormItem>
                                                                                                        <FormLabel>Forma de Pagamento</FormLabel>
                                                                                                        <Select
                                                                                                            onValueChange={field.onChange}
                                                                                                            defaultValue={field.value}
                                                                                                            disabled={isReadOnly}
                                                                                                        >
                                                                                                            <FormControl>
                                                                                                                <SelectTrigger>
                                                                                                                    <SelectValue placeholder="Selecione a forma" />
                                                                                                                </SelectTrigger>
                                                                                                            </FormControl>
                                                                                                            <SelectContent>
                                                                                                                <SelectItem value="dinheiro">Dinheiro</SelectItem>
                                                                                                                <SelectItem value="pix">Pix</SelectItem>
                                                                                                                <SelectItem value="cartao_credito">Cartão de Crédito</SelectItem>
                                                                                                                <SelectItem value="cartao_debito">Cartão de Débito</SelectItem>
                                                                                                                <SelectItem value="transferencia">Transferência</SelectItem>
                                                                                                                <SelectItem value="boleto">Boleto</SelectItem>
                                                                                                            </SelectContent>
                                                                                                        </Select>
                                                                                                        <FormMessage />
                                                                                                    </FormItem>
                                                                                                )}
                                                                                            />
                                                                                        </div>
                                                                                    </div>
                                                                                </CardContent>
                                                                            </Card>
                                                                        )
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            ))}
                                        </div>
                                    </div>
                                );
                            }
                        )}
                    </CardContent>
                </Card>

                {!isCreateMode && (
                    <>
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <UserRound className="h-5 w-5" />
                                    Adotante Vinculado
                                </CardTitle>
                                <CardDescription>Adotante associado a este animal</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {!animal?.adopter || Object.keys(animal.adopter).length === 0 ? (
                                    <p className="text-sm text-muted-foreground text-center py-4 border border-dashed border-border rounded-lg">
                                        Nenhum adotante vinculado.
                                    </p>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={() => navigate("/admin/adotantes")}
                                        className="flex flex-col items-start gap-1 rounded-lg border border-border bg-background p-3 text-left text-sm transition-all hover:border-primary/60 hover:bg-muted/40 cursor-pointer w-full sm:w-auto"
                                    >
                                        <span className="font-medium">{animal.adopter.name}</span>
                                        <span className="text-xs text-muted-foreground">{animal.adopter.cpf}</span>
                                    </button>
                                )}
                            </CardContent>
                        </Card>

                        {/* ── Termos Vinculados ────────────────────────────────────── */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <FileText className="h-5 w-5" />
                                    Termos de Compromisso
                                </CardTitle>
                                <CardDescription>Termos associados a este animal</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {!animal?.terms?.length ? (
                                    <p className="text-sm text-muted-foreground text-center py-4 border border-dashed border-border rounded-lg">
                                        Nenhum termo de compromisso vinculado.
                                    </p>
                                ) : (
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                        {animal.terms.map((term, index) => (
                                            <div key={term.id} className="relative group">
                                                <button
                                                    type="button"
                                                    onClick={() => navigate("/admin/termos")}
                                                    className="flex flex-col items-start gap-1 rounded-lg border border-border bg-background p-3 text-left text-sm transition-all hover:border-primary/60 hover:bg-muted/40 cursor-pointer w-full"
                                                >
                                                    <span className="font-medium">Termo {index + 1}</span>
                                                    <span className="text-xs text-muted-foreground truncate w-full pr-5">
                                                        {term.id}
                                                    </span>
                                                </button>
                                                {!isReadOnly && canExcludeAnimal && (
                                                    <button
                                                        type="button"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleDeleteTerm(term.id)
                                                        }}
                                                        className="absolute top-2 right-2 text-muted-foreground hover:text-red-500 transition-colors"
                                                    >
                                                        <Trash2 className="h-3.5 w-3.5" />
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </>
                )}

                {/* ── Actions ─────────────────────────────────────────────── */}
                <div className="flex justify-end space-x-4">
                    <Button type="button" variant="outline" onClick={handleCloseModal}>
                        {isReadOnly ? "Fechar" : "Cancelar"}
                    </Button>
                    {!isReadOnly && (
                        <Button onClick={form.handleSubmit(handleButtonConfirm, (errors) => console.log("Erros Zod:", errors))}>
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
                isOpen={isModalDeleteAnimalOpen}
                onClose={handleCloseDeleteAnimalModal}
                onNotConfirm={handleCloseDeleteAnimalModal}
                onConfirm={handleDeleteAnimalConfirm}
                content={"Deseja excluir este animal ?"}
            />

            <ConfirmModal
                isOpen={isModalDeleteTermOpen}
                onClose={handleCloseDeleteTermModal}
                onNotConfirm={handleCloseDeleteTermModal}
                onConfirm={handleDeleteTermConfirm}
                content={"Deseja excluir este termo de compromisso ?"}
            />
        </>
    )
}
