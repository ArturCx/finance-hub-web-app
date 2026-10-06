"use server";

import { db } from "@/app/_lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import {
  SetIncludeInvoicesInBalanceSchema,
  setIncludeInvoicesInBalanceSchema,
} from "./schema";

export const setIncludeInvoicesInBalance = async (
  params: SetIncludeInvoicesInBalanceSchema,
) => {
  const { include } = setIncludeInvoicesInBalanceSchema.parse(params);
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }
  await db.userSettings.upsert({
    where: { userId },
    create: { userId, includeInvoicesInBalance: include },
    update: { includeInvoicesInBalance: include },
  });
  revalidatePath("/invoices");
  revalidatePath("/");
};
