"use client";

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/_components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/app/_components/ui/chart";
import { WeeklyTransactionTotals } from "@/app/_data/getDashboard/types";
import { formatCurrency } from "@/app/_utils/currency";

interface TransactionsLineChartProps {
  weeklyTransactions: WeeklyTransactionTotals[];
}

const chartConfig = {
  Receita: { label: "Receita", color: "#55B02E" },
  Despesas: { label: "Despesas", color: "#F6352E" },
} satisfies ChartConfig;

const compactCurrency = (value: number) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    notation: "compact",
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
  }).format(value);

export default function TransactionsLineChart({
  weeklyTransactions,
}: TransactionsLineChartProps) {
  const chartData = weeklyTransactions.map((week) => ({
    week: week.week.replace("Semana ", "Sem. "),
    Receita: week.deposits,
    Despesas: week.expenses,
  }));

  return (
    <Card className="flex min-w-0 flex-1 flex-col animate-fade-in-up animation-delay-300">
      <CardHeader className="flex-col items-start gap-2 space-y-0 p-4 pb-0 sm:flex-row sm:items-center sm:justify-between md:p-6 md:pb-0">
        <CardTitle className="text-base font-bold">Receitas x despesas por semana</CardTitle>
        <div className="flex shrink-0 gap-3 text-xs text-muted-foreground">
          {Object.entries(chartConfig).map(([key, { label, color }]) => (
            <span key={key} className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
              {label}
            </span>
          ))}
        </div>
      </CardHeader>
      <CardContent className="flex min-h-0 flex-1 flex-col p-4 md:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[220px] w-full lg:h-auto lg:min-h-[200px] lg:flex-1"
        >
          <LineChart accessibilityLayer data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="week"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              interval={0}
              padding={{ left: 12, right: 12 }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={4}
              width={72}
              tickCount={4}
              allowDecimals={false}
              tickFormatter={(value: number) => compactCurrency(value)}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  formatter={(value, name, item) => (
                    <div className="flex w-full items-center justify-between gap-3">
                      <span className="flex items-center gap-1.5 text-muted-foreground">
                        <span
                          className="h-2 w-2 rounded-full"
                          style={{ backgroundColor: item.color }}
                        />
                        {name}
                      </span>
                      <span className="font-semibold tabular-nums text-foreground">
                        {formatCurrency(Number(value))}
                      </span>
                    </div>
                  )}
                />
              }
            />
            <Line
              dataKey="Receita"
              type="monotone"
              stroke="var(--color-Receita)"
              strokeWidth={2.5}
              dot={{ r: 3, strokeWidth: 0, fill: "var(--color-Receita)" }}
              activeDot={{ r: 5 }}
            />
            <Line
              dataKey="Despesas"
              type="monotone"
              stroke="var(--color-Despesas)"
              strokeWidth={2.5}
              dot={{ r: 3, strokeWidth: 0, fill: "var(--color-Despesas)" }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
