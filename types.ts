export interface DailyEntry {
  id: string;
  date: string; // YYYY-MM-DD
  signIn: string; // HH:mm
  signOut: string; // HH:mm
  breakDurationMinutes: number;
  wfhHours: number;
  calculatedHours: number;
}

export interface AppSettings {
  monthlySalary: number;
  standardHoursPerDay: number;
  currency: string;
  onboarded?: boolean;
}

export interface MonthStats {
  totalWorkedHours: number;
  expectedHoursToDate: number;
  totalWorkingDaysInMonth: number;
  hourlyRate: number;
  earnedSalary: number;
  completionPercentage: number;
}

export enum ViewMode {
  DASHBOARD = 'DASHBOARD',
  HISTORY = 'HISTORY',
  SETTINGS = 'SETTINGS'
}