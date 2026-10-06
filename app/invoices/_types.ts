export interface CreditCardView {
  id: string;
  name: string;
  color: string;
  closingDay: number;
  dueDay: number;
  limit: number | null;
  currentAmount: number;
  updatedAt: string;
  dueDate: string;
  closingDate: string;
  daysUntilDue: number;
  isClosed: boolean;
}

export interface InvoicePaymentView {
  id: string;
  amount: number;
  paidAt: string;
  cardName: string;
  cardColor: string;
}
