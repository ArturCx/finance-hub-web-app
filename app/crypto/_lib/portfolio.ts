import { CryptoTradeType } from "@prisma/client";

export interface TradeInput {
  coinId: string;
  type: CryptoTradeType;
  quantity: number;
  price: number;
  date: Date;
}

export interface CoinPrice {
  price: number;
  change24h: number | null;
}

export interface Holding {
  coinId: string;
  quantity: number;
  averagePrice: number;
  costBasis: number;
  currentPrice: number;
  currentValue: number;
  profit: number;
  profitPercent: number;
  realizedProfit: number;
  change24h: number | null;
}

export interface PortfolioSummary {
  holdings: Holding[];
  currentValue: number;
  costBasis: number;
  profit: number;
  profitPercent: number;
  realizedProfit: number;
  change24hValue: number;
  change24hPercent: number;
}

const DUST = 1e-10;

export const computePositions = (trades: TradeInput[]) => {
  const sorted = [...trades].sort((a, b) => a.date.getTime() - b.date.getTime());
  const positions = new Map<
    string,
    { quantity: number; cost: number; realized: number }
  >();
  for (const trade of sorted) {
    const position = positions.get(trade.coinId) ?? {
      quantity: 0,
      cost: 0,
      realized: 0,
    };
    if (trade.type === CryptoTradeType.BUY) {
      position.quantity += trade.quantity;
      position.cost += trade.quantity * trade.price;
    } else {
      const sold = Math.min(trade.quantity, position.quantity);
      const averagePrice = position.quantity > 0 ? position.cost / position.quantity : 0;
      position.realized += sold * (trade.price - averagePrice);
      position.cost -= sold * averagePrice;
      position.quantity -= sold;
      if (position.quantity < DUST) {
        position.quantity = 0;
        position.cost = 0;
      }
    }
    positions.set(trade.coinId, position);
  }
  return positions;
};

export const computePortfolio = (
  trades: TradeInput[],
  prices: Record<string, CoinPrice>,
): PortfolioSummary => {
  const positions = computePositions(trades);
  const holdings: Holding[] = [];
  let realizedProfit = 0;

  positions.forEach((position, coinId) => {
    realizedProfit += position.realized;
    if (position.quantity <= 0) return;
    const price = prices[coinId]?.price ?? 0;
    const currentValue = position.quantity * price;
    const profit = currentValue - position.cost;
    holdings.push({
      coinId,
      quantity: position.quantity,
      averagePrice: position.cost / position.quantity,
      costBasis: position.cost,
      currentPrice: price,
      currentValue,
      profit,
      profitPercent: position.cost > 0 ? (profit / position.cost) * 100 : 0,
      realizedProfit: position.realized,
      change24h: prices[coinId]?.change24h ?? null,
    });
  });

  holdings.sort((a, b) => b.currentValue - a.currentValue);

  const currentValue = holdings.reduce((sum, h) => sum + h.currentValue, 0);
  const costBasis = holdings.reduce((sum, h) => sum + h.costBasis, 0);
  const profit = currentValue - costBasis;
  const value24hAgo = holdings.reduce(
    (sum, h) =>
      sum + (h.change24h !== null ? h.currentValue / (1 + h.change24h / 100) : h.currentValue),
    0,
  );
  const change24hValue = currentValue - value24hAgo;

  return {
    holdings,
    currentValue,
    costBasis,
    profit,
    profitPercent: costBasis > 0 ? (profit / costBasis) * 100 : 0,
    realizedProfit,
    change24hValue,
    change24hPercent: value24hAgo > 0 ? (change24hValue / value24hAgo) * 100 : 0,
  };
};

export const getHeldQuantity = (trades: TradeInput[], coinId: string) =>
  computePositions(trades.filter((trade) => trade.coinId === coinId)).get(coinId)
    ?.quantity ?? 0;
