import { db } from "../_lib/prisma";
import AddTransactionButton from "../_components/addTransactionButton";
import Navbar from "../_components/navbar";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import {
  getMonthDateRange,
  getResolvedMonthYear,
  isValidMonth,
  isValidYear,
} from "../_utils/monthYearFilter";
import DeleteTransactionsByMonthButton from "./_components/deleteTransactionsByMonthButton";
import PageHeader from "../_components/pageHeader";
import TransactionsView from "./_components/transactionsView";
import { ArrowDownUpIcon } from "lucide-react";

interface TransactionsPageProps {
  searchParams: {
    month?: string;
    year?: string;
  };
}

const TransactionsPage = async ({
  searchParams: { month, year },
}: TransactionsPageProps) => {
  const { userId } = await auth();
  if (!userId) {
    redirect("/login");
  }

  const monthIsInvalid = !month || !isValidMonth(month);
  const yearIsInvalid = !year || !isValidYear(year);
  const resolved = getResolvedMonthYear(month, year);

  if (monthIsInvalid || yearIsInvalid) {
    redirect(`/transactions?month=${resolved.month}&year=${resolved.year}`);
  }

  const { startDate, endDate } = getMonthDateRange(
    resolved.month,
    resolved.year,
  );

  const transactions = await db.transaction.findMany({
    where: {
      userId,
      date: {
        gte: startDate,
        lt: endDate,
      },
    },
    orderBy: {
      date: "desc",
    },
  });
  return (
    <>
      <Navbar />
      <div className="flex min-h-0 flex-1 flex-col space-y-4 overflow-y-auto p-4 md:space-y-6 md:overflow-hidden md:p-6">
        <PageHeader
          title="Transações"
          description="Todas as entradas, saídas e investimentos do mês."
          icon={<ArrowDownUpIcon />}
        >
          <AddTransactionButton />
          <DeleteTransactionsByMonthButton
            month={resolved.month}
            year={resolved.year}
            totalCount={transactions.length}
          />
        </PageHeader>
        <TransactionsView transactions={JSON.parse(JSON.stringify(transactions))} />
      </div>
    </>
  );
};

export default TransactionsPage;
