import { z } from "zod";

export const upsertCreditCardSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().trim().min(1),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/),
  closingDay: z.number().int().min(1).max(31),
  dueDay: z.number().int().min(1).max(31),
  limit: z.number().positive().nullable().optional(),
  currentAmount: z.number().min(0),
});

export type UpsertCreditCardSchema = z.infer<typeof upsertCreditCardSchema>;
