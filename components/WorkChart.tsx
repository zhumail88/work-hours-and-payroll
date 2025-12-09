import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Cell
} from 'recharts';
import { DailyEntry } from '../types';

interface WorkChartProps {
  entries: DailyEntry[];
  currentDate: Date;
  standardHours: number;
  isDarkMode?: boolean;
}

export const WorkChart: React.FC<WorkChartProps> = ({ entries, currentDate, standardHours, isDarkMode = false }) => {
  // Sort and filter entries for the chart
  const data = entries
    .filter(e => {
      const d = new Date(e.date);
      return d.getMonth() === currentDate.getMonth() && d.getFullYear() === currentDate.getFullYear();
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map(e => ({
      date: new Date(e.date).getDate(), // Just the day number
      fullDate: e.date,
      hours: e.calculatedHours + e.wfhHours,
    }));

  if (data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-slate-400 dark:text-slate-600 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
        No data for this month
      </div>
    );
  }

  const axisColor = isDarkMode ? '#64748b' : '#64748b';
  const gridColor = isDarkMode ? '#334155' : '#e2e8f0';
  const tooltipBg = isDarkMode ? '#1e293b' : '#ffffff';
  const tooltipText = isDarkMode ? '#f1f5f9' : '#1e293b';

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 20,
            right: 10,
            left: -20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
          <XAxis 
            dataKey="date" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: axisColor, fontSize: 12 }} 
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: axisColor, fontSize: 12 }} 
          />
          <Tooltip 
            cursor={{ fill: isDarkMode ? '#334155' : '#f1f5f9' }}
            contentStyle={{ 
              borderRadius: '12px', 
              border: 'none', 
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
              backgroundColor: tooltipBg,
              color: tooltipText
            }}
            itemStyle={{ color: tooltipText }}
            labelStyle={{ color: isDarkMode ? '#94a3b8' : '#64748b' }}
          />
          <ReferenceLine y={standardHours} stroke="#f59e0b" strokeDasharray="3 3" label={{ position: 'top', value: 'Goal', fill: '#f59e0b', fontSize: 10 }} />
          <Bar dataKey="hours" radius={[6, 6, 0, 0]} barSize={32}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.hours >= standardHours ? '#6366f1' : '#f43f5e'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};