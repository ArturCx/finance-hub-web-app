import AddTransactionButton from "@/app/_components/addTransactionButton";
import { Card, CardContent, CardHeader } from "@/app/_components/ui/card";
import { ReactNode } from "react";

interface SummaryCardProps {
  icon: ReactNode;
  title: string;
  amount: number;
  size?: "small" | "large";
}

const SummaryCard = ({
  icon,
  title,
  amount,
  size = "small",
}: SummaryCardProps) => {
  return (
    <Card
      className={
        size === "large"
          ? "relative overflow-hidden border-primary/25 bg-gradient-to-br from-primary/20 via-primary/[0.04] to-transparent"
          : ""
      }
    >
      <CardHeader className="flex-row items-center gap-2 md:gap-3 pb-2 md:pb-4">
        <div className="flex items-center justify-center rounded-lg bg-white/[0.05] p-2 ring-1 ring-white/[0.06]">
          {icon}
        </div>
        <p
          className={`${size === "small" ? "text-muted-foreground text-sm md:text-base" : "text-white opacity-70 text-sm md:text-base"}`}
        >
          {title}
        </p>
      </CardHeader>
      <CardContent className="flex justify-between items-center gap-2">
        <p
          className={`font-bold tabular-nums truncate ${size === "small" ? "text-lg md:text-2xl" : "text-2xl md:text-4xl"}`}
        >
          {Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
          }).format(amount)}
        </p>

        {size === "large" && <AddTransactionButton />}
      </CardContent>
    </Card>
  );
};

export default SummaryCard;
