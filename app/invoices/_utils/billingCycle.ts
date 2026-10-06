import { addMonths, differenceInCalendarDays, startOfDay } from "date-fns";

const dateWithClampedDay = (year: number, month: number, day: number) => {
  const lastDay = new Date(year, month + 1, 0).getDate();
  return new Date(year, month, Math.min(day, lastDay));
};

export interface BillingCycle {
  dueDate: Date;
  closingDate: Date;
  daysUntilDue: number;
  isClosed: boolean;
}

export const getBillingCycle = (
  closingDay: number,
  dueDay: number,
  today: Date = new Date(),
): BillingCycle => {
  const now = startOfDay(today);
  let dueDate = dateWithClampedDay(now.getFullYear(), now.getMonth(), dueDay);
  if (dueDate < now) {
    const next = addMonths(new Date(now.getFullYear(), now.getMonth(), 1), 1);
    dueDate = dateWithClampedDay(next.getFullYear(), next.getMonth(), dueDay);
  }
  const closingMonth =
    closingDay < dueDay ? dueDate : addMonths(new Date(dueDate.getFullYear(), dueDate.getMonth(), 1), -1);
  const closingDate = dateWithClampedDay(
    closingMonth.getFullYear(),
    closingMonth.getMonth(),
    closingDay,
  );
  return {
    dueDate,
    closingDate,
    daysUntilDue: differenceInCalendarDays(dueDate, now),
    isClosed: now >= closingDate,
  };
};
