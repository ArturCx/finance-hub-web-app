"use server";

import { db } from "@/app/_lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { UpsertCreditCardSchema, upsertCreditCardSchema } from "./schema";

export const upsertCreditCard = async (params: UpsertCreditCardSchema) => {
  const { id, ...data } = upsertCreditCardSchema.parse(params);
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }
  if (id) {
    const { count } = await db.creditCard.updateMany({
      where: { id, userId },
      data: { ...data, limit: data.limit ?? null },
    });
    if (count === 0) {
      throw new Error("Not found");
    }
  } else {
    await db.creditCard.create({
      data: { ...data, limit: data.limit ?? null, userId },
    });
  }
  revalidatePath("/invoices");
};
