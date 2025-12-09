import { DailyEntry } from './types';

export const getMonthKey = (date: Date): string => {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
};

export const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  }).format(date);
};

export const formatCurrency = (amount: number, currency: string = 'PKR'): string => {
  return new Intl.NumberFormat('en-PK', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const calculateHours = (signIn: string, signOut: string, breakMins: number): number => {
  if (!signIn || !signOut) return 0;
  
  const [inH, inM] = signIn.split(':').map(Number);
  const [outH, outM] = signOut.split(':').map(Number);
  
  const start = inH * 60 + inM;
  const end = outH * 60 + outM;
  
  if (end < start) return 0; // Handle overnight logic if needed, currently assumes same day
  
  const diffMinutes = end - start - breakMins;
  return Math.max(0, parseFloat((diffMinutes / 60).toFixed(2)));
};

export const getWorkingDaysInMonth = (year: number, month: number): number => {
  // Month is 0-indexed (0 = Jan, 11 = Dec)
  let count = 0;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  
  for (let day = 1; day <= daysInMonth; day++) {
    const d = new Date(year, month, day);
    const dayOfWeek = d.getDay();
    // 0 = Sun, 6 = Sat. Count Mon(1) to Fri(5)
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      count++;
    }
  }
  return count;
};

export const getWorkingDaysUpToDate = (targetDateStr: string): number => {
  const targetDate = new Date(targetDateStr);
  const year = targetDate.getFullYear();
  const month = targetDate.getMonth();
  const date = targetDate.getDate();
  
  let count = 0;
  for (let day = 1; day <= date; day++) {
    const d = new Date(year, month, day);
    const dayOfWeek = d.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      count++;
    }
  }
  return count;
};

// Generate a unique ID
export const generateId = (): string => Math.random().toString(36).substr(2, 9);
