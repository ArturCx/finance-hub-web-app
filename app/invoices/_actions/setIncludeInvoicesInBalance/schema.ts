import { z } from "zod";

export const setIncludeInvoicesInBalanceSchema = z.object({
  include: z.boolean(),
});

export type SetIncludeInvoicesInBalanceSchema = z.infer<
  typeof setIncludeInvoicesInBalanceSchema
>;
