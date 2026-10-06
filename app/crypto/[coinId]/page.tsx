import Navbar from "@/app/_components/navbar";
import { db } from "@/app/_lib/prisma";
import { cn } from "@/app/_lib/utils";
import { formatCurrency } from "@/app/_utils/currency";
import { auth } from "@clerk/nextjs/server";
import { CryptoTradeType } from "@prisma/client";
import { ArrowLeftIcon, CalculatorIcon, LineChartIcon, WalletIcon } from "lucide-react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import AddTradeButton from "../_components/addTradeButton";
import CoinAvatar from "../_components/coinAvatar";
import CryptoVariationBadge from "../_components/cryptoVariationBadge";
import FavoriteButton from "../_components/favoriteButton";
import Simulator from "../_components/simulator";
import TradesHistory from "../_components/tradesHistory";
import { getCoinOptions } from "../_data/getCoinOptions";
import { getPortfolio } from "../_data/getPortfolio";
import {
  formatCompactBRL,
  formatCryptoPrice,
  formatPercent,
  formatQuantity,
} from "../_lib/format";
import { getLivePrices } from "../_lib/livePrices";
import { PricePoint } from "../_lib/simulation";
import PriceChart from "./_components/priceChart";

interface CoinPageProps {
  params: { coinId: string };
}

const Panel = ({
  title,
  icon,
  children,
  className,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) => (
  <section
    className={cn(
      "rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5 shadow-xl shadow-black/20 backdrop-blur-xl",
      className,
    )}
  >
    <h2 className="mb-4 flex items-center gap-2 font-bold [&_svg]:h-4 [&_svg]:w-4 [&_svg]:text-primary">
      {icon}
      {title}
    </h2>
    {children}
  </section>
);

const CoinPage = async ({ params: { coinId } }: CoinPageProps) => {
  const { userId } = await auth();
  if (!userId) {
    redirect("/login");
  }

  const [coin, favorite, coins, portfolio, livePrices] = await Promise.all([
    db.cryptos.findUnique({
      where: { externalId: coinId },
      include: { charts: { select: { prices: true } } },
    }),
    db.cryptoFavorite.findUnique({ where: { userId_coinId: { userId, coinId } } }),
    getCoinOptions(),
    getPortfolio(userId),
    getLivePrices([coinId]),
  ]);
  if (!coin) {
    notFound();
  }

  const live = livePrices[coinId];
  const price = live?.price ?? Number(coin.currentPrice);
  const change24h = live?.change24h ?? Number(coin.priceChangePercentage24h);

  const history = ((coin.charts?.prices as PricePoint[] | undefined) ?? []).slice();
  if (history.length > 0 && Date.now() - history[history.length - 1][0] > 60 * 60 * 1000) {
    history.push([Date.now(), price]);
  }

  const holding = portfolio.summary.holdings.find((item) => item.coinId === coinId);
  const coinTrades = portfolio.trades.filter((trade) => trade.coinId === coinId);

  const stats = [
    { label: "Ranking", value: `#${Number(coin.marketCapRank)}` },
    { label: "Market cap", value: formatCompactBRL(Number(coin.marketCap)) },
    { label: "Volume 24h", value: formatCompactBRL(Number(coin.totalVolume)) },
  ];

  return (
    <>
      <Navbar />
      <div className="flex min-h-0 flex-1 flex-col space-y-4 overflow-y-auto p-4 md:space-y-6 md:p-6">
        <Link
          href="/crypto?tab=mercado"
          className="flex w-fit items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Voltar ao mercado
        </Link>

        <div className="flex flex-col gap-4 animate-fade-in sm:flex-row sm:items-end sm:justify-between">
          <div className="flex items-center gap-4">
            <CoinAvatar image={coin.image} name={coin.name} className="h-14 w-14" />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold tracking-tight md:text-3xl">{coin.name}</h1>
                <FavoriteButton coinId={coinId} coinName={coin.name} isFavorite={Boolean(favorite)} />
              </div>
              <div className="mt-1 flex flex-wrap items-center gap-2">
                <span className="text-2xl font-bold tabular-nums">{formatCryptoPrice(price)}</span>
                <CryptoVariationBadge variation={change24h} />
                <span className="text-xs text-muted-foreground">24h</span>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <AddTradeButton
              coins={coins}
              holdings={portfolio.holdingsQuantity}
              defaultCoinId={coinId}
              defaultType={CryptoTradeType.BUY}
              label="Comprar"
            />
            {holding && (
              <AddTradeButton
                coins={coins}
                holdings={portfolio.holdingsQuantity}
                defaultCoinId={coinId}
                defaultType={CryptoTradeType.SELL}
                label="Vender"
                variant="outline"
                className="rounded-full font-bold"
              />
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:gap-6 lg:grid-cols-[1fr,340px]">
          <Panel title="Preço" icon={<LineChartIcon />} className="animate-fade-in-up">
            <PriceChart prices={history} />
            <div className="mt-5 grid grid-cols-3 gap-2 border-t border-white/[0.06] pt-4 text-sm">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                  <p className="font-semibold tabular-nums">{stat.value}</p>
                </div>
              ))}
            </div>
          </Panel>

          <Panel title="Sua posição" icon={<WalletIcon />} className="animate-fade-in-up animation-delay-100">
            {holding ? (
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-muted-foreground">Valor atual</p>
                  <p className="text-3xl font-bold tabular-nums">
                    {formatCurrency(holding.currentValue)}
                  </p>
                  <p
                    className={cn(
                      "text-sm font-semibold tabular-nums",
                      holding.profit >= 0 ? "text-sucess" : "text-danger",
                    )}
                  >
                    {holding.profit >= 0 ? "+" : "−"}
                    {formatCurrency(Math.abs(holding.profit))} ({formatPercent(holding.profitPercent)})
                  </p>
                </div>
                <dl className="grid grid-cols-2 gap-2 text-sm">
                  {[
                    { label: "Quantidade", value: formatQuantity(holding.quantity) },
                    { label: "Preço médio", value: formatCryptoPrice(holding.averagePrice) },
                    { label: "Custo", value: formatCurrency(holding.costBasis) },
                    {
                      label: "Realizado",
                      value: formatCurrency(holding.realizedProfit),
                    },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 py-2"
                    >
                      <dt className="text-xs text-muted-foreground">{item.label}</dt>
                      <dd className="truncate font-semibold tabular-nums">{item.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            ) : (
              <p className="py-6 text-center text-sm text-muted-foreground">
                Você não tem {coin.name} na carteira.
              </p>
            )}
            {coinTrades.length > 0 && (
              <div className="mt-5 border-t border-white/[0.06] pt-4">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Operações
                </p>
                <TradesHistory trades={coinTrades} />
              </div>
            )}
          </Panel>
        </div>

        <section className="space-y-3 animate-fade-in-up animation-delay-200">
          <h2 className="flex items-center gap-2 font-bold">
            <CalculatorIcon className="h-4 w-4 text-primary" />
            Simulador
          </h2>
          <Simulator fixedCoin={{ id: coinId, name: coin.name, prices: history }} />
        </section>
      </div>
    </>
  );
};

export default CoinPage;
