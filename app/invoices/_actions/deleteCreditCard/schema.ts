import { z } from "zod";

export const deleteCreditCardSchema = z.object({
  creditCardId: z.string().uuid(),
});

export type DeleteCreditCardSchema = z.infer<typeof deleteCreditCardSchema>;
