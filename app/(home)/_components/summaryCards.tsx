import Link from "next/link";
import { formatCurrency } from "@/app/_utils/currency";
import {
  CreditCardIcon,
  PiggyBankIcon,
  TrendingDownIcon,
  TrendingUpIcon,
  WalletIcon,
} from "lucide-react";
import SummaryCard from "./summaryCard";
import dynamic from "next/dynamic";
interface SummaryCards {
  month: string;
  balance: number;
  depositsTotal: number;
  investmentsTotal: number;
  expensesTotal: number;
  openInvoicesTotal: number;
  invoicesIncludedInBalance: boolean;
}

const InvestmentGoalProgress = dynamic(
  () => import("./InvestmentGoalProgress"),
  {
    ssr: false,
  }
);

const SummaryCards = async ({
  balance,
  depositsTotal,
  expensesTotal,
  investmentsTotal,
  openInvoicesTotal,
  invoicesIncludedInBalance,
}: SummaryCards) => {
  return (
    <div className="space-y-4 md:space-y-6">
      <div className="animate-fade-in-up">
        <SummaryCard
          icon={<WalletIcon size={16} />}
          title="Saldo"
          amount={balance}
          size="large"
          hint={
            invoicesIncludedInBalance && openInvoicesTotal > 0
              ? `Já descontado ${formatCurrency(openInvoicesTotal)} de faturas em aberto`
              : undefined
          }
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">
        <div className="h-full animate-fade-in-up animation-delay-100">
          <SummaryCard
            icon={<PiggyBankIcon size={16} />}
            title="Investido"
            amount={investmentsTotal}
          />
        </div>
        <div className="h-full animate-fade-in-up animation-delay-200">
          <SummaryCard
            icon={<TrendingUpIcon size={16} className="text-primary" />}
            title="Receita"
            amount={depositsTotal}
          />
        </div>
        <div className="h-full animate-fade-in-up animation-delay-300">
          <SummaryCard
            icon={<TrendingDownIcon size={16} className="text-red-500" />}
            title="Despesas"
            amount={expensesTotal}
          />
        </div>
        <Link
          href="/invoices"
          className="block h-full animate-fade-in-up animation-delay-400 rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
        >
          <SummaryCard
            icon={<CreditCardIcon size={16} className="text-amber-300" />}
            title="Faturas em aberto"
            amount={openInvoicesTotal}
            hint={
              invoicesIncludedInBalance
                ? "Descontado do saldo"
                : "Não descontado do saldo"
            }
          />
        </Link>
      </div>
      <InvestmentGoalProgress investmentsTotal={investmentsTotal} />
    </div>
  );
};

export default SummaryCards;
