import { cn } from "@/app/_lib/utils";
import { TrendingDownIcon, TrendingUpIcon } from "lucide-react";
import { formatPercent } from "../_lib/format";

interface CryptoVariationBadgeProps {
  variation: number | null;
  className?: string;
}

const CryptoVariationBadge = ({ variation, className }: CryptoVariationBadgeProps) => {
  if (variation === null || Number.isNaN(variation)) {
    return <span className="text-xs text-muted-foreground">—</span>;
  }
  const isUp = variation >= 0;
  const Icon = isUp ? TrendingUpIcon : TrendingDownIcon;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold tabular-nums",
        isUp ? "bg-sucess/15 text-sucess" : "bg-danger/15 text-danger",
        className,
      )}
    >
      <Icon className="h-3 w-3" />
      {formatPercent(variation)}
    </span>
  );
};

export default CryptoVariationBadge;
