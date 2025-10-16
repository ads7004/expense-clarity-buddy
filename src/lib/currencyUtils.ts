import { Currency } from "@/types/expense";

export const currencySymbols: Record<Currency, string> = {
  USD: '$',
  INR: '₹',
  EUR: '€',
  GBP: '£'
};

export const currencyNames: Record<Currency, string> = {
  USD: 'US Dollar',
  INR: 'Indian Rupee',
  EUR: 'Euro',
  GBP: 'British Pound'
};

export function formatCurrency(amount: number, currency: Currency): string {
  return `${currencySymbols[currency]}${amount.toFixed(2)}`;
}
