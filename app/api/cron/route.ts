import { NextRequest, NextResponse } from "next/server";
import { db } from "@/app/_lib/prisma";
import {
  isStale,
  mergeDailyPoint,
  SeriesPoint,
  toSeries,
} from "@/app/crypto/_lib/history";

export const revalidate = 0;
export const maxDuration = 60;

const MARKETS_URL =
  "https://api.coingecko.com/api/v3/coins/markets?vs_currency=brl&order=market_cap_desc&per_page=200&precision=2";
const marketChartUrl = (id: string) =>
  `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=brl&days=365&interval=daily&precision=2`;

const BACKFILL_PER_RUN = 15;
const BACKFILL_INTERVAL_MS = 700;
const WRITE_CONCURRENCY = 10;

interface MarketCoin {
  id: string;
  name: string;
  image: string;
  current_price: number | null;
  market_cap_rank: number | null;
  market_cap: number | null;
  price_change_percentage_24h: number | null;
  total_volume: number | null;
}

const geckoHeaders = {
  accept: "application/json",
  "x-cg-demo-api-key": process.env.GECKO_API_KEY ?? "",
};

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const inChunks = async <T>(items: T[], size: number, task: (item: T) => Promise<unknown>) => {
  for (let index = 0; index < items.length; index += size) {
    await Promise.all(items.slice(index, index + size).map(task));
  }
};

export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (secret && req.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const response = await fetch(MARKETS_URL, { headers: geckoHeaders, cache: "no-store" });
    if (!response.ok) {
      throw new Error(`CoinGecko markets respondeu ${response.status}`);
    }
    const coins: MarketCoin[] = (await response.json()).filter(
      (coin: MarketCoin) => coin.current_price !== null,
    );

    await inChunks(coins, WRITE_CONCURRENCY, (coin) => {
      const data = {
        name: coin.name,
        image: coin.image,
        currentPrice: coin.current_price ?? 0,
        marketCapRank: coin.market_cap_rank ?? 0,
        marketCap: coin.market_cap ?? 0,
        priceChangePercentage24h: coin.price_change_percentage_24h ?? 0,
        totalVolume: coin.total_volume ?? 0,
      };
      return db.cryptos.upsert({
        where: { externalId: coin.id },
        create: { externalId: coin.id, ...data },
        update: data,
      });
    });

    await db.cryptos.updateMany({
      where: { externalId: { notIn: coins.map((coin) => coin.id) } },
      data: { marketCapRank: 0 },
    });

    const now = Date.now();
    const charts = await db.cryptoCharts.findMany({
      where: { externalId: { in: coins.map((coin) => coin.id) } },
      select: { externalId: true, prices: true, marketCaps: true, totalVolumes: true },
    });
    const chartsById = new Map(charts.map((chart) => [chart.externalId, chart]));

    const stale: MarketCoin[] = [];
    const fresh: MarketCoin[] = [];
    for (const coin of coins) {
      const chart = chartsById.get(coin.id);
      if (!chart || isStale(toSeries(chart.prices), now)) {
        stale.push(coin);
      } else {
        fresh.push(coin);
      }
    }

    await inChunks(fresh, WRITE_CONCURRENCY, (coin) => {
      const chart = chartsById.get(coin.id)!;
      return db.cryptoCharts.update({
        where: { externalId: coin.id },
        data: {
          prices: mergeDailyPoint(toSeries(chart.prices), now, coin.current_price ?? 0),
          marketCaps: mergeDailyPoint(toSeries(chart.marketCaps), now, coin.market_cap ?? 0),
          totalVolumes: mergeDailyPoint(toSeries(chart.totalVolumes), now, coin.total_volume ?? 0),
        },
      });
    });

    const backfilled: string[] = [];
    for (const coin of stale.slice(0, BACKFILL_PER_RUN)) {
      try {
        const chartResponse = await fetch(marketChartUrl(coin.id), {
          headers: geckoHeaders,
          cache: "no-store",
        });
        if (chartResponse.status === 429) break;
        if (!chartResponse.ok) continue;
        const chart = await chartResponse.json();
        const prices: SeriesPoint[] = toSeries(chart.prices);
        if (prices.length === 0) continue;
        const data = {
          prices,
          marketCaps: toSeries(chart.market_caps),
          totalVolumes: toSeries(chart.total_volumes),
        };
        await db.cryptoCharts.upsert({
          where: { externalId: coin.id },
          create: { externalId: coin.id, ...data },
          update: data,
        });
        backfilled.push(coin.id);
      } catch (error) {
        console.error(`Falha ao buscar o histórico de ${coin.id}:`, error);
      }
      await delay(BACKFILL_INTERVAL_MS);
    }

    return NextResponse.json({
      message: "Dados de cripto atualizados",
      coins: coins.length,
      appended: fresh.length,
      backfilled: backfilled.length,
      pendingBackfill: stale.length - backfilled.length,
    });
  } catch (error) {
    console.error("Erro ao atualizar dados de cripto:", error);
    return NextResponse.json(
      { message: "Falha ao atualizar dados de cripto" },
      { status: 500 },
    );
  }
}
