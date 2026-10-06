import Link from "next/link";
import { formatCompactBRL, formatCryptoPrice } from "../_lib/format";
import CoinAvatar from "./coinAvatar";
import CryptoVariationBadge from "./cryptoVariationBadge";
import FavoriteButton from "./favoriteButton";
import Sparkline from "./sparkline";

export interface MarketRow {
  id: string;
  rank: number;
  name: string;
  image: string;
  price: number;
  change24h: number;
  marketCap: number;
  volume: number;
  sparkline: number[];
  isFavorite: boolean;
}

const MarketTable = ({ rows }: { rows: MarketRow[] }) => (
  <div className="overflow-x-auto rounded-2xl border border-white/[0.07] bg-white/[0.02] shadow-xl shadow-black/20 backdrop-blur-xl">
    <table className="w-full min-w-[760px] text-sm">
      <thead>
        <tr className="text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          <th className="w-10 px-3 py-3" />
          <th className="px-2 py-3 font-semibold">#</th>
          <th className="px-3 py-3 font-semibold">Moeda</th>
          <th className="px-3 py-3 text-right font-semibold">Preço</th>
          <th className="px-3 py-3 text-right font-semibold">24h</th>
          <th className="px-3 py-3 text-right font-semibold">Market cap</th>
          <th className="px-3 py-3 text-right font-semibold">Volume 24h</th>
          <th className="px-3 py-3 text-right font-semibold">7 dias</th>
        </tr>
      </thead>
      <tbody>
        {rows.length === 0 && (
          <tr>
            <td colSpan={8} className="h-32 text-center text-muted-foreground">
              Nenhuma moeda encontrada.
            </td>
          </tr>
        )}
        {rows.map((row) => (
          <tr
            key={row.id}
            className="group border-t border-white/[0.05] transition-colors hover:bg-white/[0.03]"
          >
            <td className="px-3 py-2">
              <FavoriteButton coinId={row.id} coinName={row.name} isFavorite={row.isFavorite} />
            </td>
            <td className="px-2 py-2 tabular-nums text-muted-foreground">{row.rank}</td>
            <td className="px-3 py-2">
              <Link href={`/crypto/${row.id}`} className="flex items-center gap-3">
                <CoinAvatar image={row.image} name={row.name} />
                <span className="font-semibold group-hover:text-primary">{row.name}</span>
              </Link>
            </td>
            <td className="px-3 py-2 text-right font-semibold tabular-nums">
              {formatCryptoPrice(row.price)}
            </td>
            <td className="px-3 py-2 text-right">
              <CryptoVariationBadge variation={row.change24h} />
            </td>
            <td className="px-3 py-2 text-right tabular-nums text-muted-foreground">
              {formatCompactBRL(row.marketCap)}
            </td>
            <td className="px-3 py-2 text-right tabular-nums text-muted-foreground">
              {formatCompactBRL(row.volume)}
            </td>
            <td className="px-3 py-2">
              <div className="flex justify-end">
                <Sparkline values={row.sparkline} />
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default MarketTable;
