// import {api} from "./api";
// import {Animal} from "@/types/animalAntigo";

// export interface CreateAnimalRequest {
//   nome: string;
//   tipo: "cao" | "gato" | "outro";
//   raca: string;
//   idade: number;
//   sexo: "macho" | "femea";
//   castrado: boolean;
//   vacinado: boolean;
//   vermifugado: boolean;
//   fotos?: string[];
//   observacoes?: string;
//   status: "disponivel" | "adotado" | "em_tratamento" | "reservado";
// }

// export interface UpdateAnimalRequest extends Partial<CreateAnimalRequest> {
//   id: string;
// }

// export interface AnimalFilters {
//   nome?: string;
//   tipo?: "cao" | "gato" | "outro";
//   raca?: string;
//   idadeMin?: number;
//   idadeMax?: number;
//   sexo?: "macho" | "femea";
//   status?: "disponivel" | "adotado" | "em_tratamento" | "reservado";
//   castrado?: boolean;
//   vacinado?: boolean;
//   vermifugado?: boolean;
// }

// export interface AnimalListResponse {
//   data: Animal[];
//   total: number;
//   page: number;
//   limit: number;
// }

// export const animalService = {
//   // Listar animais com filtros e paginação
//   list: async (
//     filters?: AnimalFilters,
//     page = 1,
//     limit = 10,
//   ): Promise<AnimalListResponse> => {
//     const params = new URLSearchParams();

//     if (filters) {
//       Object.entries(filters).forEach(([key, value]) => {
//         if (value !== undefined && value !== "") {
//           params.append(key, String(value));
//         }
//       });
//     }

//     params.append("page", String(page));
//     params.append("limit", String(limit));

//     const response = await api.get(`/animals?${params.toString()}`);
//     return response.data;
//   },

//   // Buscar animal por ID
//   getById: async (id: string): Promise<Animal> => {
//     const response = await api.get(`/animals/${id}`);
//     return response.data;
//   },

//   // Criar novo animal
//   create: async (data: CreateAnimalRequest): Promise<Animal> => {
//     const response = await api.post("/animals", data);
//     return response.data;
//   },

//   // Atualizar animal
//   update: async (data: UpdateAnimalRequest): Promise<Animal> => {
//     const {id, ...updateData} = data;
//     const response = await api.put(`/animals/${id}`, updateData);
//     return response.data;
//   },

//   // Deletar animal
//   delete: async (id: string): Promise<void> => {
//     await api.delete(`/animals/${id}`);
//   },

//   // Buscar animais por nome ou raça
//   search: async (query: string): Promise<Animal[]> => {
//     const response = await api.get(
//       `/animals/search?q=${encodeURIComponent(query)}`,
//     );
//     return response.data;
//   },

//   // Upload de foto do animal
//   uploadPhoto: async (animalId: string, file: File): Promise<string> => {
//     const formData = new FormData();
//     formData.append("photo", file);

//     const response = await api.post(`/animals/${animalId}/photos`, formData, {
//       headers: {
//         "Content-Type": "multipart/form-data",
//       },
//     });

//     return response.data.url;
//   },

//   // Deletar foto do animal
//   deletePhoto: async (animalId: string, photoUrl: string): Promise<void> => {
//     await api.delete(`/animals/${animalId}/photos`, {
//       data: {url: photoUrl},
//     });
//   },
// };
