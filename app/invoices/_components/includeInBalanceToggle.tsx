"use client";

import { cn } from "@/app/_lib/utils";
import { formatCurrency } from "@/app/_utils/currency";
import { WalletIcon } from "lucide-react";
import { useOptimistic, useTransition } from "react";
import { toast } from "sonner";
import { setIncludeInvoicesInBalance } from "../_actions/setIncludeInvoicesInBalance";

interface IncludeInBalanceToggleProps {
  checked: boolean;
  totalOpen: number;
}

const IncludeInBalanceToggle = ({
  checked,
  totalOpen,
}: IncludeInBalanceToggleProps) => {
  const [isPending, startTransition] = useTransition();
  const [optimisticChecked, setOptimisticChecked] = useOptimistic(checked);

  const handleToggle = () => {
    const next = !optimisticChecked;
    startTransition(async () => {
      setOptimisticChecked(next);
      try {
        await setIncludeInvoicesInBalance({ include: next });
        toast.success(
          next
            ? "Faturas em aberto descontadas do saldo."
            : "Faturas em aberto não são mais descontadas do saldo.",
        );
      } catch (error) {
        console.error(error);
        toast.error("Não foi possível salvar a preferência.");
      }
    });
  };

  return (
    <label
      className={cn(
        "flex cursor-pointer items-center gap-4 rounded-2xl border p-4 shadow-xl shadow-black/20 backdrop-blur-xl transition-colors",
        optimisticChecked
          ? "border-primary/30 bg-primary/[0.06]"
          : "border-white/[0.07] bg-white/[0.025] hover:border-white/15",
      )}
    >
      <div className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/[0.05] text-primary sm:flex">
        <WalletIcon className="h-5 w-5" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold">
          Descontar faturas em aberto do saldo
        </p>
        <p className="text-xs text-muted-foreground">
          {optimisticChecked
            ? `O saldo do mês atual no Dashboard já considera ${formatCurrency(totalOpen)} de faturas.`
            : "Quando marcado, o saldo do mês atual no Dashboard já desconta o total das faturas."}
        </p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={optimisticChecked}
        aria-label="Descontar faturas em aberto do saldo"
        disabled={isPending}
        onClick={handleToggle}
        className={cn(
          "relative h-6 w-11 shrink-0 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 disabled:opacity-70",
          optimisticChecked ? "bg-primary" : "bg-white/15",
        )}
      >
        <span
          className={cn(
            "absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-200",
            optimisticChecked && "translate-x-5",
          )}
        />
      </button>
    </label>
  );
};

export default IncludeInBalanceToggle;
