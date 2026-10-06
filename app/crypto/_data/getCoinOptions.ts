import { db } from "@/app/_lib/prisma";

export interface CoinOption {
  id: string;
  name: string;
  image: string;
  price: number;
}

export const getCoinOptions = async (): Promise<CoinOption[]> => {
  const coins = await db.cryptos.findMany({
    where: { OR: [{ marketCapRank: { gt: 0 } }, { trades: { some: {} } }] },
    orderBy: { marketCapRank: "asc" },
    select: { externalId: true, name: true, image: true, currentPrice: true },
  });
  return coins.map((coin) => ({
    id: coin.externalId,
    name: coin.name,
    image: coin.image,
    price: Number(coin.currentPrice),
  }));
};
