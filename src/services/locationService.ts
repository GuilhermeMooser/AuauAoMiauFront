import { api } from "./api";

export type City = {
  id: number;
  name: string;
  stateUf: UF;
};

export type UF = {
  id: number;
  name: string;
  acronym: string;
};

export const locationService = {
  getUFs: async (): Promise<UF[]> => {
    const response = await api.get<UF[]>("/uf/v1");
    return response.data;
  },

  getCitiesByUF: async (ufId: number): Promise<City[]> => {
    const response = await api.get<City[]>(`/city/v1/uf/${ufId}`);
    return response.data;
  },
};
