"use client";

import { MoneyInput } from "@/app/_components/moneyInput";
import { Label } from "@/app/_components/ui/label";
import { SearchableSelect } from "@/app/_components/ui/searchableSelect";
import { cn } from "@/app/_lib/utils";
import { formatCurrency } from "@/app/_utils/currency";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalculatorIcon, Loader2Icon } from "lucide-react";
import { useEffect, useMemo, useState, useTransition } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { getCoinPrices } from "../_actions/getCoinPrices";
import { CoinOption } from "../_data/getCoinOptions";
import { formatCompactBRL, formatCryptoPrice, formatPercent } from "../_lib/format";
import { PricePoint, SimulationMode, simulate } from "../_lib/simulation";

const PERIODS = [
  { months: 3, label: "3 meses" },
  { months: 6, label: "6 meses" },
  { months: 12, label: "1 ano" },
];

const MODES: { value: SimulationMode; label: string; hint: string }[] = [
  { value: "monthly", label: "Todo mês", hint: "Aporte mensal" },
  { value: "lump", label: "Uma vez", hint: "Aporte único" },
];

interface SimulatorProps {
  coins?: CoinOption[];
  fixedCoin?: { id: string; name: string; prices: PricePoint[] };
  initialCoinId?: string;
}

const Pill = ({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) => (
  <button
    type="button"
    aria-pressed={active}
    onClick={onClick}
    className={cn(
      "rounded-full px-3 py-1.5 text-sm transition-all",
      active
        ? "bg-primary/15 font-bold text-primary ring-1 ring-primary/30"
        : "text-muted-foreground hover:bg-white/[0.05] hover:text-foreground",
    )}
  >
    {children}
  </button>
);

const Simulator = ({ coins = [], fixedCoin, initialCoinId }: SimulatorProps) => {
  const [coinId, setCoinId] = useState(fixedCoin?.id ?? initialCoinId ?? "bitcoin");
  const [prices, setPrices] = useState<PricePoint[]>(fixedCoin?.prices ?? []);
  const [mode, setMode] = useState<SimulationMode>("monthly");
  const [amount, setAmount] = useState<number | undefined>(200);
  const [months, setMonths] = useState(12);
  const [isLoading, startLoading] = useTransition();

  useEffect(() => {
    if (fixedCoin) return;
    startLoading(async () => {
      setPrices(await getCoinPrices(coinId));
    });
  }, [coinId, fixedCoin]);

  const coinName = fixedCoin?.name ?? coins.find((coin) => coin.id === coinId)?.name ?? "";
  const result = useMemo(
    () => simulate(prices, mode, amount ?? 0, months),
    [prices, mode, amount, months],
  );
  const coinOptions = useMemo(
    () => coins.map((coin) => ({ value: coin.id, label: coin.name })),
    [coins],
  );
  const isProfit = (result?.profit ?? 0) >= 0;

  return (
    <div className="grid grid-cols-1 gap-4 md:gap-6 lg:grid-cols-[340px,1fr]">
      <div className="space-y-5 rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5 shadow-xl shadow-black/20 backdrop-blur-xl">
        <div className="flex items-center gap-2">
          <CalculatorIcon className="h-4 w-4 text-primary" />
          <h2 className="font-bold">E se eu tivesse investido?</h2>
        </div>
        {!fixedCoin && (
          <div className="space-y-2">
            <Label>Moeda</Label>
            <SearchableSelect
              options={coinOptions}
              value={coinId}
              onValueChange={setCoinId}
              searchPlaceholder="Pesquisar moeda..."
            />
          </div>
        )}
        <div className="space-y-2">
          <Label>Frequência</Label>
          <div className="flex gap-1 rounded-full border border-white/[0.06] bg-white/[0.02] p-1">
            {MODES.map((option) => (
              <div key={option.value} className="flex-1 [&>button]:w-full">
                <Pill active={mode === option.value} onClick={() => setMode(option.value)}>
                  {option.label}
                </Pill>
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="simulator-amount">
            {mode === "monthly" ? "Valor por mês" : "Valor investido"}
          </Label>
          <MoneyInput
            id="simulator-amount"
            placeholder="R$ 0,00"
            className="h-12 text-lg font-bold tabular-nums md:text-lg"
            value={amount ?? ""}
            onValueChange={({ floatValue }) => setAmount(floatValue)}
          />
        </div>
        <div className="space-y-2">
          <Label>Período</Label>
          <div className="flex gap-1 rounded-full border border-white/[0.06] bg-white/[0.02] p-1">
            {PERIODS.map((period) => (
              <div key={period.months} className="flex-1 [&>button]:w-full">
                <Pill active={months === period.months} onClick={() => setMonths(period.months)}>
                  {period.label}
                </Pill>
              </div>
            ))}
          </div>
        </div>
        <p className="text-xs leading-relaxed text-muted-foreground">
          Simulação com o preço de fechamento diário em reais. Não considera taxas
          e não garante resultados futuros.
        </p>
      </div>

      <div className="relative min-h-[360px] rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5 shadow-xl shadow-black/20 backdrop-blur-xl">
        {isLoading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-black/30 backdrop-blur-sm">
            <Loader2Icon className="h-6 w-6 animate-spin text-primary" />
          </div>
        )}
        {!result ? (
          <p className="flex h-full min-h-[320px] items-center justify-center text-sm text-muted-foreground">
            {prices.length === 0 && !isLoading
              ? "Sem histórico de preço para esta moeda."
              : "Informe um valor para simular."}
          </p>
        ) : (
          <>
            <p className="text-sm text-muted-foreground">
              {mode === "monthly"
                ? `${result.purchases} aportes de ${formatCurrency(amount ?? 0)} em ${coinName}`
                : `${formatCurrency(amount ?? 0)} em ${coinName}`}{" "}
              hoje valeriam
            </p>
            <div className="mt-1 flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="text-3xl font-bold tabular-nums md:text-4xl">
                {formatCurrency(result.finalValue)}
              </span>
              <span
                className={cn(
                  "rounded-full px-2.5 py-1 text-sm font-semibold tabular-nums",
                  isProfit ? "bg-sucess/15 text-sucess" : "bg-danger/15 text-danger",
                )}
              >
                {isProfit ? "+" : "−"}
                {formatCurrency(Math.abs(result.profit))} ({formatPercent(result.returnPercent)})
              </span>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2 text-sm">
              {[
                { label: "Investido", value: formatCurrency(result.invested) },
                { label: "Preço médio", value: formatCryptoPrice(result.averagePrice) },
                {
                  label: "Quantidade",
                  value: result.units.toLocaleString("pt-BR", { maximumFractionDigits: 6 }),
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 py-2"
                >
                  <p className="text-xs text-muted-foreground">{item.label}</p>
                  <p className="truncate font-semibold tabular-nums">{item.value}</p>
                </div>
              ))}
            </div>

            <div className="mt-5 h-56">
              <ResponsiveContainer>
                <AreaChart data={result.series} margin={{ left: 0, right: 8, top: 8 }}>
                  <defs>
                    <linearGradient id="sim-value" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor={isProfit ? "#55B02E" : "#F6352E"} stopOpacity={0.35} />
                      <stop offset="100%" stopColor={isProfit ? "#55B02E" : "#F6352E"} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(value: number) => format(value, "MMM", { locale: ptBR })}
                    stroke="rgba(255,255,255,0.4)"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    minTickGap={24}
                  />
                  <YAxis
                    tickFormatter={(value: number) => formatCompactBRL(value)}
                    stroke="rgba(255,255,255,0.4)"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    width={72}
                  />
                  <Tooltip
                    labelFormatter={(value: number) =>
                      format(value, "dd 'de' MMM yyyy", { locale: ptBR })
                    }
                    formatter={(value: number, name: string) => [
                      formatCurrency(value),
                      name === "value" ? "Valor" : "Investido",
                    ]}
                    contentStyle={{
                      background: "#0b1116",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: 12,
                      fontSize: 12,
                    }}
                  />
                  <Area
                    type="stepAfter"
                    dataKey="invested"
                    stroke="rgba(255,255,255,0.5)"
                    strokeDasharray="4 4"
                    fill="none"
                    isAnimationActive={false}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke={isProfit ? "#55B02E" : "#F6352E"}
                    strokeWidth={2}
                    fill="url(#sim-value)"
                    isAnimationActive={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              Linha tracejada: total investido · Área: valor da posição
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default Simulator;
