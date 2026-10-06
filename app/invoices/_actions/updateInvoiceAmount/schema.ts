import { z } from "zod";

export const updateInvoiceAmountSchema = z.object({
  creditCardId: z.string().uuid(),
  amount: z.number().min(0),
});

export type UpdateInvoiceAmountSchema = z.infer<
  typeof updateInvoiceAmountSchema
>;
