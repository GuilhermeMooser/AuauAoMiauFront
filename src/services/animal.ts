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
  const {imageFile, ...rest} = createAnimalDto;

  if (imageFile) {
    const formData = new FormData();
    formData.append("imageFile", imageFile);
    formData.append("data", JSON.stringify(rest));
    return api.post<Animal>("/animal/v1", formData, {
      headers: {"Content-Type": "multipart/form-data"},
    });
  }

  return api.post<Animal>("/animal/v1", rest);
};

/**
 * ImageType:
 *
 * undefined: The same imageFile
 * null: Removed imagemFile
 * object: new imageFile
 */
export const updateAnimal = async (updateAnimalDto: UpdateAnimalDto) => {
  const {imageFile, ...rest} = updateAnimalDto;

  if (imageFile) {
    const formData = new FormData();
    formData.append("imageFile", imageFile);
    formData.append("data", JSON.stringify(rest));
    return api.put<Animal>("/animal/v1", formData, {
      headers: {"Content-Type": "multipart/form-data"},
    });
  }

  if (imageFile === null) {
    return api.put<Animal>("/animal/v1", {...rest, imageFile: null});
  }

  return api.put<Animal>("/animal/v1", rest);
};

export const deleteAnimal = async (id: string) => {
  const response = await api.delete<void>(`/animal/v1/${id}`);
  return response;
};
