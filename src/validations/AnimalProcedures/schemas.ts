import {AnimalProcedureEnum} from "@/types/animalProcedures";
import z from "zod";
import {minimalExpensesSchema} from "../Expenses/schemas";

export const animalProceduresSchema = z.object({
  id: z.string().optional(),
  description: z.string(),
  procedureType: z.nativeEnum(AnimalProcedureEnum),

  dtOfProcedure: z.date().optional(),
  veterinarian: z.string().optional(),
  observation: z.string().optional(),

  expenses: z.array(minimalExpensesSchema).optional(),

  medicineName: z.string().optional(),
  reason: z.string().optional(),
  dosage: z.string().optional(),
  frequency: z.string().optional(),
  dtOfStart: z.date().optional(),
  dtOfEnd: z.date().optional(),
  recomendations: z.string().optional(),

  surgeryName: z.string().optional(),
  surgeryType: z.string().optional(),
  local: z.string().optional(),
  dtOfDuration: z.date().optional(),

  vaccineName: z.string().optional(),
  vaccineType: z.string().optional(),
  batch: z.string().optional(),
  manufacturer: z.string().optional(),
  dtOfExpiration: z.date().optional(),
});
