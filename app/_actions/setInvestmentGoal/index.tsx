"use server";

import { db } from "@/app/_lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { SetInvestmentGoalSchema, setInvestmentGoalSchema } from "./schema";

export const setInvestmentGoal = async (params: SetInvestmentGoalSchema) => {
  const { goal } = setInvestmentGoalSchema.parse(params);
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }
  await db.userSettings.upsert({
    where: { userId },
    create: { userId, investmentGoal: goal },
    update: { investmentGoal: goal },
  });
  revalidatePath("/");
};
