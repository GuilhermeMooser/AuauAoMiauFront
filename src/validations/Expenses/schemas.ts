import z from "zod";

export const minimalExpensesSchema = z.object({
  id: z.string(),
  expenseType: z.string(),
  value: z.number(),
  description: z.string(),
  paymentType: z.string(),
});
