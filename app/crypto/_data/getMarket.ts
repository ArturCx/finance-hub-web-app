import { db } from "@/app/_lib/prisma";
import { Prisma } from "@prisma/client";
import { MarketRow } from "../_components/marketTable";
import { MoverCoin } from "../_components/marketMovers";

export const MARKET_PAGE_SIZE = 15;

const moverSelect = {
  externalId: true,
  name: true,
  image: true,
  currentPrice: true,
  priceChangePercentage24h: true,
} satisfies Prisma.CryptosSelect;

const coinSelect = {
  externalId: true,
  name: true,
  image: true,
  marketCapRank: true,
  currentPrice: true,
  priceChangePercentage24h: true,
  marketCap: true,
  totalVolume: true,
  charts: { select: { prices: true } },
} satisfies Prisma.CryptosSelect;

type CoinRecord = Prisma.CryptosGetPayload<{ select: typeof coinSelect }>;

const lastWeek = (prices: unknown) =>
  Array.isArray(prices)
    ? (prices as [number, number][]).slice(-8).map(([, price]) => price)
    : [];

const toRow = (coin: CoinRecord, favorites: Set<string>): MarketRow => ({
  id: coin.externalId,
  rank: Number(coin.marketCapRank),
  name: coin.name,
  image: coin.image,
  price: Number(coin.currentPrice),
  change24h: Number(coin.priceChangePercentage24h),
  marketCap: Number(coin.marketCap),
  volume: Number(coin.totalVolume),
  sparkline: lastWeek(coin.charts?.prices),
  isFavorite: favorites.has(coin.externalId),
});

const toMover = (
  coin: Prisma.CryptosGetPayload<{ select: typeof moverSelect }>,
): MoverCoin => ({
  id: coin.externalId,
  name: coin.name,
  image: coin.image,
  price: Number(coin.currentPrice),
  change24h: Number(coin.priceChangePercentage24h),
});

export const getMarket = async (userId: string, query: string, page: number) => {
  const where: Prisma.CryptosWhereInput = {
    marketCapRank: { gt: 0 },
    ...(query && {
      OR: [
        { name: { contains: query, mode: "insensitive" } },
        { externalId: { contains: query, mode: "insensitive" } },
      ],
    }),
  };
  const topCoins: Prisma.CryptosWhereInput = { marketCapRank: { lte: 100, gt: 0 } };

  const [favorites, coins, total, gainers, losers] = await Promise.all([
    db.cryptoFavorite.findMany({
      where: { userId },
      orderBy: { createdAt: "asc" },
      select: { coin: { select: coinSelect } },
    }),
    db.cryptos.findMany({
      where,
      orderBy: { marketCapRank: "asc" },
      skip: (page - 1) * MARKET_PAGE_SIZE,
      take: MARKET_PAGE_SIZE,
      select: coinSelect,
    }),
    db.cryptos.count({ where }),
    db.cryptos.findMany({
      where: topCoins,
      orderBy: { priceChangePercentage24h: "desc" },
      take: 5,
      select: moverSelect,
    }),
    db.cryptos.findMany({
      where: topCoins,
      orderBy: { priceChangePercentage24h: "asc" },
      take: 5,
      select: moverSelect,
    }),
  ]);

  const favoriteIds = new Set(favorites.map((favorite) => favorite.coin.externalId));
  return {
    favorites: favorites.map((favorite) => toRow(favorite.coin, favoriteIds)),
    rows: coins.map((coin) => toRow(coin, favoriteIds)),
    totalPages: Math.max(Math.ceil(total / MARKET_PAGE_SIZE), 1),
    gainers: gainers.map(toMover),
    losers: losers.map(toMover),
  };
};
