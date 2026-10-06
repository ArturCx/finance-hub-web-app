import { cn } from "@/app/_lib/utils";
import { formatCurrency } from "@/app/_utils/currency";
import { CryptoTradeType } from "@prisma/client";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { formatCryptoPrice, formatQuantity } from "../_lib/format";
import CoinAvatar from "./coinAvatar";
import DeleteTradeButton from "./deleteTradeButton";

export interface TradeView {
  id: string;
  type: CryptoTradeType;
  coinId: string;
  coinName: string;
  coinImage: string;
  quantity: number;
  price: number;
  date: string;
  hasTransaction: boolean;
}

const TradesHistory = ({ trades }: { trades: TradeView[] }) => {
  if (trades.length === 0) {
    return (
      <p className="py-6 text-center text-sm text-muted-foreground">
        Nenhuma operação registrada.
      </p>
    );
  }
  return (
    <ul className="space-y-1">
      {trades.map((trade) => {
        const isBuy = trade.type === CryptoTradeType.BUY;
        return (
          <li
            key={trade.id}
            className="-mx-2 flex items-center gap-3 rounded-lg px-2 py-2.5 transition-colors hover:bg-white/[0.03]"
          >
            <CoinAvatar image={trade.coinImage} name={trade.coinName} className="h-7 w-7" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">
                <span className={isBuy ? "text-sucess" : "text-danger"}>
                  {isBuy ? "Compra" : "Venda"}
                </span>{" "}
                · {trade.coinName}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {formatQuantity(trade.quantity)} × {formatCryptoPrice(trade.price)} ·{" "}
                {format(new Date(trade.date), "dd MMM yyyy", { locale: ptBR })}
              </p>
            </div>
            <p className={cn("shrink-0 text-sm font-bold tabular-nums", isBuy ? "" : "text-sucess")}>
              {isBuy ? "−" : "+"}
              {formatCurrency(trade.quantity * trade.price)}
            </p>
            <DeleteTradeButton tradeId={trade.id} hasTransaction={trade.hasTransaction} />
          </li>
        );
      })}
    </ul>
  );
};

export default TradesHistory;
