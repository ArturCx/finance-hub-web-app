import {
  TRANSACTION_CATEGORY_LABELS,
  TRANSACTION_PAYMENT_METHOD_LABELS,
} from "@/app/_constants/transactions";
import { cn } from "@/app/_lib/utils";
import { formatCurrency } from "@/app/_utils/currency";
import { Transaction, TransactionType } from "@prisma/client";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { PiggyBankIcon, TrendingDownIcon, TrendingUpIcon } from "lucide-react";
import DeleteTransactionButton from "./deleteTransactionButton";
import EditTransactionButton from "./editTransactionButton";

const TYPE_STYLES = {
  [TransactionType.DEPOSIT]: {
    icon: TrendingUpIcon,
    iconClassName: "bg-primary/15 text-primary",
    amountClassName: "text-primary",
    sign: "+",
  },
  [TransactionType.EXPENSE]: {
    icon: TrendingDownIcon,
    iconClassName: "bg-danger/15 text-danger",
    amountClassName: "text-danger",
    sign: "−",
  },
  [TransactionType.INVESTMENT]: {
    icon: PiggyBankIcon,
    iconClassName: "bg-white/10 text-white",
    amountClassName: "text-foreground",
    sign: "−",
  },
};

interface TransactionsMobileListProps {
  transactions: Transaction[];
  emptyMessage?: string;
}

const TransactionsMobileList = ({
  transactions,
  emptyMessage = "Nenhuma transação neste mês.",
}: TransactionsMobileListProps) => {
  if (transactions.length === 0) {
    return (
      <p className="rounded-2xl border border-white/[0.07] bg-white/[0.02] py-12 text-center text-sm text-muted-foreground">
        {emptyMessage}
      </p>
    );
  }

  const groups = new Map<string, Transaction[]>();
  for (const transaction of transactions) {
    const key = format(new Date(transaction.date), "yyyy-MM-dd");
    groups.set(key, [...(groups.get(key) ?? []), transaction]);
  }

  return (
    <div className="space-y-5">
      {Array.from(groups.entries()).map(([day, items]) => (
        <section key={day} className="space-y-2">
          <h2 className="px-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {format(new Date(`${day}T12:00:00`), "EEEE, dd 'de' MMMM", { locale: ptBR })}
          </h2>
          <ul className="divide-y divide-white/[0.05] overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.025] backdrop-blur-xl">
            {items.map((transaction) => {
              const style = TYPE_STYLES[transaction.type];
              const Icon = style.icon;
              return (
                <li key={transaction.id} className="flex items-center gap-3 py-2.5 pl-3 pr-1">
                  <div
                    className={cn(
                      "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl",
                      style.iconClassName,
                    )}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{transaction.name}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {TRANSACTION_CATEGORY_LABELS[transaction.category]} ·{" "}
                      {TRANSACTION_PAYMENT_METHOD_LABELS[transaction.paymentMethod]}
                    </p>
                  </div>
                  <p
                    className={cn(
                      "shrink-0 text-sm font-bold tabular-nums",
                      style.amountClassName,
                    )}
                  >
                    {style.sign}
                    {formatCurrency(Number(transaction.amount))}
                  </p>
                  <div className="flex shrink-0">
                    <EditTransactionButton transaction={transaction} />
                    <DeleteTransactionButton transactionId={transaction.id} />
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
};

export default TransactionsMobileList;
