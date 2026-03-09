import z from "zod";

export const minimalExpensesSchema = z.object({
  id: z.string().optional(),
  value: z
    .number({message: "O valor não pode ser nulo"})
    .refine((v) => v !== 0, {
      message: "O valor não pode ser nulo",
    }),
  description: z.string().nonempty("Descrição é obrigatória"),
  paymentType: z.string(),
});
