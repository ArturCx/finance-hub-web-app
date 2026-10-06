import {
  BILL_CATEGORY_LABELS,
  BILL_PAYMENT_METHOD_LABELS,
} from "@/app/_constants/bills";
import { formatCurrency } from "@/app/_utils/currency";
import { Bills } from "@prisma/client";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarClockIcon } from "lucide-react";
import DeleteBillButton from "./deleteBillButton";
import EditBillButton from "./editBillButton";
import BillStatusBadge from "./typeBadge";

interface BillsMobileListProps {
  bills: Bills[];
  emptyMessage?: string;
}

const BillsMobileList = ({
  bills,
  emptyMessage = "Nenhuma conta neste mês.",
}: BillsMobileListProps) => {
  if (bills.length === 0) {
    return (
      <p className="rounded-2xl border border-white/[0.07] bg-white/[0.02] py-12 text-center text-sm text-muted-foreground">
        {emptyMessage}
      </p>
    );
  }

  return (
    <ul className="space-y-3">
      {bills.map((bill) => (
        <li
          key={bill.id}
          className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4 backdrop-blur-xl"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate font-semibold">{bill.name}</p>
              <p className="truncate text-xs text-muted-foreground">
                {BILL_CATEGORY_LABELS[bill.category]} ·{" "}
                {BILL_PAYMENT_METHOD_LABELS[bill.paymentMethod]}
              </p>
            </div>
            <p className="shrink-0 font-bold tabular-nums">
              {formatCurrency(Number(bill.amount))}
            </p>
          </div>
          <div className="mt-3 flex items-center justify-between gap-2">
            <div className="flex min-w-0 flex-wrap items-center gap-2">
              <BillStatusBadge bill={bill} />
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <CalendarClockIcon className="h-3.5 w-3.5" />
                {format(new Date(bill.expireDate), "dd 'de' MMM", { locale: ptBR })}
              </span>
            </div>
            <div className="-mr-2 flex shrink-0">
              <EditBillButton bill={bill} />
              <DeleteBillButton billId={bill.id} />
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default BillsMobileList;
