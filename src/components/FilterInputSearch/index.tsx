import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Filter, Search } from "lucide-react";

type FilterInputSearchProps = {
  searchTerm: string;
  handleChangeFilter: (value: string) => void;
  showFilterButton: boolean;
  onToggleFilters?: VoidFunction;
  filtersCount?: number;
  showSearchInput?: boolean;
};

export default function FilterInputSearch({
  searchTerm,
  filtersCount = 0,
  showFilterButton = true,
  handleChangeFilter,
  onToggleFilters,
  showSearchInput = true
}: FilterInputSearchProps) {
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
      {showSearchInput && (
        <div className="flex-1 max-w-full sm:max-w-md">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome, email, CPF..."
              className="pl-8 bg-background"
              value={searchTerm}
              onChange={(event) => handleChangeFilter(event.target.value)}
            />
          </div>
        </div>
      )
      }
      {showFilterButton && (
        <Button
          variant="outline"
          className="w-full sm:w-auto"
          onClick={onToggleFilters}
        >
          <Filter className="mr-2 h-4 w-4" />
          Filtros
          {filtersCount > 0 && (
            <Badge variant="secondary" className="ml-2">
              {filtersCount}
            </Badge>
          )}
        </Button>
      )}
    </div>
  );
}
