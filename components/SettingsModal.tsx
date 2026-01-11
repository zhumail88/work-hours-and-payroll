import React, { useState } from 'react';
import { AppSettings } from '../types';
import { Settings, Save, X, Sparkles } from 'lucide-react';

interface SettingsModalProps {
  settings: AppSettings;
  onSave: (settings: AppSettings) => void;
  onClose: () => void;
  isOnboarding?: boolean;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ settings, onSave, onClose, isOnboarding = false }) => {
  const [formData, setFormData] = useState<AppSettings>(settings);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-md animate-in fade-in zoom-in duration-200 border border-slate-100 dark:border-slate-800 my-8">
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-white flex items-center gap-2">
            {isOnboarding ? <Sparkles size={20} className="text-indigo-500" /> : <Settings size={20} className="text-slate-500 dark:text-slate-400" />}
            {isOnboarding ? "Welcome! Let's get set up" : "Settings"}
          </h2>
          {!isOnboarding && (
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
              <X size={20} />
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {isOnboarding && (
            <div className="mb-4 p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg text-sm text-indigo-700 dark:text-indigo-300">
              Please enter your work details below so we can accurately track your salary and hours.
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">Monthly Salary</label>
            <input
              type="number"
              required
              value={formData.monthlySalary === 0 ? '' : formData.monthlySalary}
              onChange={(e) => setFormData({ ...formData, monthlySalary: e.target.value === '' ? 0 : Number(e.target.value) })}
              placeholder="0"
              className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-slate-700 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">Standard Hours / Day</label>
            <input
              type="number"
              required
              min="1"
              max="24"
              value={formData.standardHoursPerDay}
              onChange={(e) => setFormData({ ...formData, standardHoursPerDay: Number(e.target.value) })}
              className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-slate-700 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">Currency Symbol</label>
            <input
              type="text"
              required
              value={formData.currency}
              onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
              className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-slate-700 dark:text-white"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full bg-slate-800 dark:bg-slate-700 hover:bg-slate-900 dark:hover:bg-slate-600 text-white font-medium py-2.5 rounded-lg shadow-lg active:transform active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <Save size={18} />
              {isOnboarding ? "Get Started" : "Save Settings"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};