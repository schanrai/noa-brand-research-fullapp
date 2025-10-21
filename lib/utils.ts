import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Normalizes currency formatting to ensure consistent display
 * Preserves existing currency symbols/codes, adds $ for raw numbers
 */
export function normalizeCurrencyFormat(value: string | number | null | undefined): string {
  // Handle null, undefined, empty string, or NaN
  if (value === null || value === undefined || value === '' || (typeof value === 'number' && isNaN(value))) {
    return "N/A";
  }
  
  // Handle zero as a special case
  if (value === 0) {
    return "$0";
  }
  
  const str = String(value).trim();
  
  // If empty after trimming, return N/A
  if (!str) {
    return "N/A";
  }
  
  // If already formatted with currency symbol or code, return as-is
  if (str.match(/^[€$£¥₹₽₩₪₦₨₫₱₴₸₼₾₿]|USD|EUR|GBP|JPY|INR|RUB|KRW|ILS|NGN|PKR|VND|PHP|UAH|KZT|AZN|GEL|BTC|ETH/i)) {
    return str;
  }
  
  // If it's just a number with suffix (2.5B, 1.2M, etc.), assume USD
  if (str.match(/^\d+(?:\.\d+)?[BMK]?$/)) {
    return `$${str}`;
  }
  
  // Return as-is for any other format
  return str;
}
