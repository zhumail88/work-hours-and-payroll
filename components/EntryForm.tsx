
import React, { useState, useEffect } from 'react';
import { DailyEntry } from '../types';
import { calculateHours, generateId } from '../utils';
import { Clock, Coffee, Home, Calendar as CalendarIcon, Save, X, MonitorOff } from 'lucide-react';

interface EntryFormProps {
  onSave: (entry: DailyEntry) => void;
  onCancel: () => void;
  initialData?: DailyEntry | null;
  selectedDate?: Date;
}

export const EntryForm: React.FC<EntryFormProps> = ({ onSave, onCancel, initialData, selectedDate }) => {
  const [date, setDate] = useState(selectedDate ? selectedDate.toISOString().split('T')[0] : new Date().toISOString().split('T')[0]);

  // Office Time States
  const [signIn, setSignIn] = useState('09:00');
  const [signOut, setSignOut] = useState('17:00');
  const [breakDuration, setBreakDuration] = useState(60);

  // WFH States
  const [isWfhOnly, setIsWfhOnly] = useState(false);
  const [wfhHoursInput, setWfhHoursInput] = useState(0);
  const [wfhMinutesInput, setWfhMinutesInput] = useState(0);

  useEffect(() => {
    if (initialData) {
      setDate(initialData.date);
      setSignIn(initialData.signIn);
      setSignOut(initialData.signOut);
      setBreakDuration(initialData.breakDurationMinutes);

      // Parse WFH decimal hours back to Hours and Minutes
      const totalWfhMinutes = Math.round(initialData.wfhHours * 60);
      const h = Math.floor(totalWfhMinutes / 60);
      const m = totalWfhMinutes % 60;

      setWfhHoursInput(h);
      setWfhMinutesInput(m);

      // Heuristic: If there are WFH hours but 0 calculated hours, assume it was WFH only
      if (initialData.wfhHours > 0 && initialData.calculatedHours === 0) {
        setIsWfhOnly(true);
      }
    }
  }, [initialData]);

  const getCalculatedValues = () => {
    let officeHours = 0;

    if (!isWfhOnly) {
      officeHours = calculateHours(signIn, signOut, breakDuration);
    }

    const wfhDecimal = wfhHoursInput + (wfhMinutesInput / 60);
    const total = officeHours + wfhDecimal;

    return { officeHours, wfhDecimal, total };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { officeHours, wfhDecimal } = getCalculatedValues();

    const entry: DailyEntry = {
      id: initialData ? initialData.id : generateId(),
      date,
      signIn: isWfhOnly ? '' : signIn,
      signOut: isWfhOnly ? '' : signOut,
      breakDurationMinutes: isWfhOnly ? 0 : breakDuration,
      wfhHours: parseFloat(wfhDecimal.toFixed(2)),
      calculatedHours: officeHours
    };

    onSave(entry);
  };

  const { officeHours, wfhDecimal, total } = getCalculatedValues();

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200 border border-slate-100 dark:border-slate-800 my-8">
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-white">
            {initialData ? 'Edit Entry' : 'New Entry'}
          </h2>
          <button onClick={onCancel} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Date */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">Date</label>
            <div className="relative">
              <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-slate-700 dark:text-white"
              />
            </div>
          </div>

          {/* Mode Toggle */}
          <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
            <div className={`w-5 h-5 rounded border flex items-center justify-center cursor-pointer transition-colors ${isWfhOnly ? 'bg-indigo-600 border-indigo-600' : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600'}`} onClick={() => setIsWfhOnly(!isWfhOnly)}>
              {isWfhOnly && <X size={14} className="text-white transform rotate-0" />}
            </div>
            <label onClick={() => setIsWfhOnly(!isWfhOnly)} className="text-sm font-medium text-slate-700 dark:text-slate-300 cursor-pointer select-none">
              Worked from home (No Office Hours)
            </label>
          </div>

          {/* Office Hours Section */}
          <div className={`space-y-4 transition-all duration-300 ${isWfhOnly ? 'opacity-30 pointer-events-none grayscale' : 'opacity-100'}`}>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">Sign In</label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-green-500" size={18} />
                  <input
                    type="time"
                    value={signIn}
                    onChange={(e) => setSignIn(e.target.value)}
                    disabled={isWfhOnly}
                    className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-slate-700 dark:text-white disabled:bg-slate-100 dark:disabled:bg-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">Sign Out</label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-orange-500" size={18} />
                  <input
                    type="time"
                    value={signOut}
                    onChange={(e) => setSignOut(e.target.value)}
                    disabled={isWfhOnly}
                    className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-slate-700 dark:text-white disabled:bg-slate-100 dark:disabled:bg-slate-900"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">Break Duration (min)</label>
              <div className="relative">
                <Coffee className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="number"
                  min="0"
                  value={breakDuration}
                  onChange={(e) => setBreakDuration(Number(e.target.value))}
                  disabled={isWfhOnly}
                  className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-slate-700 dark:text-white disabled:bg-slate-100 dark:disabled:bg-slate-900"
                />
              </div>
            </div>
          </div>

          <div className="border-t border-slate-100 dark:border-slate-800 my-4"></div>

          {/* WFH Section */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">Work From Home Duration</label>
            <div className="grid grid-cols-2 gap-4">
              <div className="relative">
                <Home className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400" size={18} />
                <input
                  type="number"
                  min="0"
                  value={wfhHoursInput}
                  onChange={(e) => setWfhHoursInput(Math.max(0, parseInt(e.target.value) || 0))}
                  placeholder="0"
                  className="w-full pl-10 pr-12 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-slate-700 dark:text-white"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">hrs</span>
              </div>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  max="59"
                  value={wfhMinutesInput}
                  onChange={(e) => setWfhMinutesInput(Math.max(0, parseInt(e.target.value) || 0))}
                  placeholder="0"
                  className="w-full pl-4 pr-12 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-slate-700 dark:text-white"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">mins</span>
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="bg-indigo-50 dark:bg-indigo-900/30 rounded-lg p-4 flex justify-between items-center text-sm border border-indigo-100 dark:border-indigo-900/50 mt-4">
            <div className="flex flex-col">
              <span className="text-indigo-700 dark:text-indigo-300 font-medium">Total Worked</span>
              <span className="text-xs text-indigo-500 dark:text-indigo-400">
                {isWfhOnly
                  ? 'Remote Only'
                  : `${officeHours.toFixed(2)}h Office + ${wfhDecimal.toFixed(2)}h Remote`
                }
              </span>
            </div>
            <span className="text-indigo-900 dark:text-indigo-200 font-bold text-2xl">{total.toFixed(2)} <span className="text-sm font-medium opacity-70">hrs</span></span>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 dark:hover:bg-indigo-500 text-white font-medium py-3 rounded-xl shadow-lg shadow-indigo-200 dark:shadow-none active:transform active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <Save size={18} />
              Save Entry
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
