import Navbar from "../_components/navbar";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import AddBillButton from "../_components/addBillButton";
import { ScrollArea } from "../_components/ui/scroll-area";
import { DataTable } from "../_components/ui/dataTable";
import { billColumns } from "./_columns";
import { db } from "../_lib/prisma";
import {
  getMonthDateRange,
  getResolvedMonthYear,
  isValidMonth,
  isValidYear,
} from "../_utils/monthYearFilter";
import DeleteBillsByMonthButton from "./_components/deleteBillsByMonthButton";

interface BillsPageProps {
  searchParams: {
    month?: string;
    year?: string;
  };
}

const BillsPage = async ({ searchParams: { month, year } }: BillsPageProps) => {
  const { userId } = await auth();
  if (!userId) {
    redirect("/login");
  }

  const monthIsInvalid = !month || !isValidMonth(month);
  const yearIsInvalid = !year || !isValidYear(year);
  const resolved = getResolvedMonthYear(month, year);

  if (monthIsInvalid || yearIsInvalid) {
    redirect(`/bills?month=${resolved.month}&year=${resolved.year}`);
  }

  const { startDate, endDate } = getMonthDateRange(
    resolved.month,
    resolved.year,
  );

  const bills = await db.bills.findMany({
    where: {
      userId,
      expireDate: {
        gte: startDate,
        lt: endDate,
      },
    },
    orderBy: {
      expireDate: "desc",
    },
  });

  return (
    <>
      <Navbar />
      <div className="space-y-4 md:space-y-6 p-4 md:p-6 flex flex-1 min-h-0 flex-col overflow-hidden">
        {/* Título e botão */}
        <div className="flex flex-col sm:flex-row w-full items-start sm:items-center justify-between gap-3 md:gap-4 animate-fade-in">
          <h1 className="text-xl md:text-2xl font-bold">Contas</h1>
          <div className="flex flex-wrap items-center gap-2">
            <AddBillButton />
            <DeleteBillsByMonthButton
              month={resolved.month}
              year={resolved.year}
              totalCount={bills.length}
            />
          </div>
        </div>
        <ScrollArea className="h-full animate-fade-in-up animation-delay-100">
          <DataTable
            columns={billColumns}
            data={JSON.parse(JSON.stringify(bills))}
          />
        </ScrollArea>
      </div>
    </>
  );
};

export default BillsPage;
