import { db } from "@/app/_lib/prisma";
import { BillStatus, TransactionCategory, TransactionType } from "@prisma/client";
import {
  TotalExpensePerCategory,
  TransactionPercentagePerType,
  WeeklyTransactionTotals,
} from "./types";
import { auth } from "@clerk/nextjs/server";
import { getMonthDateRange } from "@/app/_utils/monthYearFilter";
import { getUserSettings } from "../getUserSettings";

export const getDashboard = async (month: string, year: string) => {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }
  const { startDate, endDate } = getMonthDateRange(month, year);

  const where = {
    userId,
    date: {
      gte: startDate,
      lt: endDate,
    },
  };
  const paidBillsWhere = {
    userId,
    status: BillStatus.PAID,
    expireDate: {
      gte: startDate,
      lt: endDate,
    },
  };

  const depositsTotal = Number(
    (
      await db.transaction.aggregate({
        where: { ...where, type: "DEPOSIT" },
        _sum: { amount: true },
      })
    )?._sum?.amount
  );
  const investmentsTotal = Number(
    (
      await db.transaction.aggregate({
        where: { ...where, type: "INVESTMENT" },
        _sum: { amount: true },
      })
    )?._sum?.amount
  );
  const expensesTotal = Number(
    (
      await db.transaction.aggregate({
        where: { ...where, type: "EXPENSE" },
        _sum: { amount: true },
      })
    )?._sum?.amount
  );
  const paidBillsTotal = Number(
    (
      await db.bills.aggregate({
        where: paidBillsWhere,
        _sum: { amount: true },
      })
    )?._sum?.amount
  );

  const [openInvoices, settings] = await Promise.all([
    db.creditCard.aggregate({
      where: { userId },
      _sum: { currentAmount: true },
    }),
    getUserSettings(userId),
  ]);
  const openInvoicesTotal = Number(openInvoices._sum.currentAmount ?? 0);
  const now = new Date();
  const isCurrentMonth = startDate <= now && now < endDate;
  const invoicesIncludedInBalance =
    settings.includeInvoicesInBalance && isCurrentMonth;

  const totalExpenses = expensesTotal + paidBillsTotal;
  const balance =
    depositsTotal -
    investmentsTotal -
    totalExpenses -
    (invoicesIncludedInBalance ? openInvoicesTotal : 0);
  const transactionsTotal = depositsTotal + investmentsTotal + totalExpenses;

  const typesPercentage: TransactionPercentagePerType = {
    [TransactionType.DEPOSIT]: Math.round(
      transactionsTotal > 0 ? (depositsTotal / transactionsTotal) * 100 : 0
    ),
    [TransactionType.EXPENSE]: Math.round(
      transactionsTotal > 0 ? (totalExpenses / transactionsTotal) * 100 : 0
    ),
    [TransactionType.INVESTMENT]: Math.round(
      transactionsTotal > 0 ? (investmentsTotal / transactionsTotal) * 100 : 0
    ),
  };

  const transactionExpensesPerCategory = await db.transaction.groupBy({
    by: ["category"],
    where: {
      ...where,
      type: TransactionType.EXPENSE,
    },
    _sum: {
      amount: true,
    },
  });

  const paidBillsPerCategory = await db.bills.groupBy({
    by: ["category"],
    where: paidBillsWhere,
    _sum: {
      amount: true,
    },
  });

  const expenseCategoryTotals = new Map<TransactionCategory, number>();

  transactionExpensesPerCategory.forEach((item) => {
    const currentTotal = expenseCategoryTotals.get(item.category) ?? 0;
    expenseCategoryTotals.set(item.category, currentTotal + Number(item._sum.amount));
  });

  paidBillsPerCategory.forEach((item) => {
    const category = item.category as unknown as TransactionCategory;
    const currentTotal = expenseCategoryTotals.get(category) ?? 0;
    expenseCategoryTotals.set(category, currentTotal + Number(item._sum.amount));
  });

  const totalExpensePerCategory: TotalExpensePerCategory[] = Array.from(
    expenseCategoryTotals.entries()
  ).map(([category, totalAmount]) => ({
    category,
    totalAmount,
    percentageOfTotal:
      totalExpenses > 0 ? Math.round((totalAmount / totalExpenses) * 100) : 0,
  }));

  const lastTransactions = await db.transaction.findMany({
    where,
    orderBy: { date: "desc" },
    take: 15,
  });

  const monthlyTransactions = await db.transaction.findMany({
    where: {
      ...where,
      type: {
        in: [TransactionType.DEPOSIT, TransactionType.EXPENSE],
      },
    },
    select: {
      date: true,
      amount: true,
      type: true,
    },
  });

  const monthlyPaidBills = await db.bills.findMany({
    where: paidBillsWhere,
    select: {
      expireDate: true,
      amount: true,
    },
  });

  const weeklyTransactions: WeeklyTransactionTotals[] = [
    { week: "Semana 1", deposits: 0, expenses: 0 },
    { week: "Semana 2", deposits: 0, expenses: 0 },
    { week: "Semana 3", deposits: 0, expenses: 0 },
    { week: "Semana 4", deposits: 0, expenses: 0 },
  ];

  monthlyTransactions.forEach((transaction) => {
    const day = new Date(transaction.date).getDate();
    const weekIndex =
      day <= 7 ? 0 : day <= 14 ? 1 : day <= 21 ? 2 : 3;
    const amount = Number(transaction.amount);

    if (transaction.type === TransactionType.DEPOSIT) {
      weeklyTransactions[weekIndex].deposits += amount;
    }

    if (transaction.type === TransactionType.EXPENSE) {
      weeklyTransactions[weekIndex].expenses += amount;
    }
  });

  monthlyPaidBills.forEach((bill) => {
    const day = new Date(bill.expireDate).getDate();
    const weekIndex = day <= 7 ? 0 : day <= 14 ? 1 : day <= 21 ? 2 : 3;
    weeklyTransactions[weekIndex].expenses += Number(bill.amount);
  });

  return {
    balance,
    depositsTotal,
    investmentsTotal,
    expensesTotal: totalExpenses,
    openInvoicesTotal,
    invoicesIncludedInBalance,
    typesPercentage,
    totalExpensePerCategory,
    weeklyTransactions,
    lastTransactions: JSON.parse(JSON.stringify(lastTransactions)),
  };
};
