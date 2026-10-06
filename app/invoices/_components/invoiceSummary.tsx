import { formatCurrency } from "@/app/_utils/currency";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarClockIcon, GaugeIcon, WalletCardsIcon } from "lucide-react";
import { ReactNode } from "react";
import { CreditCardView } from "../_types";

interface InvoiceSummaryProps {
  cards: CreditCardView[];
}

const SummaryTile = ({
  icon,
  label,
  value,
  hint,
  highlight,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  hint?: string;
  highlight?: boolean;
}) => (
  <div
    className={`relative overflow-hidden rounded-2xl border p-5 shadow-xl shadow-black/20 backdrop-blur-xl ${
      highlight
        ? "border-primary/25 bg-gradient-to-br from-primary/20 via-primary/5 to-transparent"
        : "border-white/[0.07] bg-white/[0.025]"
    }`}
  >
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.05] text-primary [&_svg]:size-4">
        {icon}
      </div>
      {label}
    </div>
    <p className="mt-3 truncate text-2xl font-bold tabular-nums md:text-3xl">
      {value}
    </p>
    {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
  </div>
);

const InvoiceSummary = ({ cards }: InvoiceSummaryProps) => {
  const totalOpen = cards.reduce((sum, card) => sum + card.currentAmount, 0);
  const nextDue = cards
    .filter((card) => card.currentAmount > 0)
    .sort((a, b) => a.daysUntilDue - b.daysUntilDue)[0];
  const cardsWithLimit = cards.filter((card) => card.limit);
  const totalLimit = cardsWithLimit.reduce((sum, card) => sum + (card.limit ?? 0), 0);
  const usedLimit = cardsWithLimit.reduce((sum, card) => sum + card.currentAmount, 0);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 md:gap-6">
      <div className="animate-fade-in-up">
        <SummaryTile
          highlight
          icon={<WalletCardsIcon />}
          label="Total em aberto"
          value={formatCurrency(totalOpen)}
          hint={`${cards.length} ${cards.length === 1 ? "cartão" : "cartões"}`}
        />
      </div>
      <div className="animate-fade-in-up animation-delay-100">
        <SummaryTile
          icon={<CalendarClockIcon />}
          label="Próximo vencimento"
          value={
            nextDue
              ? format(new Date(nextDue.dueDate), "dd 'de' MMM", { locale: ptBR })
              : "—"
          }
          hint={
            nextDue
              ? `${nextDue.name} · ${formatCurrency(nextDue.currentAmount)}`
              : "Nenhuma fatura pendente"
          }
        />
      </div>
      <div className="animate-fade-in-up animation-delay-200">
        <SummaryTile
          icon={<GaugeIcon />}
          label="Limite disponível"
          value={totalLimit ? formatCurrency(Math.max(totalLimit - usedLimit, 0)) : "—"}
          hint={
            totalLimit
              ? `${((usedLimit / totalLimit) * 100).toFixed(0)}% de ${formatCurrency(totalLimit)} usado`
              : "Cadastre o limite dos cartões"
          }
        />
      </div>
    </div>
  );
};

export default InvoiceSummary;
