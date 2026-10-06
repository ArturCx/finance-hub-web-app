"use client";

import { formatCurrency } from "@/app/_utils/currency";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

export const ALLOCATION_COLORS = [
  "#0097b2",
  "#f59e0b",
  "#8b5cf6",
  "#10b981",
  "#ec4899",
  "#3b82f6",
  "#64748b",
];

export interface AllocationSlice {
  name: string;
  value: number;
}

const AllocationChart = ({ slices }: { slices: AllocationSlice[] }) => {
  const total = slices.reduce((sum, slice) => sum + slice.value, 0);
  return (
    <div className="flex flex-col items-center gap-5 sm:flex-row lg:flex-col xl:flex-row">
      <div className="relative h-44 w-44 shrink-0">
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={slices}
              dataKey="value"
              nameKey="name"
              innerRadius="68%"
              outerRadius="100%"
              paddingAngle={slices.length > 1 ? 2 : 0}
              stroke="none"
              isAnimationActive={false}
            >
              {slices.map((slice, index) => (
                <Cell key={slice.name} fill={ALLOCATION_COLORS[index % ALLOCATION_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number) => formatCurrency(value)}
              contentStyle={{
                background: "#0b1116",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 12,
                fontSize: 12,
              }}
              itemStyle={{ color: "#fff" }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xs text-muted-foreground">Moedas</span>
          <span className="text-xl font-bold">{slices.length}</span>
        </div>
      </div>
      <ul className="w-full space-y-2">
        {slices.map((slice, index) => (
          <li key={slice.name} className="flex items-center justify-between gap-3 text-sm">
            <span className="flex min-w-0 items-center gap-2">
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: ALLOCATION_COLORS[index % ALLOCATION_COLORS.length] }}
              />
              <span className="truncate">{slice.name}</span>
            </span>
            <span className="font-semibold tabular-nums text-muted-foreground">
              {total > 0 ? ((slice.value / total) * 100).toFixed(1).replace(".", ",") : 0}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AllocationChart;
