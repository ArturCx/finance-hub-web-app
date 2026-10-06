"use server";

import { db } from "@/app/_lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { DeleteCryptoTradeSchema, deleteCryptoTradeSchema } from "./schema";

export const deleteCryptoTrade = async (params: DeleteCryptoTradeSchema) => {
  const { tradeId } = deleteCryptoTradeSchema.parse(params);
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }
  const trade = await db.cryptoTrade.findFirst({ where: { id: tradeId, userId } });
  if (!trade) {
    return { error: "Operação não encontrada." };
  }

  const remaining = (
    await db.cryptoTrade.findMany({ where: { userId, coinId: trade.coinId } })
  )
    .filter((item) => item.id !== tradeId)
    .map((item) => ({
      ...item,
      quantity: Number(item.quantity),
      price: Number(item.price),
    }));
  const sorted = remaining.sort((a, b) => a.date.getTime() - b.date.getTime());
  let balance = 0;
  for (const item of sorted) {
    balance += item.type === "BUY" ? item.quantity : -item.quantity;
    if (balance < -1e-10) {
      return {
        error:
          "Essa compra cobre vendas registradas depois. Apague as vendas primeiro.",
      };
    }
  }
  await db.$transaction([
    db.cryptoTrade.delete({ where: { id: tradeId } }),
    ...(trade.transactionId
      ? [db.transaction.deleteMany({ where: { id: trade.transactionId, userId } })]
      : []),
  ]);

  revalidatePath("/crypto", "layout");
  if (trade.transactionId) {
    revalidatePath("/transactions");
    revalidatePath("/");
  }
  return { error: null };
};
