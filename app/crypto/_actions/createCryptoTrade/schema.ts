import { CryptoTradeType, TransactionPaymentMethod } from "@prisma/client";
import { z } from "zod";

export const createCryptoTradeSchema = z.object({
  type: z.nativeEnum(CryptoTradeType),
  coinId: z.string().min(1),
  quantity: z.number().positive(),
  price: z.number().positive(),
  date: z.date(),
  registerTransaction: z.boolean(),
  paymentMethod: z.nativeEnum(TransactionPaymentMethod).optional(),
});

export type CreateCryptoTradeSchema = z.infer<typeof createCryptoTradeSchema>;
