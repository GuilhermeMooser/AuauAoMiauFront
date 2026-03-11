import {AnimalFilterFormData, AnimalFilters} from "@/types/animal";
import {animalFiltersSchema} from "@/validations/Animal/schemas";
import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";

type Props = {
  activeFilters: AnimalFilters;
};

export const useAnimalFilterModal = ({activeFilters}: Props) => {
  const form = useForm<AnimalFilterFormData>({
    resolver: zodResolver(animalFiltersSchema),
    defaultValues: {
      createdAt: activeFilters.createdAt,
      dtOfAdoption: activeFilters.dtOfAdoption,
      dtOfRescue: activeFilters.dtOfRescue,
      dtOfDeath: activeFilters.dtOfDeath,
    },
  });

  const handleClear = () => {
    form.reset({
      createdAt: null,
      dtOfAdoption: null,
      dtOfRescue: null,
      dtOfDeath: null,
    });
  };

  return {
    form,
    handleClear,
  };
};
