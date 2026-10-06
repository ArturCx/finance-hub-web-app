import { cn } from "@/app/_lib/utils";

interface SparklineProps {
  values: number[];
  className?: string;
}

const Sparkline = ({ values, className }: SparklineProps) => {
  if (values.length < 2) {
    return <span className="text-xs text-muted-foreground">—</span>;
  }
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const width = 100;
  const height = 32;
  const points = values
    .map((value, index) => {
      const x = (index / (values.length - 1)) * width;
      const y = height - 2 - ((value - min) / range) * (height - 4);
      return `${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(" ");
  const isUp = values[values.length - 1] >= values[0];

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      aria-hidden
      className={cn("h-8 w-24", className)}
    >
      <polyline
        points={points}
        fill="none"
        stroke={isUp ? "#55B02E" : "#F6352E"}
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
};

export default Sparkline;
