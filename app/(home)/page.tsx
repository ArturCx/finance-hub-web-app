import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Navbar from "../_components/navbar";
import SummaryCards from "./_components/summaryCards";
import TimeSelect from "./_components/timeSelect";
import { isMatch } from "date-fns";
import { getDashboard } from "../_data/getDashboard";
import TransactionsPieChart from "./_components/transactionsPieChart";
import ExpensesPerCategory from "./_components/expensesPerCategory";
import LastTransactions from "./_components/lastTransactions";
import AiReportButton from "./_components/aiReportButton";
import TransactionsLineChart from "./_components/transactionsLineChart";
import {
  getResolvedMonthYear,
  isValidMonth,
  isValidYear,
} from "../_utils/monthYearFilter";

interface HomeProps {
  searchParams: {
    month?: string;
    year?: string;
  };
}

const Home = async ({ searchParams: { month, year } }: HomeProps) => {
  const { userId } = await auth();
  if (!userId) {
    redirect("/login");
  }

  const monthIsInvalid = !month || !isValidMonth(month) || !isMatch(month, "MM");
  const yearIsInvalid = !year || !isValidYear(year);
  const resolved = getResolvedMonthYear(month, year);

  if (monthIsInvalid || yearIsInvalid) {
    redirect(`/?month=${resolved.month}&year=${resolved.year}`);
  }

  const dashboard = await getDashboard(resolved.month, resolved.year);

  return (
    <>
      <Navbar />
      <div className="flex flex-1 min-h-0 flex-col space-y-4 md:space-y-6 overflow-y-auto lg:overflow-hidden p-4 md:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 md:gap-4 animate-fade-in">
          <h1 className="text-xl md:text-2xl font-bold">Dashboard</h1>
          <div className="flex flex-wrap items-center gap-2 md:gap-3">
            <AiReportButton month={resolved.month} year={resolved.year} />
            <TimeSelect />
          </div>
        </div>
        <div className="grid lg:h-full grid-cols-1 lg:grid-cols-[2fr,1fr] gap-4 md:gap-6 lg:overflow-hidden">
          <div className="flex flex-col gap-4 md:gap-6 lg:overflow-hidden">
            <SummaryCards month={resolved.month} {...dashboard} />
            <div className="flex flex-col lg:flex-row w-full lg:h-full gap-4 md:gap-6 lg:overflow-hidden">
              <TransactionsPieChart {...dashboard} />
              <TransactionsLineChart
                weeklyTransactions={dashboard.weeklyTransactions}
              />
            </div>
          </div>
          <div className="flex flex-col gap-4 md:gap-6 lg:overflow-hidden">
            <LastTransactions lastTransactions={dashboard.lastTransactions} />
            <ExpensesPerCategory
              expensesPerCategory={dashboard.totalExpensePerCategory}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
