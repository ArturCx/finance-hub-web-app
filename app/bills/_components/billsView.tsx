"use client";

import SearchInput from "@/app/_components/searchInput";
import { DataTable } from "@/app/_components/ui/dataTable";
import { ScrollArea } from "@/app/_components/ui/scroll-area";
import {
  BILL_CATEGORY_LABELS,
  BILL_PAYMENT_METHOD_LABELS,
} from "@/app/_constants/bills";
import { formatCurrency } from "@/app/_utils/currency";
import { matchesSearch } from "@/app/_utils/search";
import { Bills, BillStatus } from "@prisma/client";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useMemo, useState } from "react";
import { billColumns } from "../_columns";
import BillsMobileList from "./billsMobileList";

const STATUS_SEARCH_TERMS: Record<BillStatus, string> = {
  [BillStatus.PAID]: "paga pago",
  [BillStatus.PAYABLE]: "aberta aberto",
  [BillStatus.EXPIRED]: "vencida vencido",
};

const searchFields = (bill: Bills) => {
  const amount = Number(bill.amount);
  const date = new Date(bill.expireDate);
  return [
    bill.name,
    STATUS_SEARCH_TERMS[bill.status],
    BILL_CATEGORY_LABELS[bill.category],
    BILL_PAYMENT_METHOD_LABELS[bill.paymentMethod],
    formatCurrency(amount),
    amount.toFixed(2),
    format(date, "dd/MM/yyyy"),
    format(date, "d 'de' MMMM", { locale: ptBR }),
  ];
};

const BillsView = ({ bills }: { bills: Bills[] }) => {
  const [query, setQuery] = useState("");
  const filtered = useMemo(
    () => bills.filter((bill) => matchesSearch(searchFields(bill), query)),
    [bills, query],
  );
  const emptyMessage = query
    ? `Nenhuma conta encontrada para “${query.trim()}”.`
    : "Nenhuma conta neste mês.";

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-3 animate-fade-in-up animation-delay-100 md:gap-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <SearchInput
          value={query}
          onChange={setQuery}
          placeholder="Pesquisar por nome, status, valor..."
        />
        {bills.length > 0 && (
          <p className="px-1 text-xs text-muted-foreground">
            {query
              ? `${filtered.length} de ${bills.length} contas`
              : `${bills.length} ${bills.length === 1 ? "conta" : "contas"}`}
          </p>
        )}
      </div>
      <div className="md:hidden">
        <BillsMobileList bills={filtered} emptyMessage={emptyMessage} />
      </div>
      <ScrollArea className="hidden min-h-0 flex-1 md:block">
        <DataTable columns={billColumns} data={filtered} emptyMessage={emptyMessage} />
      </ScrollArea>
    </div>
  );
};

export default BillsView;
