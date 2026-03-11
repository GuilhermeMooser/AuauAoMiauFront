import z from "zod";

export const termFiltersSchema = z.object({
  createdAt: z.date().nullable().optional(),
});

export const termSchema = z.object({
  id: z.string().optional(),
  animalId: z
    .number({message: "O animal é obrigatório"})
    .min(1, "O animal é obrigatório"),
  adopterId: z
    .number({message: "O adotante é obrigatório"})
    .min(1, "O adotante é obrigatório"),
});
