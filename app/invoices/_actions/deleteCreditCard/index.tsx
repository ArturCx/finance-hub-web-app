"use server";

import { db } from "@/app/_lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { DeleteCreditCardSchema, deleteCreditCardSchema } from "./schema";

export const deleteCreditCard = async (params: DeleteCreditCardSchema) => {
  const { creditCardId } = deleteCreditCardSchema.parse(params);
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }
  await db.creditCard.deleteMany({ where: { id: creditCardId, userId } });
  revalidatePath("/invoices");
};
