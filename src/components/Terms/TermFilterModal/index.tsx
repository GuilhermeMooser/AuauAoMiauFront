import { TermFilterFormData, TermFilters } from "@/types/terms";
import { useTermsFilterModal } from "./useTermsFilterModal";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
} from "@/components/ui/form";
import { Filter, Search, X } from "lucide-react";
import { DatePicker } from "@/components/ui/date-picker";
import { Button } from "@/components/ui/button";

type TermFilterModalProps = {
    isOpen: boolean;
    activeFilters: TermFilters;
    handleApplyFilter: (data: TermFilterFormData) => void;
    handleClearFilter: () => void;
    filtersCount?: number;
}

export default function TermFilterModal(
    {
        isOpen,
        activeFilters,
        handleApplyFilter,
        handleClearFilter,
        filtersCount = 0
    }: TermFilterModalProps
) {
    const {
        form,
        handleClear,
    } = useTermsFilterModal({ activeFilters })

    return (
        <>
            {isOpen && (
                <Card className="w-1/3">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Filter className="h-5 w-5" />
                            Filtros de Busca
                            {filtersCount > 0 && (
                                <Badge variant="secondary" className="ml-2">
                                    {filtersCount} ativo
                                    {filtersCount > 1 ? "s" : ""}
                                </Badge>
                            )}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <div className="grid grid-cols-1 md:grid-cols-1 gap-4 pb-4">
                                <FormField
                                    control={form.control}
                                    name="createdAt"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Data de Cadastro (Início)</FormLabel>
                                            <FormControl>
                                                <DatePicker
                                                    date={field.value}
                                                    onDateChange={field.onChange}
                                                    placeholder="Selecione a data"
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="flex items-end gap-x-2 justify-end">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => {
                                        handleClear();
                                        handleClearFilter();
                                    }}
                                >
                                    <X className="h-4 w-4" />
                                    Limpar Filtros
                                </Button>
                                <Button onClick={form.handleSubmit(handleApplyFilter)}>
                                    <Search className="h-4 w-4" />
                                    Aplicar Filtros
                                </Button>
                            </div>
                        </Form>
                    </CardContent>
                </Card>
            )}
        </>
    )
}