import {AnimalProcedureEnum} from "@/types/animalProcedures";
import z from "zod";
import {minimalExpensesSchema} from "../Expenses/schemas";

export const animalProceduresSchema = z
  .object({
    id: z.string().optional(),
    description: z.string().nonempty("Descrição é obrigatória"),
    procedureType: z
      .nativeEnum(AnimalProcedureEnum)
      .refine((v) => v !== undefined, {
        message: "Selecione um tipo de procedimento",
      }),

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
  })
  .superRefine((data, ctx) => {
    // VACCINE
    if (data.procedureType === AnimalProcedureEnum.VACCINE) {
      if (!data.vaccineName) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Nome da vacina é obrigatório",
          path: ["vaccineName"],
        });
      }
    }
    // MEDICINE
    if (data.procedureType === AnimalProcedureEnum.MEDICINE) {
      if (!data.medicineName) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Nome do medicamento é obrigatório",
          path: ["medicineName"],
        });
      }

      if (!data.dtOfStart) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Data de início é obrigatória",
          path: ["dtOfStart"],
        });
      }
    }

    // SURGERY
    if (data.procedureType === AnimalProcedureEnum.SURGERY) {
      if (!data.surgeryName) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Nome da cirurgia é obrigatório",
          path: ["surgeryName"],
        });
      }
    }
  });
