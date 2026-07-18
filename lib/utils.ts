import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatVND(amount: number): string {
  if (amount >= 1000000000) {
    const val = amount / 1000000000;
    const formatted = val.toLocaleString('vi-VN', { maximumFractionDigits: 3 });
    return `${formatted} tỷ`;
  }
  if (amount >= 1000000) {
    const val = amount / 1000000;
    const formatted = val.toLocaleString('vi-VN', { maximumFractionDigits: 1 });
    return `${formatted} tr`;
  }
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
}

export function formatMillions(millions: number): string {
  if (millions >= 1000) {
    const bill = millions / 1000;
    const formatted = bill.toLocaleString('vi-VN', { maximumFractionDigits: 3 });
    return `${formatted} tỷ`;
  }
  return `${millions} triệu`;
}

export function formatFullVND(amount: number): string {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
}

export function getScoreColor(score: number): { text: string; bg: string; border: string } {
  if (score >= 80) {
    return {
      text: 'text-emerald-400',
      bg: 'bg-emerald-500/10 dark:bg-emerald-950/40',
      border: 'border-emerald-500/30',
    };
  }
  if (score >= 65) {
    return {
      text: 'text-amber-400',
      bg: 'bg-amber-500/10 dark:bg-amber-950/40',
      border: 'border-amber-500/30',
    };
  }
  return {
    text: 'text-rose-400',
    bg: 'bg-rose-500/10 dark:bg-rose-950/40',
    border: 'border-rose-500/30',
  };
}

export function getStatusBadge(status: string): string {
  switch (status) {
    case 'Completed':
    case 'Closed / Won':
    case 'active':
      return 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30';
    case 'Confirmed':
    case 'Shipping':
    case 'Pending Sales':
      return 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30';
    case 'Pending':
    case 'Open':
      return 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30';
    case 'Cancelled':
    case 'Refunded':
    case 'Lost':
    case 'inactive':
      return 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30';
    default:
      return 'bg-slate-500/15 text-slate-600 dark:text-slate-400 border-slate-500/30';
  }
}
