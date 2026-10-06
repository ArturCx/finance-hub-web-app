import { cn } from "@/app/_lib/utils";
import { formatCurrency } from "@/app/_utils/currency";
import Link from "next/link";
import { formatCryptoPrice, formatPercent, formatQuantity } from "../_lib/format";
import { Holding } from "../_lib/portfolio";
import CoinAvatar from "./coinAvatar";
import CryptoVariationBadge from "./cryptoVariationBadge";

interface HoldingsListProps {
  holdings: Holding[];
  coins: Record<string, { name: string; image: string }>;
}

const HoldingsList = ({ holdings, coins }: HoldingsListProps) => (
  <div className="overflow-x-auto">
    <table className="w-full min-w-[640px] text-sm">
      <thead>
        <tr className="text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          <th className="pb-3 font-semibold">Moeda</th>
          <th className="pb-3 text-right font-semibold">Preço atual</th>
          <th className="pb-3 text-right font-semibold">Preço médio</th>
          <th className="pb-3 text-right font-semibold">Posição</th>
          <th className="pb-3 text-right font-semibold">Resultado</th>
        </tr>
      </thead>
      <tbody>
        {holdings.map((holding) => {
          const coin = coins[holding.coinId];
          return (
            <tr
              key={holding.coinId}
              className="group border-t border-white/[0.05] transition-colors hover:bg-white/[0.03]"
            >
              <td className="py-3 pr-3">
                <Link href={`/crypto/${holding.coinId}`} className="flex items-center gap-3">
                  {coin && <CoinAvatar image={coin.image} name={coin.name} />}
                  <span className="min-w-0">
                    <span className="block truncate font-semibold group-hover:text-primary">
                      {coin?.name ?? holding.coinId}
                    </span>
                    <span className="block text-xs text-muted-foreground">
                      {formatQuantity(holding.quantity)}
                    </span>
                  </span>
                </Link>
              </td>
              <td className="py-3 text-right tabular-nums">
                <span className="block">{formatCryptoPrice(holding.currentPrice)}</span>
                <CryptoVariationBadge variation={holding.change24h} className="mt-1" />
              </td>
              <td className="py-3 text-right tabular-nums text-muted-foreground">
                {formatCryptoPrice(holding.averagePrice)}
              </td>
              <td className="py-3 text-right font-semibold tabular-nums">
                {formatCurrency(holding.currentValue)}
              </td>
              <td
                className={cn(
                  "py-3 text-right font-semibold tabular-nums",
                  holding.profit >= 0 ? "text-sucess" : "text-danger",
                )}
              >
                <span className="block">
                  {holding.profit >= 0 ? "+" : "−"}
                  {formatCurrency(Math.abs(holding.profit))}
                </span>
                <span className="block text-xs font-medium opacity-80">
                  {formatPercent(holding.profitPercent)}
                </span>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>
);

export default HoldingsList;
