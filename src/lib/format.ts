// src/lib/format.ts

const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  AED: 'AED ',
  SAR: 'SAR ',
  QAR: 'QAR ',
  KWD: 'KWD ',
  BHD: 'BHD ',
  OMR: 'OMR ',
  JOD: 'JOD ',
  INR: '₹',
  PKR: 'Rs ',
  NGN: '₦',
  ZAR: 'R ',
  EGP: 'E£',
  KES: 'KSh ',
  GHS: 'GH₵ ',
  JPY: '¥',
  CNY: '¥',
  AUD: 'A$',
  CAD: 'C$',
  BRL: 'R$',
  MXN: 'MX$',
};

/**
 * Currencies where "150k" style is misleading (values are in millions),
 * so we show full numbers with commas instead.
 */
const FULL_NUMBER_CURRENCIES = new Set([
  'INR',
  'PKR',
  'NGN',
  'JPY',
  'KES',
  'EGP',
  'MXN',
  'BRL',
]);

/**
 * Format a salary range compactly.
 *
 * Examples:
 *   formatSalary(150000, 250000, 'AED')  → "AED 150k – 250k"
 *   formatSalary(1800000, 3200000, 'INR') → "₹1,800,000 – 3,200,000"
 *   formatSalary(50000, 80000, 'GBP')    → "£50k – 80k"
 *   formatSalary(null, null, 'USD')      → "Salary not disclosed"
 */
export function formatSalary(
  min: number | null | undefined,
  max: number | null | undefined,
  currency: string = 'USD'
): string {
  // Handle missing data
  if (min === null || min === undefined || max === null || max === undefined) {
    return 'Salary not disclosed';
  }

  // Handle zero/negative values
  if (min <= 0 || max <= 0) {
    return 'Salary not disclosed';
  }

  const code = (currency || 'USD').toUpperCase();
  const symbol = CURRENCY_SYMBOLS[code] ?? `${code} `;

  const fmt = (n: number): string => {
    if (FULL_NUMBER_CURRENCIES.has(code)) {
      return n.toLocaleString('en-US');
    }
    // Compact thousands format: 95000 → "95k"
    return `${Math.round(n / 1000)}k`;
  };

  return `${symbol}${fmt(min)} – ${fmt(max)}`;
}

/**
 * Format a single salary value (useful for job detail pages).
 *
 * Example:
 *   formatSingleSalary(95000, 'USD') → "$95,000"
 */
export function formatSingleSalary(
  amount: number | null | undefined,
  currency: string = 'USD'
): string {
  if (amount === null || amount === undefined || amount <= 0) {
    return 'Not disclosed';
  }

  const code = (currency || 'USD').toUpperCase();

  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: code,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    // Fallback if the currency code is not supported by Intl
    const symbol = CURRENCY_SYMBOLS[code] ?? `${code} `;
    return `${symbol}${amount.toLocaleString('en-US')}`;
  }
}

/**
 * Format a date for display.
 *
 * Example:
 *   formatDate(new Date()) → "Oct 13, 2026"
 */
export function formatDate(date: Date | string | null | undefined): string {
  if (!date) return 'Unknown';
  const d = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(d.getTime())) return 'Unknown';
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(d);
}

/**
 * Relative time: "2 days ago", "3 weeks ago", etc.
 */
export function timeAgo(date: Date | string | null | undefined): string {
  if (!date) return '';
  const d = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(d.getTime())) return '';

  const seconds = Math.floor((Date.now() - d.getTime()) / 1000);

  const intervals: { label: string; seconds: number }[] = [
    { label: 'year', seconds: 31536000 },
    { label: 'month', seconds: 2592000 },
    { label: 'week', seconds: 604800 },
    { label: 'day', seconds: 86400 },
    { label: 'hour', seconds: 3600 },
    { label: 'minute', seconds: 60 },
  ];

  for (const interval of intervals) {
    const count = Math.floor(seconds / interval.seconds);
    if (count >= 1) {
      return `${count} ${interval.label}${count > 1 ? 's' : ''} ago`;
    }
  }

  return 'just now';
}