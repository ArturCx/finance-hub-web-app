import Link from "next/link";
import { formatCryptoPrice } from "../_lib/format";
import CoinAvatar from "./coinAvatar";
import CryptoVariationBadge from "./cryptoVariationBadge";
import FavoriteButton from "./favoriteButton";
import Sparkline from "./sparkline";
import { MarketRow } from "./marketTable";

const FavoritesStrip = ({ coins }: { coins: MarketRow[] }) => (
  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
    {coins.map((coin) => (
      <Link
        key={coin.id}
        href={`/crypto/${coin.id}`}
        className="group relative rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4 shadow-xl shadow-black/20 backdrop-blur-xl transition-colors hover:border-amber-400/30"
      >
        <div className="flex items-center gap-3">
          <CoinAvatar image={coin.image} name={coin.name} />
          <span className="min-w-0 flex-1 truncate font-semibold group-hover:text-primary">
            {coin.name}
          </span>
          <FavoriteButton coinId={coin.id} coinName={coin.name} isFavorite className="-mr-1" />
        </div>
        <div className="mt-3 flex items-end justify-between gap-2">
          <div>
            <p className="font-bold tabular-nums">{formatCryptoPrice(coin.price)}</p>
            <CryptoVariationBadge variation={coin.change24h} className="mt-1" />
          </div>
          <Sparkline values={coin.sparkline} className="h-10 w-28" />
        </div>
      </Link>
    ))}
  </div>
);

export default FavoritesStrip;
