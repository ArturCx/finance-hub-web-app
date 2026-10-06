"use client";

import { cn } from "@/app/_lib/utils";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatCryptoPrice, formatPercent } from "../../_lib/format";
import { PricePoint } from "../../_lib/simulation";

const RANGES = [
  { label: "7D", days: 7 },
  { label: "30D", days: 30 },
  { label: "90D", days: 90 },
  { label: "1A", days: 365 },
];

const DAY = 24 * 60 * 60 * 1000;

const PriceChart = ({ prices }: { prices: PricePoint[] }) => {
  const [days, setDays] = useState(30);

  const data = useMemo(() => {
    if (prices.length === 0) return [];
    const end = prices[prices.length - 1][0];
    return prices
      .filter(([time]) => time >= end - days * DAY)
      .map(([date, price]) => ({ date, price }));
  }, [prices, days]);

  const first = data[0]?.price ?? 0;
  const last = data[data.length - 1]?.price ?? 0;
  const change = first > 0 ? ((last - first) / first) * 100 : 0;
  const high = Math.max(...data.map((point) => point.price));
  const low = Math.min(...data.map((point) => point.price));
  const isUp = change >= 0;
  const color = isUp ? "#55B02E" : "#F6352E";

  if (data.length < 2) {
    return (
      <p className="py-16 text-center text-sm text-muted-foreground">
        Sem histórico de preço para esta moeda.
      </p>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
          <span className={cn("font-semibold tabular-nums", isUp ? "text-sucess" : "text-danger")}>
            {formatPercent(change)} no período
          </span>
          <span className="text-muted-foreground">
            Máx <span className="tabular-nums text-foreground">{formatCryptoPrice(high)}</span>
          </span>
          <span className="text-muted-foreground">
            Mín <span className="tabular-nums text-foreground">{formatCryptoPrice(low)}</span>
          </span>
        </div>
        <div className="flex gap-1 rounded-full border border-white/[0.06] bg-white/[0.02] p-1">
          {RANGES.map((range) => (
            <button
              key={range.days}
              type="button"
              aria-pressed={days === range.days}
              onClick={() => setDays(range.days)}
              className={cn(
                "rounded-full px-3 py-1 text-xs font-semibold transition-all",
                days === range.days
                  ? "bg-primary/15 text-primary ring-1 ring-primary/30"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-4 h-72">
        <ResponsiveContainer>
          <AreaChart data={data} margin={{ left: 0, right: 8, top: 8 }}>
            <defs>
              <linearGradient id="price-area" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity={0.35} />
                <stop offset="100%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis
              dataKey="date"
              tickFormatter={(value: number) =>
                format(value, days <= 30 ? "dd/MM" : "MMM", { locale: ptBR })
              }
              stroke="rgba(255,255,255,0.4)"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              minTickGap={28}
            />
            <YAxis
              domain={["auto", "auto"]}
              tickFormatter={(value: number) => formatCryptoPrice(value)}
              stroke="rgba(255,255,255,0.4)"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              width={96}
            />
            <Tooltip
              labelFormatter={(value: number) => format(value, "dd 'de' MMM yyyy", { locale: ptBR })}
              formatter={(value: number) => [formatCryptoPrice(value), "Preço"]}
              contentStyle={{
                background: "#0b1116",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 12,
                fontSize: 12,
              }}
            />
            <Area
              type="monotone"
              dataKey="price"
              stroke={color}
              strokeWidth={2}
              fill="url(#price-area)"
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PriceChart;
