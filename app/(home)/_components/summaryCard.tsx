import AddTransactionButton from "@/app/_components/addTransactionButton";
import { Card, CardContent, CardHeader } from "@/app/_components/ui/card";
import { ReactNode } from "react";

interface SummaryCardProps {
  icon: ReactNode;
  title: string;
  amount: number;
  size?: "small" | "large";
  hint?: ReactNode;
}

const SummaryCard = ({
  icon,
  title,
  amount,
  size = "small",
  hint,
}: SummaryCardProps) => {
  return (
    <Card
      className={
        size === "large"
          ? "relative overflow-hidden border-primary/25 bg-gradient-to-br from-primary/20 via-primary/[0.04] to-transparent"
          : "h-full"
      }
    >
      <CardHeader className="flex-row items-center gap-2 space-y-0 p-4 pb-2 md:gap-3 md:p-6 md:pb-4">
        <div className="flex shrink-0 items-center justify-center rounded-lg bg-white/[0.05] p-2 ring-1 ring-white/[0.06]">
          {icon}
        </div>
        <p
          className={`leading-tight ${size === "small" ? "text-muted-foreground text-sm md:text-base" : "text-white opacity-70 text-sm md:text-base"}`}
        >
          {title}
        </p>
      </CardHeader>
      <CardContent
        className={`flex gap-3 px-4 pb-4 md:px-6 md:pb-6 ${size === "large" ? "flex-col items-start sm:flex-row sm:items-center sm:justify-between" : "items-center justify-between"}`}
      >
        <p
          className={`max-w-full font-bold tabular-nums truncate ${size === "small" ? "text-base sm:text-lg md:text-2xl" : "text-3xl md:text-4xl"}`}
        >
          {Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
          }).format(amount)}
        </p>

        {size === "large" && (
          <div className="w-full sm:w-auto [&>button]:w-full">
            <AddTransactionButton />
          </div>
        )}
      </CardContent>
      {hint && (
        <p className="-mt-2 px-4 pb-4 text-xs text-muted-foreground md:-mt-3 md:px-6 md:pb-5">{hint}</p>
      )}
    </Card>
  );
};

export default SummaryCard;
