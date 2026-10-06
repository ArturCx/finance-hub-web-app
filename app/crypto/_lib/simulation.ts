import { addMonths, subMonths } from "date-fns";

export type PricePoint = [timestamp: number, price: number];
export type SimulationMode = "monthly" | "lump";

export interface SimulationPoint {
  date: number;
  invested: number;
  value: number;
}

export interface SimulationResult {
  invested: number;
  finalValue: number;
  profit: number;
  returnPercent: number;
  units: number;
  averagePrice: number;
  purchases: number;
  series: SimulationPoint[];
}

const priceIndexAt = (prices: PricePoint[], timestamp: number) => {
  const index = prices.findIndex(([time]) => time >= timestamp);
  return index === -1 ? prices.length - 1 : index;
};

const MAX_CHART_POINTS = 120;

export const simulate = (
  prices: PricePoint[],
  mode: SimulationMode,
  amount: number,
  months: number,
): SimulationResult | null => {
  if (prices.length < 2 || amount <= 0) return null;

  const end = prices[prices.length - 1][0];
  const start = Math.max(subMonths(end, months).getTime(), prices[0][0]);

  const purchaseDates =
    mode === "lump"
      ? [start]
      : Array.from({ length: months }, (_, index) => addMonths(start, index).getTime()).filter(
          (date) => date <= end,
        );
  const purchaseIndexes = new Map<number, number>();
  for (const date of purchaseDates) {
    const index = priceIndexAt(prices, date);
    purchaseIndexes.set(index, (purchaseIndexes.get(index) ?? 0) + amount);
  }

  const startIndex = priceIndexAt(prices, start);
  let units = 0;
  let invested = 0;
  const series: SimulationPoint[] = [];
  for (let index = startIndex; index < prices.length; index++) {
    const [date, price] = prices[index];
    const contribution = purchaseIndexes.get(index);
    if (contribution && price > 0) {
      units += contribution / price;
      invested += contribution;
    }
    series.push({ date, invested, value: units * price });
  }

  const finalValue = units * prices[prices.length - 1][1];
  const step = Math.ceil(series.length / MAX_CHART_POINTS);
  const sampled = series.filter(
    (_, index) => index % step === 0 || index === series.length - 1,
  );

  return {
    invested,
    finalValue,
    profit: finalValue - invested,
    returnPercent: invested > 0 ? ((finalValue - invested) / invested) * 100 : 0,
    units,
    averagePrice: units > 0 ? invested / units : 0,
    purchases: purchaseDates.length,
    series: sampled,
  };
};
