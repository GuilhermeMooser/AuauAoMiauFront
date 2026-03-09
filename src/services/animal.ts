import {
  Animal,
  AnimalFilters,
  CreateAnimalDto,
  FindAllAnimalsPaginated,
  UpdateAnimalDto,
} from "@/types/animal";
import {addSearchParamsInUrl} from "@/utils/generatedPaginatedUrl";
import {api} from "./api";
import {AnimalType} from "@/types/animalType";

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

export const findAnimalById = async (id: string) => {
  const response = await api.get<Animal>(`/animal/v1/${id}`);
  return response;
};

export const getAnimalTypes = async () => {
  const response = await api.get<AnimalType[]>("/animal-type/v1");
  return response.data;
};

export const createAnimal = async (createAnimalDto: CreateAnimalDto) => {
  const body = {
    ...createAnimalDto,
  };

  const response = await api.post<Animal>("/animal/v1", body);
  return response;
};

export const updateAnimal = async (updateAnimalDto: UpdateAnimalDto) => {
  const body = {
    ...updateAnimalDto,
  };

  const response = await api.put<Animal>("/adopter/v1", body);
  return response;
};

export const deleteAnimal = async (id: string) => {
  const response = await api.delete<void>(`/animal/v1/${id}`);
  return response;
};
