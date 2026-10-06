import { z } from "zod";

export const setInvestmentGoalSchema = z.object({
  goal: z.number().positive().max(9_999_999_999).nullable(),
});

export type SetInvestmentGoalSchema = z.infer<typeof setInvestmentGoalSchema>;
