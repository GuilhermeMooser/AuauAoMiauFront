import {FindAllTermsPaginated, TermFilters, Terms} from "@/types/terms";
import {api} from "./api";
import {addSearchParamsInUrl} from "@/utils/generatedPaginatedUrl";

export const getTermsPaginated = async (
  search?: string,
  filters?: TermFilters,
  page?: number | null,
  limit?: number,
) => {
  const url = addSearchParamsInUrl(
    "/terms/v1",
    {name: "s", value: search},
    {name: "createdAt", value: filters?.createdAt?.toISOString()},
    {name: "page", value: page},
    {name: "limit", value: limit},
  );

  const response = await api.get<FindAllTermsPaginated>(url);
  return response.data;
};

export const findTermById = async (id: string) => {
  const response = await api.get<Terms>(`/terms/v1/${id}`);
  return response;
};
