// Locale-aware currency formatting. Defaults to USD — change `currency` if you want LKR / GBP / etc.

export const formatCurrency = (amount, currency = "USD", locale = "en-US") => {
  if (amount === null || amount === undefined || isNaN(amount)) return "—";
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(amount));
};

// Returns just the number (no symbol) — useful for big stat cards
export const formatCurrencyNumber = (amount, locale = "en-US") => {
  if (amount === null || amount === undefined || isNaN(amount)) return "0.00";
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(amount));
};
