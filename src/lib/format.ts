import { CREDIT_SCALE } from "@/lib/constants";

export function formatCredits(amountInt: number) {
  return `${(amountInt / CREDIT_SCALE).toFixed(2)} credits`;
}

export function formatCurrencyTHB(cents: number) {
  const value = cents / 100;
  return new Intl.NumberFormat("th-TH", {
    style: "currency",
    currency: "THB",
    minimumFractionDigits: 2,
  }).format(value);
}
