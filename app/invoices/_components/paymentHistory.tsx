import { formatCurrency } from "@/app/_utils/currency";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { HistoryIcon } from "lucide-react";
import { InvoicePaymentView } from "../_types";

interface PaymentHistoryProps {
  payments: InvoicePaymentView[];
}

const PaymentHistory = ({ payments }: PaymentHistoryProps) => {
  return (
    <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5 shadow-xl shadow-black/20 backdrop-blur-xl">
      <div className="mb-4 flex items-center gap-2">
        <HistoryIcon className="h-4 w-4 text-primary" />
        <h2 className="font-bold">Pagamentos recentes</h2>
      </div>
      {payments.length === 0 ? (
        <p className="py-6 text-center text-sm text-muted-foreground">
          Os pagamentos de fatura aparecem aqui.
        </p>
      ) : (
        <ul className="space-y-1">
          {payments.map((payment) => (
            <li
              key={payment.id}
              className="-mx-2 flex items-center justify-between gap-3 rounded-lg px-2 py-2.5 transition-colors hover:bg-white/[0.03]"
            >
              <div className="flex min-w-0 items-center gap-3">
                <span
                  className="h-8 w-1.5 shrink-0 rounded-full"
                  style={{ backgroundColor: payment.cardColor }}
                />
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">
                    {payment.cardName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {format(new Date(payment.paidAt), "dd 'de' MMMM 'de' yyyy", {
                      locale: ptBR,
                    })}
                  </p>
                </div>
              </div>
              <p className="shrink-0 text-sm font-bold tabular-nums text-sucess">
                {formatCurrency(payment.amount)}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PaymentHistory;
