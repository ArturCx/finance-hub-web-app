"use client";

import { CartesianGrid, Line, LineChart, XAxis } from "recharts";
import { Card, CardContent } from "@/app/_components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/app/_components/ui/chart";
import { WeeklyTransactionTotals } from "@/app/_data/getDashboard/types";

interface TransactionsLineChartProps {
  weeklyTransactions: WeeklyTransactionTotals[];
}

const chartConfig = {
  Receita: {
    label: "Receita",
    color: "#55B02E",
  },
  Despesas: {
    label: "Despesas",
    color: "#E93030",
  },
} satisfies ChartConfig;

export default function TransactionsLineChart({
  weeklyTransactions,
}: TransactionsLineChartProps) {
  const chartData = weeklyTransactions.map((week) => ({
    week: week.week,
    Receita: week.deposits,
    Despesas: week.expenses,
  }));

  return (
    <Card className="flex flex-col p-4 md:p-6 w-full h-full min-h-[280px] animate-fade-in-up animation-delay-300">
      <CardContent className="flex-1 pb-0 px-0 md:px-2 w-full h-full flex justify-center items-center">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px] w-full"
        >
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 24,
              right: 24,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="week"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              interval={0}
              padding={{ left: 8, right: 8 }}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Line
              dataKey="Receita"
              type="monotone"
              stroke="#55B02E"
              strokeWidth={2}
              dot={false}
            />
            <Line
              dataKey="Despesas"
              type="monotone"
              stroke="#E93030"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
