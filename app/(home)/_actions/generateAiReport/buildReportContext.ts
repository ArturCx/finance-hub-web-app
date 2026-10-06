import "server-only";
import { BILL_CATEGORY_LABELS } from "@/app/_constants/bills";
import {
  TRANSACTION_CATEGORY_LABELS,
  TRANSACTION_PAYMENT_METHOD_LABELS,
} from "@/app/_constants/transactions";
import { db } from "@/app/_lib/prisma";
import { formatCurrency } from "@/app/_utils/currency";
import { getMonthDateRange } from "@/app/_utils/monthYearFilter";
import { getUserSettings } from "@/app/_data/getUserSettings";
import { BillStatus, TransactionCategory, TransactionType } from "@prisma/client";
import { format, subMonths } from "date-fns";
import { ptBR } from "date-fns/locale";

const MAX_GROUPS = 15;
const MAX_TOP_EXPENSES = 10;

const money = (value: number) => formatCurrency(value);
const percent = (value: number) => `${value.toFixed(1).replace(".", ",")}%`;
const normalizeName = (name: string) => name.trim().toLowerCase().replace(/\s+/g, " ");

const variation = (current: number, previous: number) => {
  if (previous === 0) return current > 0 ? "novo no mês" : "—";
  const delta = ((current - previous) / previous) * 100;
  return `${delta >= 0 ? "+" : ""}${percent(delta)} vs mês anterior (${money(previous)})`;
};

