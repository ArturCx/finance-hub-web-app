import { z } from "zod";

export const deleteCryptoTradeSchema = z.object({
  tradeId: z.string().uuid(),
});

export type DeleteCryptoTradeSchema = z.infer<typeof deleteCryptoTradeSchema>;
