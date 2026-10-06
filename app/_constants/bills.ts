import { BillCategory, BillPaymentMethod, BillStatus } from "@prisma/client";

export const BILL_PAYMENT_METHOD_ICONS = {
  [BillPaymentMethod.CREDIT_CARD]: "credit-card.svg",
  [BillPaymentMethod.DEBIT_CARD]: "debit-card.svg",
  [BillPaymentMethod.BANK_TRANSFER]: "bank-transfer.svg",
  [BillPaymentMethod.BANK_SLIP]: "bank-slip.svg",
  [BillPaymentMethod.CASH]: "money.svg",
  [BillPaymentMethod.PIX]: "pix.svg",
  [BillPaymentMethod.OTHER]: "other.svg",
};

export const BILL_CATEGORY_LABELS: Record<BillCategory, string> = {
  DEBT: "Empréstimos e financiamentos",
  DINING: "Restaurantes e delivery",
  EDUCATION: "Educação",
  ENTERTAINMENT: "Entretenimento",
  FITNESS: "Academia e esportes",
  FOOD: "Alimentação",
  FREELANCE: "Freelance / renda extra",
  GIFTS: "Presentes e doações",
  GROCERIES: "Mercado",
  HEALTH: "Saúde",
  HOUSING: "Moradia",
  INSURANCE: "Seguros",
  INVESTMENT_INCOME: "Rendimentos",
  KIDS: "Filhos",
  OTHER: "Outros",
  PERSONAL_CARE: "Cuidados pessoais",
  PETS: "Pets",
  REFUND: "Reembolsos",
  SALARY: "Salário",
  SALES: "Vendas",
  SHOPPING: "Compras",
  SUBSCRIPTIONS: "Assinaturas",
  TAXES: "Impostos e taxas",
  TELECOM: "Internet e telefone",
  TRANSPORTATION: "Transporte",
  TRAVEL: "Viagens",
  UTILITY: "Utilidades",
};

export const BILL_PAYMENT_METHOD_LABELS = {
  BANK_TRANSFER: "Transferência Bancária",
  BANK_SLIP: "Boleto Bancário",
  CASH: "Dinheiro",
  CREDIT_CARD: "Cartão de Crédito",
  DEBIT_CARD: "Cartão de Débito",
  OTHER: "Outros",
  PIX: "Pix",
};

export const BILL_STATUS_OPTIONS = [
  {
    value: BillStatus.PAID,
    label: "Paga",
  },
  {
    value: BillStatus.PAYABLE,
    label: "Aberta",
  },
  {
    value: BillStatus.EXPIRED,
    label: "Vencida",
  },
];

export const BILL_PAYMENT_METHOD_OPTIONS = [
  {
    value: BillPaymentMethod.BANK_TRANSFER,
    label: BILL_PAYMENT_METHOD_LABELS[BillPaymentMethod.BANK_TRANSFER],
  },
  {
    value: BillPaymentMethod.BANK_SLIP,
    label: BILL_PAYMENT_METHOD_LABELS[BillPaymentMethod.BANK_SLIP],
  },
  {
    value: BillPaymentMethod.CASH,
    label: BILL_PAYMENT_METHOD_LABELS[BillPaymentMethod.CASH],
  },
  {
    value: BillPaymentMethod.CREDIT_CARD,
    label: BILL_PAYMENT_METHOD_LABELS[BillPaymentMethod.CREDIT_CARD],
  },
  {
    value: BillPaymentMethod.DEBIT_CARD,
    label: BILL_PAYMENT_METHOD_LABELS[BillPaymentMethod.DEBIT_CARD],
  },
  {
    value: BillPaymentMethod.OTHER,
    label: BILL_PAYMENT_METHOD_LABELS[BillPaymentMethod.OTHER],
  },
  {
    value: BillPaymentMethod.PIX,
    label: BILL_PAYMENT_METHOD_LABELS[BillPaymentMethod.PIX],
  },
];

export const BILL_CATEGORY_OPTIONS = (
  Object.keys(BILL_CATEGORY_LABELS) as BillCategory[]
)
  .map((value) => ({ value, label: BILL_CATEGORY_LABELS[value] }))
  .sort((a, b) =>
    a.value === BillCategory.OTHER
      ? 1
      : b.value === BillCategory.OTHER
        ? -1
        : a.label.localeCompare(b.label, "pt-BR"),
  );
