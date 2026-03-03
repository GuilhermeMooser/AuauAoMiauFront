import z from "zod";

export const animalFiltersSchema = z.object({
  createdAt: z.date().nullable().optional(),
  dtOfAdoption: z.date().nullable().optional(),
  dtOfRescue: z.date().nullable().optional(),
  dtOfDeath: z.date().nullable().optional(),
});
