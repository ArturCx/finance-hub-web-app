"use client";

import { useEffect, useOptimistic, useState, useTransition } from "react";
import { PencilIcon, TargetIcon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/app/_components/ui/button";
import { Progress } from "@/app/_components/ui/progress";
import { SetInvestmentGoalDialog } from "@/app/_components/setInvestmentGoalDialog";
import { setInvestmentGoal } from "@/app/_actions/setInvestmentGoal";
import { formatCurrency } from "@/app/_utils/currency";

const LEGACY_STORAGE_KEY = "investmentGoal";

interface InvestmentGoalProgressProps {
  investmentsTotal: number;
  investmentGoal: number | null;
}

export default function InvestmentGoalProgress({
  investmentsTotal,
  investmentGoal,
}: InvestmentGoalProgressProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [, startTransition] = useTransition();
  const [goal, setOptimisticGoal] = useOptimistic(investmentGoal);

  useEffect(() => {
    let legacyGoal: number | null = null;
    try {
      const saved = localStorage.getItem(LEGACY_STORAGE_KEY);
      legacyGoal = saved ? parseFloat(saved) : null;
    } catch {
      return;
    }
    if (!legacyGoal || Number.isNaN(legacyGoal) || legacyGoal <= 0) {
      return;
    }
    if (investmentGoal !== null) {
      localStorage.removeItem(LEGACY_STORAGE_KEY);
      return;
    }
    setInvestmentGoal({ goal: legacyGoal })
      .then(() => localStorage.removeItem(LEGACY_STORAGE_KEY))
      .catch((error) => console.error(error));
  }, [investmentGoal]);

  const handleSave = (newGoal: number | null) =>
    new Promise<void>((resolve, reject) => {
      startTransition(async () => {
        setOptimisticGoal(newGoal);
        try {
          await setInvestmentGoal({ goal: newGoal });
          toast.success(newGoal ? "Meta salva!" : "Meta removida.");
          resolve();
        } catch (error) {
          console.error(error);
          toast.error("Não foi possível salvar a meta.");
          reject(error);
        }
      });
    });

  const progress = goal ? Math.min((investmentsTotal / goal) * 100, 100) : 0;

  return (
    <div className="flex flex-col items-start gap-3 rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4 shadow-xl shadow-black/20 backdrop-blur-xl sm:flex-row sm:items-center sm:gap-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <TargetIcon className="h-5 w-5" />
      </div>

      {goal ? (
        <div className="w-full flex-1 space-y-2">
          <div className="flex flex-wrap items-baseline justify-between gap-x-3 text-xs md:text-sm">
            <p className="font-semibold">Meta de investimento</p>
            <p className="tabular-nums text-muted-foreground">
              <span className="font-semibold text-foreground">
                {formatCurrency(investmentsTotal)}
              </span>{" "}
              de {formatCurrency(goal)} · {progress.toFixed(0)}%
            </p>
          </div>
          <Progress value={progress} className="h-2 w-full" />
        </div>
      ) : (
        <p className="flex-1 text-xs text-muted-foreground md:text-sm">
          Defina uma meta de investimento para acompanhar o progresso do mês.
        </p>
      )}

      <Button
        size="sm"
        variant={goal ? "outline" : "default"}
        className="w-full rounded-full sm:w-auto"
        onClick={() => setDialogOpen(true)}
      >
        {goal && <PencilIcon />}
        {goal ? "Editar meta" : "Definir meta"}
      </Button>

      <SetInvestmentGoalDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        currentGoal={goal}
        onSave={handleSave}
      />
    </div>
  );
}
