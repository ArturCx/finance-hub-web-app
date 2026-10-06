import Navbar from "../_components/navbar";
import { ScrollArea } from "../_components/ui/scroll-area";
import { DataTable } from "../_components/ui/dataTable";
import { billColumns } from "./_columns";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import AddBillButton from "../_components/addBillButton";
import { db } from "../_lib/prisma";
import {
  getMonthDateRange,
  getResolvedMonthYear,
  isValidMonth,
  isValidYear,
} from "../_utils/monthYearFilter";
import DeleteBillsByMonthButton from "./_components/deleteBillsByMonthButton";
import PageHeader from "../_components/pageHeader";
import BillsMobileList from "./_components/billsMobileList";
import { ReceiptTextIcon } from "lucide-react";

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
      <div className="flex min-h-0 flex-1 flex-col space-y-4 overflow-y-auto p-4 md:space-y-6 md:overflow-hidden md:p-6">
        <PageHeader
          title="Contas"
          description="Contas a pagar e seus vencimentos no mês."
          icon={<ReceiptTextIcon />}
        >
          <AddBillButton />
          <DeleteBillsByMonthButton
            month={resolved.month}
            year={resolved.year}
            totalCount={bills.length}
          />
        </PageHeader>
        <div className="animate-fade-in-up animation-delay-100 md:hidden">
          <BillsMobileList bills={JSON.parse(JSON.stringify(bills))} />
        </div>
        <ScrollArea className="hidden h-full animate-fade-in-up animation-delay-100 md:block">
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
