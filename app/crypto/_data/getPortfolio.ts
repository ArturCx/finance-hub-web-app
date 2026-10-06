import { db } from "@/app/_lib/prisma";
import { getLivePrices } from "../_lib/livePrices";
import { computePortfolio, TradeInput } from "../_lib/portfolio";
import { TradeView } from "../_components/tradesHistory";

export const getPortfolio = async (userId: string) => {
  const trades = await db.cryptoTrade.findMany({
    where: { userId },
    orderBy: { date: "desc" },
    include: { coin: { select: { name: true, image: true } } },
  });
  const inputs: TradeInput[] = trades.map((trade) => ({
    coinId: trade.coinId,
    type: trade.type,
    quantity: Number(trade.quantity),
    price: Number(trade.price),
    date: trade.date,
  }));
  const prices = await getLivePrices(trades.map((trade) => trade.coinId));
  const summary = computePortfolio(inputs, prices);

  const coins: Record<string, { name: string; image: string }> = {};
  for (const trade of trades) {
    coins[trade.coinId] = trade.coin;
  }
  const holdingsQuantity = Object.fromEntries(
    summary.holdings.map((holding) => [holding.coinId, holding.quantity]),
  );
  const tradeViews: TradeView[] = trades.map((trade) => ({
    id: trade.id,
    type: trade.type,
    coinId: trade.coinId,
    coinName: trade.coin.name,
    coinImage: trade.coin.image,
    quantity: Number(trade.quantity),
    price: Number(trade.price),
    date: trade.date.toISOString(),
    hasTransaction: Boolean(trade.transactionId),
  }));

  return { summary, coins, holdingsQuantity, trades: tradeViews };
};
