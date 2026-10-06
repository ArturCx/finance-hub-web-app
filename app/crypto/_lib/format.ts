export const formatCryptoPrice = (value: number) => {
  const abs = Math.abs(value);
  const maximumFractionDigits = abs >= 1 ? 2 : abs >= 0.01 ? 4 : 8;
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: Math.min(2, maximumFractionDigits),
    maximumFractionDigits,
  }).format(value);
};

export const formatCompactBRL = (value: number) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    notation: "compact",
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
  }).format(value);

export const formatQuantity = (value: number) =>
  new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 8 }).format(value);

export const formatPercent = (value: number, withSign = true) =>
  `${withSign && value > 0 ? "+" : ""}${value.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}%`;
