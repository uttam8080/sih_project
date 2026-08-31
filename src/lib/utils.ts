import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a number into Indian Rupee format
 * e.g., 100000 -> ₹1,00,000
 * e.g., 1000000 -> ₹10,00,000 (10 Lakh)
 */
export function formatINR(amount: number | string | undefined | null, showDecimals: boolean = false): string {
  if (amount === undefined || amount === null || isNaN(Number(amount))) {
    return '₹0';
  }

  const num = Number(amount);
  
  // Format standard Indian comma system
  const formatted = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: showDecimals ? 2 : 0,
    minimumFractionDigits: showDecimals ? 2 : 0,
  }).format(num);

  return formatted;
}

/**
 * Returns a readable Indian denomination abbreviation (e.g. ₹1.40 Lakh, ₹10 Lakh, ₹50 Lakh, ₹5 Crore)
 */
export function formatINRLakhs(amount: number | string | undefined | null): string {
  if (amount === undefined || amount === null || isNaN(Number(amount))) {
    return '₹0';
  }

  const num = Number(amount);

  if (num >= 10000000) {
    const cr = num / 10000000;
    return `₹${cr.toFixed(2).replace(/\.00$/, '')} Cr`;
  }
  if (num >= 100000) {
    const lakh = num / 100000;
    return `₹${lakh.toFixed(2).replace(/\.00$/, '')} Lakh`;
  }
  if (num >= 1000) {
    const k = num / 1000;
    return `₹${k.toFixed(1).replace(/\.0$/, '')} K`;
  }
  return formatINR(num);
}

/**
 * Get color classes according to Feasibility Score (0 - 100)
 */
export function getScoreColor(score: number): {
  bg: string;
  text: string;
  border: string;
  fill: string;
  badge: string;
  label: string;
} {
  if (score >= 80) {
    return {
      bg: 'bg-emerald-50 text-emerald-800',
      text: 'text-emerald-600',
      border: 'border-emerald-200',
      fill: 'text-emerald-500',
      badge: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      label: 'High Feasibility',
    };
  }
  if (score >= 65) {
    return {
      bg: 'bg-teal-50 text-teal-800',
      text: 'text-teal-600',
      border: 'border-teal-200',
      fill: 'text-teal-500',
      badge: 'bg-teal-100 text-teal-800 border-teal-300',
      label: 'Viable / Moderate',
    };
  }
  if (score >= 50) {
    return {
      bg: 'bg-amber-50 text-amber-800',
      text: 'text-amber-600',
      border: 'border-amber-200',
      fill: 'text-amber-500',
      badge: 'bg-amber-100 text-amber-800 border-amber-300',
      label: 'Moderate Risk',
    };
  }
  return {
    bg: 'bg-rose-50 text-rose-800',
    text: 'text-rose-600',
    border: 'border-rose-200',
    fill: 'text-rose-500',
    badge: 'bg-rose-100 text-rose-800 border-rose-300',
    label: 'High Risk / Unviable',
  };
}

export function getScoreBadge(score: number): {
  color: string;
  bg: string;
  label: string;
} {
  const color = getScoreColor(score);
  return {
    color: color.text,
    bg: color.bg,
    label: color.label,
  };
}

export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(date);
  } catch {
    return dateString;
  }
}
