import { db } from "../_lib/prisma";
import { DataTable } from "../_components/ui/dataTable";
import { transactionColumns } from "./_columns";
import AddTransactionButton from "../_components/addTransactionButton";
import Navbar from "../_components/navbar";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { ScrollArea } from "@/app/_components/ui/scroll-area";
import {
  getMonthDateRange,
  getResolvedMonthYear,
  isValidMonth,
  isValidYear,
} from "../_utils/monthYearFilter";
import DeleteTransactionsByMonthButton from "./_components/deleteTransactionsByMonthButton";
import PageHeader from "../_components/pageHeader";
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
      <div className="space-y-4 md:space-y-6 p-4 md:p-6 flex flex-1 min-h-0 flex-col overflow-hidden">
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
        <ScrollArea className="h-full animate-fade-in-up animation-delay-100">
          <DataTable
            columns={transactionColumns}
            data={JSON.parse(JSON.stringify(transactions))}
          />
        </ScrollArea>
      </div>
    </>
  );
};

export default TransactionsPage;
