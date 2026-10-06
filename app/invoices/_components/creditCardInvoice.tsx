"use client";

import { Button } from "@/app/_components/ui/button";
import { Progress } from "@/app/_components/ui/progress";
import { formatCurrency } from "@/app/_utils/currency";
import { cn } from "@/app/_lib/utils";
import { format, formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  BadgeCheckIcon,
  CalendarClockIcon,
  LockIcon,
  PencilIcon,
  RefreshCwIcon,
  UnlockIcon,
} from "lucide-react";
import { useState } from "react";
import { CreditCardView } from "../_types";
import CreditCardVisual from "./creditCardVisual";
import DeleteCreditCardButton from "./deleteCreditCardButton";
import PayInvoiceDialog from "./payInvoiceDialog";
import UpdateInvoiceAmountDialog from "./updateInvoiceAmountDialog";
import UpsertCreditCardDialog from "./upsertCreditCardDialog";

interface CreditCardInvoiceProps {
  card: CreditCardView;
}

const getDueLabel = (daysUntilDue: number) => {
  if (daysUntilDue === 0) return "Vence hoje";
  if (daysUntilDue === 1) return "Vence amanhã";
  return `Vence em ${daysUntilDue} dias`;
};

const CreditCardInvoice = ({ card }: CreditCardInvoiceProps) => {
  const [updateIsOpen, setUpdateIsOpen] = useState(false);
  const [payIsOpen, setPayIsOpen] = useState(false);
  const [editIsOpen, setEditIsOpen] = useState(false);

  const limitUsage =
    card.limit && card.limit > 0
      ? Math.min((card.currentAmount / card.limit) * 100, 100)
      : null;
  const isDueSoon = card.daysUntilDue <= 3 && card.currentAmount > 0;

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5 shadow-xl shadow-black/20 backdrop-blur-xl transition-colors duration-300 hover:border-white/15">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full opacity-20 blur-3xl transition-opacity duration-500 group-hover:opacity-30"
        style={{ backgroundColor: card.color }}
      />

      <div className="relative flex flex-col gap-5 sm:flex-row">
        <CreditCardVisual
          name={card.name}
          color={card.color}
          dueDay={card.dueDay}
          className="mx-auto max-w-[340px] sm:mx-0 sm:w-72 sm:shrink-0 sm:self-start xl:w-80"
        />

        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Fatura em aberto
              </p>
              <p className="mt-1 truncate text-3xl font-bold tabular-nums">
                {formatCurrency(card.currentAmount)}
              </p>
            </div>
            <span
              className={cn(
                "inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold",
                card.isClosed
                  ? "bg-amber-400/15 text-amber-300"
                  : "bg-primary/15 text-primary",
              )}
            >
              {card.isClosed ? (
                <LockIcon className="h-3 w-3" />
              ) : (
                <UnlockIcon className="h-3 w-3" />
              )}
              {card.isClosed ? "Fechada" : "Aberta"}
            </span>
          </div>

          <p className="mt-1 text-xs text-muted-foreground">
            Atualizada{" "}
            {formatDistanceToNow(new Date(card.updatedAt), {
              addSuffix: true,
              locale: ptBR,
            })}
          </p>

          <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
            <div
              className={cn(
                "rounded-xl border px-3 py-2",
                isDueSoon
                  ? "border-danger/30 bg-danger/10"
                  : "border-white/[0.06] bg-white/[0.02]",
              )}
            >
              <p
                className={cn(
                  "flex items-center gap-1.5 text-xs",
                  isDueSoon ? "text-danger" : "text-muted-foreground",
                )}
              >
                <CalendarClockIcon className="h-3.5 w-3.5" />
                {getDueLabel(card.daysUntilDue)}
              </p>
              <p className="mt-0.5 font-semibold">
                {format(new Date(card.dueDate), "dd 'de' MMM", { locale: ptBR })}
              </p>
            </div>
            <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 py-2">
              <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <LockIcon className="h-3.5 w-3.5" />
                {card.isClosed ? "Fechou em" : "Fecha em"}
              </p>
              <p className="mt-0.5 font-semibold">
                {format(new Date(card.closingDate), "dd 'de' MMM", {
                  locale: ptBR,
                })}
              </p>
            </div>
          </div>

          {limitUsage !== null && card.limit && (
            <div className="mt-4 space-y-1.5">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Limite usado {limitUsage.toFixed(0)}%</span>
                <span className="tabular-nums">
                  Disponível{" "}
                  {formatCurrency(Math.max(card.limit - card.currentAmount, 0))}
                </span>
              </div>
              <Progress value={limitUsage} className="h-1.5" />
            </div>
          )}
        </div>
      </div>

      <div className="relative mt-5 flex flex-wrap items-center gap-2 border-t border-white/[0.06] pt-4">
        <Button
          size="sm"
          variant="outline"
          className="rounded-full"
          onClick={() => setUpdateIsOpen(true)}
        >
          <RefreshCwIcon />
          Atualizar valor
        </Button>
        <Button
          size="sm"
          className="rounded-full"
          disabled={card.currentAmount <= 0}
          onClick={() => setPayIsOpen(true)}
        >
          <BadgeCheckIcon />
          Pagar fatura
        </Button>
        <div className="ml-auto flex">
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground"
            aria-label={`Editar ${card.name}`}
            onClick={() => setEditIsOpen(true)}
          >
            <PencilIcon />
          </Button>
          <DeleteCreditCardButton creditCardId={card.id} name={card.name} />
        </div>
      </div>

      <UpdateInvoiceAmountDialog
        card={card}
        isOpen={updateIsOpen}
        setIsOpen={setUpdateIsOpen}
      />
      <PayInvoiceDialog card={card} isOpen={payIsOpen} setIsOpen={setPayIsOpen} />
      <UpsertCreditCardDialog
        isOpen={editIsOpen}
        setIsOpen={setEditIsOpen}
        creditCardId={card.id}
        defaultValues={{
          name: card.name,
          color: card.color,
          closingDay: card.closingDay,
          dueDay: card.dueDay,
          limit: card.limit,
          currentAmount: card.currentAmount,
        }}
      />
    </div>
  );
};

export default CreditCardInvoice;
