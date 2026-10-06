import { TrendingDownIcon, TrendingUpIcon } from "lucide-react";
import Link from "next/link";
import { formatCryptoPrice } from "../_lib/format";
import CoinAvatar from "./coinAvatar";
import CryptoVariationBadge from "./cryptoVariationBadge";

export interface MoverCoin {
  id: string;
  name: string;
  image: string;
  price: number;
  change24h: number;
}

const MoversCard = ({
  title,
  icon,
  coins,
}: {
  title: string;
  icon: React.ReactNode;
  coins: MoverCoin[];
}) => (
  <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5 shadow-xl shadow-black/20 backdrop-blur-xl">
    <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
      {icon}
      {title}
    </div>
    <ul className="space-y-1">
      {coins.map((coin) => (
        <li key={coin.id}>
          <Link
            href={`/crypto/${coin.id}`}
            className="-mx-2 flex items-center gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-white/[0.04]"
          >
            <CoinAvatar image={coin.image} name={coin.name} className="h-7 w-7" />
            <span className="min-w-0 flex-1 truncate text-sm font-medium">{coin.name}</span>
            <span className="text-sm tabular-nums text-muted-foreground">
              {formatCryptoPrice(coin.price)}
            </span>
            <CryptoVariationBadge variation={coin.change24h} />
          </Link>
        </li>
      ))}
    </ul>
  </div>
);

const MarketMovers = ({ gainers, losers }: { gainers: MoverCoin[]; losers: MoverCoin[] }) => (
  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
    <MoversCard
      title="Maiores altas (24h)"
      icon={<TrendingUpIcon className="h-4 w-4 text-sucess" />}
      coins={gainers}
    />
    <MoversCard
      title="Maiores quedas (24h)"
      icon={<TrendingDownIcon className="h-4 w-4 text-danger" />}
      coins={losers}
    />
  </div>
);

export default MarketMovers;
