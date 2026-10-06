"use server";

import { db } from "@/app/_lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import {
  UpdateInvoiceAmountSchema,
  updateInvoiceAmountSchema,
} from "./schema";

export const updateInvoiceAmount = async (
  params: UpdateInvoiceAmountSchema,
) => {
  const { creditCardId, amount } = updateInvoiceAmountSchema.parse(params);
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }
  const { count } = await db.creditCard.updateMany({
    where: { id: creditCardId, userId },
    data: { currentAmount: amount },
  });
  if (count === 0) {
    throw new Error("Not found");
  }
  revalidatePath("/invoices");
};
