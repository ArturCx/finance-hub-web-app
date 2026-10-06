"use client";

import SearchInput from "@/app/_components/searchInput";
import { DataTable } from "@/app/_components/ui/dataTable";
import { ScrollArea } from "@/app/_components/ui/scroll-area";
import {
  TRANSACTION_CATEGORY_LABELS,
  TRANSACTION_PAYMENT_METHOD_LABELS,
  TRANSACTION_TYPE_OPTIONS,
} from "@/app/_constants/transactions";
import { formatCurrency } from "@/app/_utils/currency";
import { matchesSearch } from "@/app/_utils/search";
import { Transaction } from "@prisma/client";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useMemo, useState } from "react";
import { transactionColumns } from "../_columns";
import TransactionsMobileList from "./transactionsMobileList";

const TYPE_LABELS = Object.fromEntries(
  TRANSACTION_TYPE_OPTIONS.map((option) => [option.value, option.label]),
);

const searchFields = (transaction: Transaction) => {
  const amount = Number(transaction.amount);
  const date = new Date(transaction.date);
  return [
    transaction.name,
    TYPE_LABELS[transaction.type],
    TRANSACTION_CATEGORY_LABELS[transaction.category],
    TRANSACTION_PAYMENT_METHOD_LABELS[transaction.paymentMethod],
    formatCurrency(amount),
    amount.toFixed(2),
    format(date, "dd/MM/yyyy"),
    format(date, "d 'de' MMMM", { locale: ptBR }),
  ];
};

const TransactionsView = ({ transactions }: { transactions: Transaction[] }) => {
  const [query, setQuery] = useState("");
  const filtered = useMemo(
    () => transactions.filter((transaction) => matchesSearch(searchFields(transaction), query)),
    [transactions, query],
  );
  const emptyMessage = query
    ? `Nenhuma transação encontrada para “${query.trim()}”.`
    : "Nenhuma transação neste mês.";

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-3 animate-fade-in-up animation-delay-100 md:gap-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <SearchInput
          value={query}
          onChange={setQuery}
          placeholder="Pesquisar por nome, categoria, valor..."
        />
        {transactions.length > 0 && (
          <p className="px-1 text-xs text-muted-foreground">
            {query
              ? `${filtered.length} de ${transactions.length} transações`
              : `${transactions.length} ${transactions.length === 1 ? "transação" : "transações"}`}
          </p>
        )}
      </div>
      <div className="md:hidden">
        <TransactionsMobileList transactions={filtered} emptyMessage={emptyMessage} />
      </div>
      <ScrollArea className="hidden min-h-0 flex-1 md:block">
        <DataTable columns={transactionColumns} data={filtered} emptyMessage={emptyMessage} />
      </ScrollArea>
    </div>
  );
};

export default TransactionsView;
