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
  id: z.string().optional(),
  name: z.string().nonempty("Nome é obrigatório"),
  age: z.number({message: "A idade é obrigatória"}),
  breed: z.string().nonempty("Raça é obrigatória"),
  color: z.string().nonempty("Pelagem/Cor é obrigatória"),

  dtOfBirth: z.date().optional(),
  dtOfDeath: z.date().optional(),
  dtOfRescue: z.date().optional(),
  dtOfAdoption: z.date().optional(),

  locationOfRescue: z.string().optional(),

  typeId: z.number({message: "A tipo é obrigatório"}).min(1, "O tipo é obrigatório"),

  size: z.string().nonempty("Tamanho é obrigatório"),
  gender: z.string().nonempty("Sexo é obrigatório"),

  additionalInfo: z.string().optional(),
  castrated: z.boolean(),

  animalProcedures: z.array(animalProceduresSchema).optional(),
  expenses: z.array(minimalExpensesSchema).optional(),
});
