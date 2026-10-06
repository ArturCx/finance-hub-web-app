"use client";

import FormDialogHeader from "@/app/_components/formDialogHeader";
import { MoneyInput } from "@/app/_components/moneyInput";
import { Button } from "@/app/_components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
} from "@/app/_components/ui/dialog";
import { formatCurrency } from "@/app/_utils/currency";
import { Loader2Icon, RefreshCwIcon } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { toast } from "sonner";
import { updateInvoiceAmount } from "../_actions/updateInvoiceAmount";
import { CreditCardView } from "../_types";

interface UpdateInvoiceAmountDialogProps {
  card: CreditCardView;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const UpdateInvoiceAmountDialog = ({
  card,
  isOpen,
  setIsOpen,
}: UpdateInvoiceAmountDialogProps) => {
  const [amount, setAmount] = useState<number | undefined>(card.currentAmount);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setAmount(card.currentAmount);
    }
  }, [isOpen, card.currentAmount]);

  const difference = (amount ?? 0) - card.currentAmount;

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      await updateInvoiceAmount({ creditCardId: card.id, amount: amount ?? 0 });
      toast.success("Fatura atualizada!");
      setIsOpen(false);
    } catch (error) {
      console.error(error);
      toast.error("Não foi possível atualizar a fatura.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <FormDialogHeader
          icon={<RefreshCwIcon />}
          title={`Atualizar fatura · ${card.name}`}
          description="Informe o valor atual que aparece no app do seu banco."
        />
        <form onSubmit={handleSubmit} className="relative space-y-4">
          <MoneyInput
            autoFocus
            aria-label="Valor da fatura em aberto"
            placeholder="R$ 0,00"
            className="h-16 text-center text-3xl font-bold tabular-nums md:text-3xl"
            value={amount}
            onValueChange={({ floatValue }) => setAmount(floatValue)}
          />
          <div className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3 text-sm">
            <span className="text-muted-foreground">
              Antes: {formatCurrency(card.currentAmount)}
            </span>
            <span
              className={`font-semibold tabular-nums ${
                difference > 0
                  ? "text-danger"
                  : difference < 0
                    ? "text-sucess"
                    : "text-muted-foreground"
              }`}
            >
              {difference > 0 ? "+" : difference < 0 ? "−" : ""}
              {formatCurrency(Math.abs(difference))}
            </span>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancelar
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2Icon className="animate-spin" />}
              Salvar valor
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateInvoiceAmountDialog;
