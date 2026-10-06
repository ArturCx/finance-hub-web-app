"use server";

import { db } from "@/app/_lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import { PricePoint } from "../../_lib/simulation";

export const getCoinPrices = async (coinId: string): Promise<PricePoint[]> => {
  z.string().min(1).parse(coinId);
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }
  const chart = await db.cryptoCharts.findUnique({
    where: { externalId: coinId },
    select: { prices: true },
  });
  return (chart?.prices as PricePoint[] | undefined) ?? [];
};
