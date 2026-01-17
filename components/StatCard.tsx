import React from 'react';

interface StatCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  colorClass?: string;
  isHidden?: boolean;
  maskedValue?: string;
  toggleButton?: React.ReactNode;
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, subtitle, icon, colorClass, isHidden = false, maskedValue = '•••••', toggleButton }) => {
  const baseClasses = "p-6 rounded-2xl shadow-sm border flex flex-col justify-between transition-all hover:shadow-md dark:shadow-none";
  const defaultColor = "bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800";

  return (
    <div className={`${colorClass || defaultColor} ${baseClasses}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">{title}</h3>
        <div className="flex items-center gap-2">
          {toggleButton}
          <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-300">
            {icon}
          </div>
        </div>
      </div>
      <div>
        <div className="text-3xl font-bold text-slate-800 dark:text-white tracking-tight">
          {isHidden ? maskedValue : value}
        </div>
        {subtitle && <p className="text-sm text-slate-400 dark:text-slate-500 mt-1 font-medium">{subtitle}</p>}
      </div>
    </div>
  );
};