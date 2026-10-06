import { cn } from "@/app/_lib/utils";
import { formatCurrency } from "@/app/_utils/currency";
import { ActivityIcon, CoinsIcon, PiggyBankIcon, TrendingUpIcon } from "lucide-react";
import { ReactNode } from "react";
import { formatPercent } from "../_lib/format";
import { PortfolioSummary as Summary } from "../_lib/portfolio";

const Tile = ({
  icon,
  label,
  value,
  hint,
  tone = "neutral",
  highlight,
  delay,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  hint?: string;
  tone?: "neutral" | "up" | "down";
  highlight?: boolean;
  delay: string;
}) => (
  <div
    className={cn(
      "rounded-2xl border p-5 shadow-xl shadow-black/20 backdrop-blur-xl animate-fade-in-up",
      delay,
      highlight
        ? "border-primary/25 bg-gradient-to-br from-primary/20 via-primary/5 to-transparent"
        : "border-white/[0.07] bg-white/[0.025]",
    )}
  >
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.05] text-primary [&_svg]:size-4">
        {icon}
      </div>
      {label}
    </div>
    <p
      className={cn(
        "mt-3 truncate text-2xl font-bold tabular-nums md:text-3xl",
        tone === "up" && "text-sucess",
        tone === "down" && "text-danger",
      )}
    >
      {value}
    </p>
    {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
  </div>
);

const toneOf = (value: number) => (value > 0 ? "up" : value < 0 ? "down" : "neutral");
const signed = (value: number) => `${value > 0 ? "+" : value < 0 ? "−" : ""}${formatCurrency(Math.abs(value))}`;

const PortfolioSummary = ({ summary }: { summary: Summary }) => (
  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 xl:grid-cols-4">
    <Tile
      highlight
      icon={<CoinsIcon />}
      label="Valor da carteira"
      value={formatCurrency(summary.currentValue)}
      hint={`${summary.holdings.length} ${summary.holdings.length === 1 ? "moeda" : "moedas"}`}
      delay=""
    />
    <Tile
      icon={<PiggyBankIcon />}
      label="Custo das posições"
      value={formatCurrency(summary.costBasis)}
      hint="Preço médio × quantidade atual"
      delay="animation-delay-100"
    />
    <Tile
      icon={<TrendingUpIcon />}
      label="Resultado"
      value={signed(summary.profit)}
      tone={toneOf(summary.profit)}
      hint={`${formatPercent(summary.profitPercent)} · realizado ${signed(summary.realizedProfit)}`}
      delay="animation-delay-200"
    />
    <Tile
      icon={<ActivityIcon />}
      label="Variação 24h"
      value={signed(summary.change24hValue)}
      tone={toneOf(summary.change24hValue)}
      hint={formatPercent(summary.change24hPercent)}
      delay="animation-delay-300"
    />
  </div>
);

export default PortfolioSummary;
