"use server";

import { db } from "@/app/_lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { TransactionCategory, TransactionType } from "@prisma/client";
import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { PayInvoiceSchema, payInvoiceSchema } from "./schema";

export const payInvoice = async (params: PayInvoiceSchema) => {
  const { creditCardId, amount, paidAt, paymentMethod } =
    payInvoiceSchema.parse(params);
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }
  const card = await db.creditCard.findFirst({
    where: { id: creditCardId, userId },
  });
  if (!card) {
    throw new Error("Not found");
  }

  const remaining = Math.max(Number(card.currentAmount) - amount, 0);
  const transactionId = randomUUID();

  await db.$transaction([
    db.transaction.create({
      data: {
        id: transactionId,
        name: `Fatura ${card.name}`,
        type: TransactionType.EXPENSE,
        category: TransactionCategory.OTHER,
        paymentMethod,
        amount,
        date: paidAt,
        userId,
      },
    }),
    db.invoicePayment.create({
      data: { amount, paidAt, creditCardId, transactionId, userId },
    }),
    db.creditCard.update({
      where: { id: creditCardId },
      data: { currentAmount: remaining },
    }),
  ]);

  revalidatePath("/invoices");
  revalidatePath("/transactions");
  revalidatePath("/");
};
