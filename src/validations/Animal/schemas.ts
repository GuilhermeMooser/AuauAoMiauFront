import z from "zod";
import {animalProceduresSchema} from "../AnimalProcedures/schemas";
import {minimalExpensesSchema} from "../Expenses/schemas";

export const animalFiltersSchema = z.object({
  createdAt: z.date().nullable().optional(),
  dtOfAdoption: z.date().nullable().optional(),
  dtOfRescue: z.date().nullable().optional(),
  dtOfDeath: z.date().nullable().optional(),
});

export const animalSchema = z.object({
  id: z.string(),
  name: z.string(),
  age: z.number(),
  breed: z.string(),
  color: z.string(),

  dtOfBirth: z.date().optional(),
  dtOfDeath: z.date().optional(),
  dtOfRescue: z.date().optional(),
  dtOfAdoption: z.date().optional(),

  locationOfRescue: z.string().optional(),

  typeId: z.number(),

  size: z.string(),
  gender: z.string(),

  additionalInfo: z.string().optional(),
  castrated: z.boolean().optional(),

  animalProcedures: z.array(animalProceduresSchema).optional(),
  expenses: z.array(minimalExpensesSchema).optional(),
});
