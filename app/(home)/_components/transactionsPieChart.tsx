"use client";

import { Pie, PieChart } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/app/_components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/app/_components/ui/chart";
import { TransactionType } from "@prisma/client";
import { TransactionPercentagePerType } from "@/app/_data/getDashboard/types";
import { formatCurrency } from "@/app/_utils/currency";
import { PiggyBankIcon, TrendingDownIcon, TrendingUpIcon } from "lucide-react";
import PercentageItem from "./percentageItem";

const COLORS = {
  [TransactionType.DEPOSIT]: "#0097b2",
  [TransactionType.EXPENSE]: "#F6352E",
  [TransactionType.INVESTMENT]: "#FFFFFF",
};

const chartConfig = {
  [TransactionType.DEPOSIT]: { label: "Receita", color: COLORS.DEPOSIT },
  [TransactionType.EXPENSE]: { label: "Despesas", color: COLORS.EXPENSE },
  [TransactionType.INVESTMENT]: { label: "Investido", color: COLORS.INVESTMENT },
} satisfies ChartConfig;

const compactCurrency = (value: number) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    notation: "compact",
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
  }).format(value);

interface TransactionsPieChartProps {
  typesPercentage: TransactionPercentagePerType;
  depositsTotal: number;
  investmentsTotal: number;
  expensesTotal: number;
}

const TransactionsPieChart = ({
  depositsTotal,
  investmentsTotal,
  expensesTotal,
  typesPercentage,
}: TransactionsPieChartProps) => {
  const chartData = [
    { type: TransactionType.DEPOSIT, amount: depositsTotal, fill: COLORS.DEPOSIT },
    { type: TransactionType.EXPENSE, amount: expensesTotal, fill: COLORS.EXPENSE },
    { type: TransactionType.INVESTMENT, amount: investmentsTotal, fill: COLORS.INVESTMENT },
  ];
  const total = depositsTotal + expensesTotal + investmentsTotal;

  return (
    <Card className="flex flex-col animate-fade-in-up animation-delay-200 lg:w-80 lg:shrink-0">
      <CardHeader className="p-4 pb-0 md:p-6 md:pb-0">
        <CardTitle className="text-base font-bold">Distribuição do mês</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-4 p-4 md:p-6">
        <div className="relative mx-auto h-[200px] w-full max-w-[240px]">
          <ChartContainer config={chartConfig} className="aspect-auto h-full w-full">
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    hideLabel
                    formatter={(value, name) => (
                      <div className="flex w-full items-center justify-between gap-3">
                        <span className="text-muted-foreground">
                          {chartConfig[name as TransactionType]?.label ?? name}
                        </span>
                        <span className="font-semibold tabular-nums text-foreground">
                          {formatCurrency(Number(value))}
                        </span>
                      </div>
                    )}
                  />
                }
              />
              <Pie
                data={chartData}
                dataKey="amount"
                nameKey="type"
                innerRadius="64%"
                outerRadius="96%"
                paddingAngle={total > 0 ? 2 : 0}
                cornerRadius={4}
                stroke="none"
                animationDuration={800}
              />
            </PieChart>
          </ChartContainer>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xs text-muted-foreground">Movimentado</span>
            <span className="text-lg font-bold tabular-nums">{compactCurrency(total)}</span>
          </div>
        </div>

        <div className="space-y-1">
          <PercentageItem
            icon={<TrendingUpIcon size={16} className="text-primary" />}
            title="Receita"
            value={typesPercentage[TransactionType.DEPOSIT]}
          />
          <PercentageItem
            icon={<TrendingDownIcon size={16} className="text-danger" />}
            title="Despesas"
            value={typesPercentage[TransactionType.EXPENSE]}
          />
          <PercentageItem
            icon={<PiggyBankIcon size={16} />}
            title="Investido"
            value={typesPercentage[TransactionType.INVESTMENT]}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default TransactionsPieChart;
