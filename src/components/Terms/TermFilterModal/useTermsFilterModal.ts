import {TermFilterFormData, TermFilters} from "@/types/terms";
import {termFiltersSchema} from "@/validations/Terms/schemas";
import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";

type Props = {
  activeFilters: TermFilters;
};

export const useTermsFilterModal = ({activeFilters}: Props) => {
  const form = useForm<TermFilterFormData>({
    resolver: zodResolver(termFiltersSchema),
    defaultValues: {
      createdAt: activeFilters.createdAt,
    },
  });

  const handleClear = () => {
    form.reset({
      createdAt: null,
    });
  };

  return {
    form,
    handleClear,
  };
};
