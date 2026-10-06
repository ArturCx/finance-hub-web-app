import {
  TransactionCategory,
  TransactionPaymentMethod,
  TransactionType,
} from "@prisma/client";

export const TRANSACTION_PAYMENT_METHOD_ICONS = {
  [TransactionPaymentMethod.CREDIT_CARD]: "credit-card.svg",
  [TransactionPaymentMethod.DEBIT_CARD]: "debit-card.svg",
  [TransactionPaymentMethod.BANK_TRANSFER]: "bank-transfer.svg",
  [TransactionPaymentMethod.BANK_SLIP]: "bank-slip.svg",
  [TransactionPaymentMethod.CASH]: "money.svg",
  [TransactionPaymentMethod.PIX]: "pix.svg",
  [TransactionPaymentMethod.OTHER]: "other.svg",
};

export const TRANSACTION_CATEGORY_LABELS: Record<TransactionCategory, string> = {
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

export const TRANSACTION_PAYMENT_METHOD_LABELS = {
  BANK_TRANSFER: "Transferência Bancária",
  BANK_SLIP: "Boleto Bancário",
  CASH: "Dinheiro",
  CREDIT_CARD: "Cartão de Crédito",
  DEBIT_CARD: "Cartão de Débito",
  OTHER: "Outros",
  PIX: "Pix",
};

export const TRANSACTION_TYPE_OPTIONS = [
  {
    value: TransactionType.EXPENSE,
    label: "Despesa",
  },
  {
    value: TransactionType.DEPOSIT,
    label: "Depósito",
  },
  {
    value: TransactionType.INVESTMENT,
    label: "Investimento",
  },
];

export const TRANSACTION_PAYMENT_METHOD_OPTIONS = [
  {
    value: TransactionPaymentMethod.BANK_TRANSFER,
    label:
      TRANSACTION_PAYMENT_METHOD_LABELS[TransactionPaymentMethod.BANK_TRANSFER],
  },
  {
    value: TransactionPaymentMethod.BANK_SLIP,
    label:
      TRANSACTION_PAYMENT_METHOD_LABELS[TransactionPaymentMethod.BANK_SLIP],
  },
  {
    value: TransactionPaymentMethod.CASH,
    label: TRANSACTION_PAYMENT_METHOD_LABELS[TransactionPaymentMethod.CASH],
  },
  {
    value: TransactionPaymentMethod.CREDIT_CARD,
    label:
      TRANSACTION_PAYMENT_METHOD_LABELS[TransactionPaymentMethod.CREDIT_CARD],
  },
  {
    value: TransactionPaymentMethod.DEBIT_CARD,
    label:
      TRANSACTION_PAYMENT_METHOD_LABELS[TransactionPaymentMethod.DEBIT_CARD],
  },
  {
    value: TransactionPaymentMethod.OTHER,
    label: TRANSACTION_PAYMENT_METHOD_LABELS[TransactionPaymentMethod.OTHER],
  },
  {
    value: TransactionPaymentMethod.PIX,
    label: TRANSACTION_PAYMENT_METHOD_LABELS[TransactionPaymentMethod.PIX],
  },
];

export const TRANSACTION_CATEGORY_OPTIONS = (
  Object.keys(TRANSACTION_CATEGORY_LABELS) as TransactionCategory[]
)
  .map((value) => ({ value, label: TRANSACTION_CATEGORY_LABELS[value] }))
  .sort((a, b) =>
    a.value === TransactionCategory.OTHER
      ? 1
      : b.value === TransactionCategory.OTHER
        ? -1
        : a.label.localeCompare(b.label, "pt-BR"),
  );
