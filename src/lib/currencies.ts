export const SUPPORTED_CURRENCIES = [
  { code: 'USD', symbol: '$',  name: 'US Dollar' },
  { code: 'EUR', symbol: '€',  name: 'Euro' },
  { code: 'GBP', symbol: '£',  name: 'British Pound' },
  { code: 'JPY', symbol: '¥',  name: 'Japanese Yen' },
  { code: 'CAD', symbol: 'CA$', name: 'Canadian Dollar' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
  { code: 'INR', symbol: '₹',  name: 'Indian Rupee' },
  { code: 'PKR', symbol: '₨',  name: 'Pakistani Rupee' },
];

/**
 * Exchange rates relative to PKR (1 PKR = X foreign currency).
 * Expenses are always stored in PKR. When the user selects a different
 * display currency these rates are used to convert the totals.
 *
 * Update these periodically or swap for a live-rate API call if needed.
 */
export const PKR_RATES: Record<string, number> = {
  PKR: 1,
  USD: 0.0036,   // 1 PKR ≈ 0.0036 USD
  EUR: 0.0033,
  GBP: 0.0028,
  JPY: 0.54,
  CAD: 0.0049,
  AUD: 0.0055,
  INR: 0.30,
};

/**
 * Convert an amount stored in PKR to the target display currency.
 */
export function convertFromPKR(amountInPKR: number, targetCurrency: string): number {
  const rate = PKR_RATES[targetCurrency] ?? 1;
  return amountInPKR * rate;
}

/**
 * Convert an amount from a display currency back to PKR for storage.
 */
export function convertToPKR(amount: number, fromCurrency: string): number {
  const rate = PKR_RATES[fromCurrency] ?? 1;
  if (rate === 0) return amount;
  return amount / rate;
}

/**
 * Formats a numeric value as a currency string.
 */
export function formatCurrency(amount: number | string, currencyCode: string = 'USD') {
  const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode,
    }).format(numericAmount);
  } catch (error) {
    // Fallback if currency code is invalid
    return `${currencyCode} ${numericAmount.toFixed(2)}`;
  }
}
