"use client";

import { Loader2Icon, TargetIcon } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import FormDialogHeader from "./formDialogHeader";
import { MoneyInput } from "./moneyInput";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogFooter } from "./ui/dialog";

interface SetInvestmentGoalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentGoal: number | null;
  onSave: (goal: number | null) => Promise<void>;
}

export const SetInvestmentGoalDialog = ({
  open,
  onOpenChange,
  currentGoal,
  onSave,
}: SetInvestmentGoalDialogProps) => {
  const [goal, setGoal] = useState<number | undefined>(currentGoal ?? undefined);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setGoal(currentGoal ?? undefined);
    }
  }, [open, currentGoal]);

  const save = async (value: number | null) => {
    setIsSaving(true);
    try {
      await onSave(value);
      onOpenChange(false);
    } catch {
    } finally {
      setIsSaving(false);
    }
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (goal && goal > 0) {
      save(goal);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <FormDialogHeader
          icon={<TargetIcon />}
          title="Meta de investimento"
          description="Quanto você quer investir por mês? A meta fica salva na sua conta."
        />
        <form onSubmit={handleSubmit} className="relative space-y-4">
          <MoneyInput
            autoFocus
            aria-label="Valor da meta"
            placeholder="R$ 0,00"
            className="h-16 text-center text-3xl font-bold tabular-nums md:text-3xl"
            value={goal ?? ""}
            onValueChange={({ floatValue }) => setGoal(floatValue)}
          />
          <DialogFooter className="sm:justify-between">
            {currentGoal ? (
              <Button
                type="button"
                variant="ghost"
                className="text-muted-foreground hover:text-danger"
                disabled={isSaving}
                onClick={() => save(null)}
              >
                Remover meta
              </Button>
            ) : (
              <span />
            )}
            <Button type="submit" disabled={isSaving || !goal || goal <= 0}>
              {isSaving && <Loader2Icon className="animate-spin" />}
              Salvar meta
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
