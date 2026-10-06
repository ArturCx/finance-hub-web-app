"use server";

import { db } from "@/app/_lib/prisma";
import { auth } from "@clerk/nextjs/server";
import {
  CryptoTradeType,
  TransactionCategory,
  TransactionPaymentMethod,
  TransactionType,
} from "@prisma/client";
import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { getHeldQuantity } from "../../_lib/portfolio";
import { CreateCryptoTradeSchema, createCryptoTradeSchema } from "./schema";

export const createCryptoTrade = async (params: CreateCryptoTradeSchema) => {
  const data = createCryptoTradeSchema.parse(params);
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const coin = await db.cryptos.findUnique({
    where: { externalId: data.coinId },
    select: { name: true },
  });
  if (!coin) {
    return { error: "Moeda não encontrada." };
  }

  if (data.type === CryptoTradeType.SELL) {
    const trades = await db.cryptoTrade.findMany({
      where: { userId, coinId: data.coinId },
    });
    const held = getHeldQuantity(
      trades.map((trade) => ({
        ...trade,
        quantity: Number(trade.quantity),
        price: Number(trade.price),
      })),
      data.coinId,
    );
    if (data.quantity > held + 1e-10) {
      return {
        error: `Você tem só ${held.toLocaleString("pt-BR", { maximumFractionDigits: 8 })} ${coin.name} na carteira.`,
      };
    }
  }

  const transactionId = data.registerTransaction ? randomUUID() : null;
  const isBuy = data.type === CryptoTradeType.BUY;

  await db.$transaction([
    ...(transactionId
      ? [
          db.transaction.create({
            data: {
              id: transactionId,
              name: `${isBuy ? "Compra" : "Venda"} ${coin.name}`,
              type: isBuy ? TransactionType.INVESTMENT : TransactionType.DEPOSIT,
              category: TransactionCategory.OTHER,
              paymentMethod: data.paymentMethod ?? TransactionPaymentMethod.PIX,
              amount: Math.round(data.quantity * data.price * 100) / 100,
              date: data.date,
              userId,
            },
          }),
        ]
      : []),
    db.cryptoTrade.create({
      data: {
        type: data.type,
        coinId: data.coinId,
        quantity: data.quantity,
        price: data.price,
        date: data.date,
        transactionId,
        userId,
      },
    }),
  ]);

  revalidatePath("/crypto", "layout");
  if (transactionId) {
    revalidatePath("/transactions");
    revalidatePath("/");
  }
  return { error: null };
};
