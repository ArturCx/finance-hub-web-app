import "server-only";
import { db } from "@/app/_lib/prisma";
import { CoinPrice } from "./portfolio";

export const getLivePrices = async (
  coinIds: string[],
): Promise<Record<string, CoinPrice>> => {
  const ids = Array.from(new Set(coinIds)).sort();
  if (ids.length === 0) return {};

  const prices: Record<string, CoinPrice> = {};
  try {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${ids.join(",")}&vs_currencies=brl&include_24hr_change=true`,
      {
        headers: {
          accept: "application/json",
          "x-cg-demo-api-key": process.env.GECKO_API_KEY ?? "",
        },
        next: { revalidate: 300 },
      },
    );
    if (response.ok) {
      const data: Record<string, { brl?: number; brl_24h_change?: number }> =
        await response.json();
      for (const [id, value] of Object.entries(data)) {
        if (typeof value.brl === "number") {
          prices[id] = { price: value.brl, change24h: value.brl_24h_change ?? null };
        }
      }
    }
  } catch (error) {
    console.error("Falha ao buscar preços na CoinGecko:", error);
  }

  const missing = ids.filter((id) => !prices[id]);
  if (missing.length > 0) {
    const fallback = await db.cryptos.findMany({
      where: { externalId: { in: missing } },
      select: { externalId: true, currentPrice: true, priceChangePercentage24h: true },
    });
    for (const coin of fallback) {
      prices[coin.externalId] = {
        price: Number(coin.currentPrice),
        change24h: Number(coin.priceChangePercentage24h),
      };
    }
  }
  return prices;
};
