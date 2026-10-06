import { TransactionPaymentMethod } from "@prisma/client";
import { z } from "zod";

export const payInvoiceSchema = z.object({
  creditCardId: z.string().uuid(),
  amount: z.number().positive(),
  paidAt: z.date(),
  paymentMethod: z.nativeEnum(TransactionPaymentMethod),
});

export type PayInvoiceSchema = z.infer<typeof payInvoiceSchema>;
