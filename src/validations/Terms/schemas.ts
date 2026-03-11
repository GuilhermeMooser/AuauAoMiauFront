import z from "zod";

export const termFiltersSchema = z.object({
  createdAt: z.date().nullable().optional(),
});

export const termSchema = z.object({
  id: z.string().optional(),
  animalId: z.string({message: "O animal é obrigatório"}),
  adopterId: z.string({message: "O adotante é obrigatório"}),
});