export const buildReportContext = async (userId: string, month: string, year: string) => {
  const { startDate, endDate } = getMonthDateRange(month, year);
  const previousStart = subMonths(startDate, 1);

  const [transactions, previousTransactions, bills, previousPaidBills, cards, settings] =
    await Promise.all([
    db.transaction.findMany({
      where: { userId, date: { gte: startDate, lt: endDate } },
      orderBy: { date: "asc" },
    }),
    db.transaction.findMany({
      where: { userId, date: { gte: previousStart, lt: startDate } },
      select: { type: true, category: true, amount: true },
    }),
    db.bills.findMany({
      where: { userId, expireDate: { gte: startDate, lt: endDate } },
    }),
    db.bills.findMany({
      where: {
        userId,
        status: BillStatus.PAID,
        expireDate: { gte: previousStart, lt: startDate },
      },
      select: { category: true, amount: true },
    }),
    db.creditCard.findMany({
      where: { userId },
      select: { name: true, currentAmount: true, limit: true },
    }),
    getUserSettings(userId),
  ]);

  if (transactions.length === 0 && bills.length === 0) {
    return null;
  }

  const sumBy = (
    items: { type: TransactionType; amount: unknown }[],
    type: TransactionType,
  ) => items.filter((t) => t.type === type).reduce((sum, t) => sum + Number(t.amount), 0);

  const expenses = transactions.filter((t) => t.type === TransactionType.EXPENSE);
  const paidBills = bills.filter((bill) => bill.status === BillStatus.PAID);
  const paidBillsTotal = paidBills.reduce((sum, bill) => sum + Number(bill.amount), 0);

  const income = sumBy(transactions, TransactionType.DEPOSIT);
  const invested = sumBy(transactions, TransactionType.INVESTMENT);
  const spent = sumBy(transactions, TransactionType.EXPENSE) + paidBillsTotal;
  const previousIncome = sumBy(previousTransactions, TransactionType.DEPOSIT);
  const previousSpent =
    sumBy(previousTransactions, TransactionType.EXPENSE) +
    previousPaidBills.reduce((sum, bill) => sum + Number(bill.amount), 0);
  const previousInvested = sumBy(previousTransactions, TransactionType.INVESTMENT);

  const categories = new Map<TransactionCategory, { total: number; count: number }>();
  const addToCategory = (category: TransactionCategory, amount: number) => {
    const current = categories.get(category) ?? { total: 0, count: 0 };
    categories.set(category, { total: current.total + amount, count: current.count + 1 });
  };
  expenses.forEach((t) => addToCategory(t.category, Number(t.amount)));
  paidBills.forEach((bill) =>
    addToCategory(bill.category as unknown as TransactionCategory, Number(bill.amount)),
  );
  const previousByCategory = new Map<TransactionCategory, number>();
  previousTransactions
    .filter((t) => t.type === TransactionType.EXPENSE)
    .forEach((t) =>
      previousByCategory.set(t.category, (previousByCategory.get(t.category) ?? 0) + Number(t.amount)),
    );
  previousPaidBills.forEach((bill) => {
    const category = bill.category as unknown as TransactionCategory;
    previousByCategory.set(category, (previousByCategory.get(category) ?? 0) + Number(bill.amount));
  });

  const categoryLines = Array.from(categories.entries())
    .sort((a, b) => b[1].total - a[1].total)
    .map(
      ([category, { total, count }]) =>
        `- ${TRANSACTION_CATEGORY_LABELS[category]}: ${money(total)} em ${count} lançamento(s), ${percent(
          spent > 0 ? (total / spent) * 100 : 0,
        )} das despesas; ${variation(total, previousByCategory.get(category) ?? 0)}`,
    );

  const groups = new Map<
    string,
    { name: string; total: number; count: number; categories: Set<TransactionCategory> }
  >();
  expenses.forEach((t) => {
    const key = normalizeName(t.name);
    const group = groups.get(key) ?? {
      name: t.name.trim(),
      total: 0,
      count: 0,
      categories: new Set<TransactionCategory>(),
    };
    group.categories.add(t.category);
    group.total += Number(t.amount);
    group.count += 1;
    groups.set(key, group);
  });
  const groupLines = Array.from(groups.values())
    .sort((a, b) => b.total - a.total)
    .slice(0, MAX_GROUPS)
    .map(
      (group) =>
        `- "${group.name}" (${Array.from(group.categories)
          .map((category) => TRANSACTION_CATEGORY_LABELS[category])
          .join(", ")}): ${group.count}× = ${money(
          group.total,
        )}${group.count > 1 ? `, média ${money(group.total / group.count)}` : ""}`,
    );

  const duplicates = new Map<string, { name: string; amount: number; dates: Date[] }>();
  expenses.forEach((t) => {
    const key = `${normalizeName(t.name)}|${Number(t.amount)}`;
    const item = duplicates.get(key) ?? { name: t.name.trim(), amount: Number(t.amount), dates: [] };
    item.dates.push(t.date);
    duplicates.set(key, item);
  });
  const duplicateLines = Array.from(duplicates.values())
    .filter((item) => item.dates.length > 1)
    .map(
      (item) =>
        `- "${item.name}" ${money(item.amount)} lançado ${item.dates.length}× (${item.dates
          .map((date) => format(date, "dd/MM"))
          .join(", ")})`,
    );

  const topExpenseLines = [...expenses]
    .sort((a, b) => Number(b.amount) - Number(a.amount))
    .slice(0, MAX_TOP_EXPENSES)
    .map(
      (t) =>
        `- ${format(t.date, "dd/MM")} "${t.name.trim()}" — ${money(Number(t.amount))} (${
          TRANSACTION_CATEGORY_LABELS[t.category]
        }, ${TRANSACTION_PAYMENT_METHOD_LABELS[t.paymentMethod]})`,
    );

  const paymentTotals = new Map<string, number>();
  expenses.forEach((t) => {
    const label = TRANSACTION_PAYMENT_METHOD_LABELS[t.paymentMethod];
    paymentTotals.set(label, (paymentTotals.get(label) ?? 0) + Number(t.amount));
  });
  const expensesTotal = sumBy(transactions, TransactionType.EXPENSE);
  const paymentLines = Array.from(paymentTotals.entries())
    .sort((a, b) => b[1] - a[1])
    .map(
      ([label, total]) =>
        `- ${label}: ${money(total)} (${percent(expensesTotal > 0 ? (total / expensesTotal) * 100 : 0)})`,
    );

  const openBills = bills.filter((bill) => bill.status !== BillStatus.PAID);
  const billLines = [
    `- Pagas: ${paidBills.length} conta(s), ${money(paidBillsTotal)}`,
    ...openBills.map(
      (bill) =>
        `- ${bill.status === BillStatus.EXPIRED ? "VENCIDA" : "Em aberto"}: "${bill.name}" ${money(
          Number(bill.amount),
        )} (${BILL_CATEGORY_LABELS[bill.category]}), vence ${format(bill.expireDate, "dd/MM")}`,
    ),
  ];

  const cardLines = cards.map(
    (card) =>
      `- ${card.name}: fatura em aberto ${money(Number(card.currentAmount))}${
        card.limit ? ` de ${money(Number(card.limit))} de limite` : ""
      }`,
  );

  const now = new Date();
  const isCurrentMonth = startDate <= now && now < endDate;
  const daysInMonth = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0).getDate();
  const periodNote = isCurrentMonth
    ? `Mês em andamento: dia ${now.getDate()} de ${daysInMonth}. Valores parciais.`
    : "Mês encerrado.";

  const balance = income - spent - invested;
  const savingsRate = income > 0 ? ((income - spent) / income) * 100 : null;

  const sections = [
    `# Período: ${format(startDate, "MMMM 'de' yyyy", { locale: ptBR })}`,
    periodNote,
    "",
    "## Totais do mês",
    `- Receitas: ${money(income)} (${variation(income, previousIncome)})`,
    `- Despesas (inclui contas pagas): ${money(spent)} (${variation(spent, previousSpent)})`,
    `- Investimentos: ${money(invested)} (${variation(invested, previousInvested)})`,
    `- Saldo (receitas − despesas − investimentos): ${money(balance)}`,
    savingsRate !== null
      ? `- Taxa de poupança (receitas − despesas, sobre receitas): ${percent(savingsRate)}`
      : "- Sem receitas registradas no mês.",
    settings.investmentGoal
      ? `- Meta de investimento mensal: ${money(settings.investmentGoal)} (${percent(
          (invested / settings.investmentGoal) * 100,
        )} atingido)`
      : "- Sem meta de investimento definida.",
    "",
    "## Despesas por categoria",
    ...(categoryLines.length ? categoryLines : ["- Nenhuma despesa."]),
    "",
    "## Gastos agrupados por descrição (maiores totais)",
    ...(groupLines.length ? groupLines : ["- Nenhuma despesa."]),
    "",
    "## Maiores despesas individuais",
    ...(topExpenseLines.length ? topExpenseLines : ["- Nenhuma despesa."]),
    "",
    "## Possíveis lançamentos duplicados (mesma descrição e valor)",
    ...(duplicateLines.length ? duplicateLines : ["- Nenhum."]),
    "",
    "## Despesas por forma de pagamento",
    ...(paymentLines.length ? paymentLines : ["- Nenhuma despesa."]),
    "",
    "## Contas do mês",
    ...billLines,
    "",
    "## Cartões de crédito",
    ...(cardLines.length ? cardLines : ["- Nenhum cartão cadastrado."]),
  ];

  return sections.join("\n");
};
