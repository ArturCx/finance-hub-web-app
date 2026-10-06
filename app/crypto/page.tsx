import { auth } from "@clerk/nextjs/server";
import { BitcoinIcon, HistoryIcon, PieChartIcon, WalletIcon } from "lucide-react";
import { redirect } from "next/navigation";
import Navbar from "../_components/navbar";
import PageHeader from "../_components/pageHeader";
import AddTradeButton from "./_components/addTradeButton";
import AllocationChart, { AllocationSlice } from "./_components/allocationChart";
import CryptoTabs, { parseCryptoTab } from "./_components/cryptoTabs";
import FavoritesStrip from "./_components/favoritesStrip";
import HoldingsList from "./_components/holdingsList";
import MarketMovers from "./_components/marketMovers";
import MarketPagination from "./_components/marketPagination";
import MarketSearch from "./_components/marketSearch";
import MarketTable from "./_components/marketTable";
import PortfolioSummary from "./_components/portfolioSummary";
import Simulator from "./_components/simulator";
import TradesHistory from "./_components/tradesHistory";
import { getCoinOptions } from "./_data/getCoinOptions";
import { getMarket } from "./_data/getMarket";
import { getPortfolio } from "./_data/getPortfolio";

interface CryptoPageProps {
  searchParams: { tab?: string; q?: string; page?: string };
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
    className={`rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5 shadow-xl shadow-black/20 backdrop-blur-xl ${className ?? ""}`}
  >
    <h2 className="mb-4 flex items-center gap-2 font-bold [&_svg]:h-4 [&_svg]:w-4 [&_svg]:text-primary">
      {icon}
      {title}
    </h2>
    {children}
  </section>
);

const MAX_SLICES = 6;

const CryptoPage = async ({ searchParams }: CryptoPageProps) => {
  const { userId } = await auth();
  if (!userId) {
    redirect("/login");
  }
  const tab = parseCryptoTab(searchParams.tab);
  const query = (searchParams.q ?? "").trim().slice(0, 50);
  const page = Math.max(parseInt(searchParams.page ?? "1", 10) || 1, 1);

  const [coins, portfolio, market] = await Promise.all([
    getCoinOptions(),
    getPortfolio(userId),
    tab === "mercado" ? getMarket(userId, query, page) : null,
  ]);

  const slices: AllocationSlice[] = portfolio.summary.holdings
    .slice(0, MAX_SLICES - 1)
    .map((holding) => ({
      name: portfolio.coins[holding.coinId]?.name ?? holding.coinId,
      value: holding.currentValue,
    }));
  const others = portfolio.summary.holdings
    .slice(MAX_SLICES - 1)
    .reduce((sum, holding) => sum + holding.currentValue, 0);
  if (others > 0) slices.push({ name: "Outras", value: others });

  return (
    <>
      <Navbar />
      <div className="flex min-h-0 flex-1 flex-col space-y-4 overflow-y-auto p-4 md:space-y-6 md:p-6">
        <PageHeader
          title="Cripto"
          description="Sua carteira, o mercado e simulações com dados reais."
          icon={<BitcoinIcon />}
        >
          <AddTradeButton coins={coins} holdings={portfolio.holdingsQuantity} />
        </PageHeader>

        <div className="animate-fade-in">
          <CryptoTabs active={tab} />
        </div>

        {tab === "carteira" &&
          (portfolio.trades.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/[0.015] px-6 py-16 text-center animate-fade-in-up">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-primary/30 bg-primary/15 text-primary shadow-lg shadow-primary/20">
                <WalletIcon className="h-6 w-6" />
              </div>
              <h2 className="text-lg font-bold">Sua carteira está vazia</h2>
              <p className="mb-6 mt-1 max-w-sm text-sm text-muted-foreground">
                Registre suas compras de cripto para acompanhar o valor atual, o
                preço médio e o lucro ou prejuízo de cada moeda.
              </p>
              <AddTradeButton
                coins={coins}
                holdings={portfolio.holdingsQuantity}
                label="Registrar primeira compra"
              />
            </div>
          ) : (
            <>
              <PortfolioSummary summary={portfolio.summary} />
              <div className="grid grid-cols-1 gap-4 md:gap-6 lg:grid-cols-[1fr,360px]">
                <Panel title="Posições" icon={<WalletIcon />} className="animate-fade-in-up animation-delay-200">
                  {portfolio.summary.holdings.length > 0 ? (
                    <HoldingsList holdings={portfolio.summary.holdings} coins={portfolio.coins} />
                  ) : (
                    <p className="py-6 text-center text-sm text-muted-foreground">
                      Todas as posições foram vendidas.
                    </p>
                  )}
                </Panel>
                <div className="space-y-4 md:space-y-6">
                  {slices.length > 0 && (
                    <Panel title="Alocação" icon={<PieChartIcon />} className="animate-fade-in-up animation-delay-300">
                      <AllocationChart slices={slices} />
                    </Panel>
                  )}
                  <Panel title="Operações" icon={<HistoryIcon />} className="animate-fade-in-up animation-delay-400">
                    <TradesHistory trades={portfolio.trades.slice(0, 20)} />
                  </Panel>
                </div>
              </div>
            </>
          ))}

        {tab === "mercado" && market && (
          <>
            {market.favorites.length > 0 && !query && page === 1 && (
              <div className="space-y-3 animate-fade-in-up">
                <h2 className="text-sm font-semibold text-muted-foreground">Favoritas</h2>
                <FavoritesStrip coins={market.favorites} />
              </div>
            )}
            {!query && page === 1 && (
              <div className="animate-fade-in-up animation-delay-100">
                <MarketMovers gainers={market.gainers} losers={market.losers} />
              </div>
            )}
            <div className="space-y-3 animate-fade-in-up animation-delay-200">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="font-bold">Todas as moedas</h2>
                <MarketSearch />
              </div>
              <MarketTable rows={market.rows} />
              <MarketPagination page={page} totalPages={market.totalPages} query={query} />
            </div>
          </>
        )}

        {tab === "simulador" && (
          <div className="animate-fade-in-up">
            <Simulator coins={coins} />
          </div>
        )}
      </div>
    </>
  );
};

export default CryptoPage;
