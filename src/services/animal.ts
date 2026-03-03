import {AnimalFilters, FindAllAnimalsPaginated} from "@/types/animal";
import {addSearchParamsInUrl} from "@/utils/generatedPaginatedUrl";
import {api} from "./api";

export const getAnimalsPaginated = async (
  search?: string,
  filters?: AnimalFilters,
  page?: number | null,
  limit?: number,
) => {
  const url = addSearchParamsInUrl(
    "animal/v1",
    {name: "s", value: search},
    {name: "createdAt", value: filters?.createdAt?.toISOString()},
    {name: "dtOfAdoption", value: filters?.dtOfAdoption?.toISOString()},
    {name: "dtOfRescue", value: filters?.dtOfRescue?.toISOString()},
    {name: "dtOfDeath", value: filters?.dtOfDeath?.toISOString()},
    {name: "page", value: page},
    {name: "limit", value: limit},
  );

  const response = await api.get<FindAllAnimalsPaginated>(url);
  return response.data;
};
