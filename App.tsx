
import React, { useState, useEffect } from 'react';
import { useAuth } from './hooks/useAuth';
import { useWorkData } from './hooks/useWorkData';
import { StatCard } from './components/StatCard';
import { EntryForm } from './components/EntryForm';
import { SettingsModal } from './components/SettingsModal';
import { WorkChart } from './components/WorkChart';
import { Login } from './components/Login';
import { formatCurrency, formatDate } from './utils';
import {
  Plus,
  Settings,
  ChevronLeft,
  ChevronRight,
  Briefcase,
  Clock,
  DollarSign,
  TrendingUp,
  Trash2,
  Edit2,
  LogOut,
  Moon,
  Sun,
  Loader2,
  Eye,
  EyeOff
} from 'lucide-react';
import { DailyEntry } from './types';

const App: React.FC = () => {
  const { user, loading: authLoading, loginGoogle, loginEmail, registerEmail, logout } = useAuth();
  const {
    entries,
    settings,
    currentDate,
    setCurrentDate,
    stats,
    addOrUpdateEntry,
    deleteEntry,
    updateSettings,
    loading: dataLoading
  } = useWorkData(user?.uid);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<DailyEntry | null>(null);
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark' ||
        (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  const [salaryVisible, setSalaryVisible] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('salaryVisible');
      return saved !== null ? saved === 'true' : true;
    }
    return true;
  });

  // Dark Mode Effect
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  // Prevent background scroll when modals are open
  useEffect(() => {
    if (isFormOpen || isSettingsOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isFormOpen, isSettingsOpen]);

  // Onboarding Effect
  useEffect(() => {
    if (user && !dataLoading) {
      // Check if this is the first time the user is logging in
      const hasSeenOnboarding = localStorage.getItem(`onboarding_${user.uid}`);

      if (!settings.onboarded && !hasSeenOnboarding) {
        setIsSettingsOpen(true);
        // Mark that user has seen the onboarding modal
        localStorage.setItem(`onboarding_${user.uid}`, 'true');
      }
    }
  }, [user, dataLoading, settings.onboarded]);

  const toggleTheme = () => setDarkMode(!darkMode);

  const toggleSalaryVisibility = () => {
    const newValue = !salaryVisible;
    setSalaryVisible(newValue);
    localStorage.setItem('salaryVisible', String(newValue));
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleEdit = (entry: DailyEntry) => {
    setEditingEntry(entry);
    setIsFormOpen(true);
  };

  const handleAddNew = () => {
    setEditingEntry(null);
    setIsFormOpen(true);
  };

  const handleSaveEntry = (entry: DailyEntry) => {
    addOrUpdateEntry(entry);
    setIsFormOpen(false);
    setEditingEntry(null);
  };

  // Auth Loading State (must block)
  if (authLoading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 text-slate-400">
      <Loader2 className="animate-spin mb-4" size={32} />
      <span>Initializing...</span>
    </div>
  );

  if (!user) return (
    <Login
      onGoogleLogin={loginGoogle}
      onEmailLogin={loginEmail}
      onRegister={registerEmail}
    />
  );

  // Filter entries for list view (current month only)
  const currentMonthEntries = entries.filter(e => {
    const d = new Date(e.date);
    return d.getMonth() === currentDate.getMonth() && d.getFullYear() === currentDate.getFullYear();
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const hoursDiff = stats.totalWorkedHours - stats.expectedHoursToDate;

  return (
    <div className="min-h-screen pb-12 bg-slate-50 dark:bg-slate-950 transition-colors duration-200">
      {/* Header */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-20 transition-colors">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-lg shadow-sm">
              <img src="/working-hours.png" alt="SalaryTrack Logo" className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold text-slate-800 dark:text-white tracking-tight hidden sm:block">
              Salary<span className="text-indigo-600 dark:text-indigo-400">Track</span>
            </h1>
          </div>

          <div className="flex items-center gap-2 sm:gap-4 bg-slate-50 dark:bg-slate-800 px-2 sm:px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700">
            <button onClick={handlePrevMonth} className="p-1 hover:bg-white dark:hover:bg-slate-700 hover:shadow-sm rounded-full transition-all text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400">
              <ChevronLeft size={20} />
            </button>
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-200 min-w-[100px] text-center">
              {currentDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
            </span>
            <button onClick={handleNextMonth} className="p-1 hover:bg-white dark:hover:bg-slate-700 hover:shadow-sm rounded-full transition-all text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400">
              <ChevronRight size={20} />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors"
              title="Toggle Theme"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors"
              title="Settings"
            >
              <Settings size={20} />
            </button>
            <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 mx-1"></div>
            <button
              onClick={logout}
              className="p-2 text-rose-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-colors"
              title="Logout"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-slate-900 dark:to-indigo-950/30 border-b border-indigo-100 dark:border-slate-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-white">
            Welcome, <span className="text-indigo-600 dark:text-indigo-400">{user.displayName || user.email?.split('@')[0] || 'User'}</span>!
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Track your work hours and salary efficiently
          </p>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {dataLoading ? (
          // Skeleton Loader
          <div className="animate-pulse space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-32 bg-slate-200 dark:bg-slate-800 rounded-2xl"></div>
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 h-96 bg-slate-200 dark:bg-slate-800 rounded-2xl"></div>
              <div className="h-96 bg-slate-200 dark:bg-slate-800 rounded-2xl"></div>
            </div>
          </div>
        ) : (
          <>
            {/* Statistics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 animate-in slide-in-from-bottom-4 duration-500">
              <StatCard
                title="Earned Salary"
                value={formatCurrency(stats.earnedSalary, settings.currency)}
                subtitle={salaryVisible
                  ? `Rate: ${formatCurrency(stats.hourlyRate, settings.currency)}/hr`
                  : `Rate: ${settings.currency === 'PKR' ? 'Rs.' : settings.currency === 'USD' ? '$' : '€'} •••••/hr`
                }
                icon={<DollarSign size={24} className="text-emerald-500" />}
                colorClass="bg-gradient-to-br from-white to-emerald-50/50 dark:from-slate-800 dark:to-emerald-900/20"
                isHidden={!salaryVisible}
                maskedValue={`${settings.currency === 'PKR' ? 'Rs.' : settings.currency === 'USD' ? '$' : '€'} •••••`}
                toggleButton={
                  <button
                    onClick={toggleSalaryVisibility}
                    className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                    title={salaryVisible ? "Hide salary" : "Show salary"}
                  >
                    {salaryVisible ? <Eye size={16} className="text-slate-400" /> : <EyeOff size={16} className="text-slate-400" />}
                  </button>
                }
              />
              <StatCard
                title="Total Worked"
                value={`${stats.totalWorkedHours.toFixed(1)}h`}
                subtitle={`${stats.completionPercentage.toFixed(1)}% of month`}
                icon={<Clock size={24} className="text-indigo-500" />}
              />
              <StatCard
                title="Expected"
                value={`${stats.expectedHoursToDate.toFixed(1)}h`}
                subtitle="Based on elapsed days"
                icon={<Briefcase size={24} className="text-blue-500" />}
              />
              <StatCard
                title="Balance"
                value={`${hoursDiff > 0 ? '+' : ''}${hoursDiff.toFixed(1)}h`}
                subtitle={hoursDiff >= 0 ? "Ahead of schedule" : "Behind schedule"}
                icon={<TrendingUp size={24} className={hoursDiff >= 0 ? "text-emerald-500" : "text-rose-500"} />}
                colorClass={hoursDiff >= 0
                  ? "bg-emerald-50/30 border-emerald-100 dark:bg-emerald-900/10 dark:border-emerald-900/30"
                  : "bg-rose-50/30 border-rose-100 dark:bg-rose-900/10 dark:border-rose-900/30"}
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Chart Section */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 transition-colors animate-in fade-in duration-500 delay-100">
                  <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-6">Daily Performance</h2>
                  <WorkChart entries={entries} currentDate={currentDate} standardHours={settings.standardHoursPerDay} isDarkMode={darkMode} />
                </div>

                <div className="flex justify-between items-center animate-in fade-in duration-500 delay-150">
                  <h2 className="text-lg font-bold text-slate-800 dark:text-white">History</h2>
                  <button
                    onClick={handleAddNew}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg shadow-md shadow-indigo-200 dark:shadow-none transition-all flex items-center gap-2 text-sm font-medium"
                  >
                    <Plus size={18} />
                    Add Entry
                  </button>
                </div>

                <div className="space-y-3 animate-in slide-in-from-bottom-4 duration-500 delay-200">
                  {currentMonthEntries.length === 0 ? (
                    <div className="text-center py-12 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-600">
                      <p>No entries for this month yet.</p>
                      <button onClick={handleAddNew} className="text-indigo-600 dark:text-indigo-400 font-medium mt-2 hover:underline">Log today's work</button>
                    </div>
                  ) : (
                    currentMonthEntries.map(entry => (
                      <div key={entry.id} className="bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-md transition-all flex items-center justify-between group">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 flex flex-col items-center justify-center text-indigo-700 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/30">
                            <span className="text-xs font-bold uppercase">{new Date(entry.date).toLocaleDateString('en-US', { month: 'short' })}</span>
                            <span className="text-lg font-bold leading-none">{new Date(entry.date).getDate()}</span>
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold text-slate-700 dark:text-slate-200">{formatDate(entry.date)}</h3>
                              {entry.wfhHours > 0 && (
                                <span className="text-[10px] bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-full font-bold">WFH {entry.wfhHours.toFixed(1)}h</span>
                              )}
                              {entry.calculatedHours === 0 && entry.wfhHours > 0 && (
                                <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded-full font-bold">Remote</span>
                              )}
                            </div>
                            <div className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-3 mt-0.5">
                              {entry.calculatedHours > 0 ? (
                                <>
                                  <span>{entry.signIn} - {entry.signOut}</span>
                                  <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600"></span>
                                  <span>Break: {entry.breakDurationMinutes}m</span>
                                </>
                              ) : (
                                <span>No Office Hours Logged</span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <div className={`text-lg font-bold ${entry.calculatedHours + entry.wfhHours >= settings.standardHoursPerDay ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-700 dark:text-slate-300'}`}>
                              {(entry.calculatedHours + entry.wfhHours).toFixed(1)}h
                            </div>
                            <div className="text-xs text-slate-400 dark:text-slate-500 font-medium">Worked</div>
                          </div>
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => handleEdit(entry)} className="p-2 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg">
                              <Edit2 size={16} />
                            </button>
                            <button onClick={() => deleteEntry(entry.id)} className="p-2 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Right Sidebar / Summary */}
              <div className="space-y-6 animate-in slide-in-from-right-4 duration-500 delay-300">
                <div className="bg-slate-900 dark:bg-slate-800 text-white p-6 rounded-2xl shadow-lg relative overflow-hidden transition-colors">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-slate-300 font-medium">Estimated Payout</h3>
                    <button
                      onClick={toggleSalaryVisibility}
                      className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                      title={salaryVisible ? "Hide salary" : "Show salary"}
                    >
                      {salaryVisible ? <Eye size={18} className="text-slate-300" /> : <EyeOff size={18} className="text-slate-300" />}
                    </button>
                  </div>
                  <div className="text-4xl font-bold tracking-tight mb-4">
                    {salaryVisible
                      ? formatCurrency(stats.earnedSalary, settings.currency)
                      : `${settings.currency === 'PKR' ? 'Rs.' : settings.currency === 'USD' ? '$' : '€'} •••••`
                    }
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between text-sm text-slate-400">
                      <span>Monthly Goal</span>
                      <span className="text-white">
                        {salaryVisible
                          ? formatCurrency(settings.monthlySalary, settings.currency)
                          : `${settings.currency === 'PKR' ? 'Rs.' : settings.currency === 'USD' ? '$' : '€'} •••••`
                        }
                      </span>
                    </div>
                    <div className="w-full bg-slate-800 dark:bg-slate-950 rounded-full h-2">
                      <div
                        className="bg-emerald-500 h-2 rounded-full transition-all duration-1000"
                        style={{ width: `${stats.completionPercentage}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-slate-500">
                      <span>0%</span>
                      <span>{stats.completionPercentage.toFixed(0)}% Completed</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 transition-colors">
                  <h3 className="font-bold text-slate-800 dark:text-white mb-4">Month Details</h3>
                  <ul className="space-y-3 text-sm">
                    <li className="flex justify-between py-2 border-b border-slate-50 dark:border-slate-800">
                      <span className="text-slate-500 dark:text-slate-400">Working Days</span>
                      <span className="font-medium text-slate-800 dark:text-slate-200">{stats.totalWorkingDaysInMonth} days</span>
                    </li>
                    <li className="flex justify-between py-2 border-b border-slate-50 dark:border-slate-800">
                      <span className="text-slate-500 dark:text-slate-400">Total Hours Req.</span>
                      <span className="font-medium text-slate-800 dark:text-slate-200">{stats.totalWorkingDaysInMonth * settings.standardHoursPerDay} hrs</span>
                    </li>
                    <li className="flex justify-between py-2 border-b border-slate-50 dark:border-slate-800">
                      <span className="text-slate-500 dark:text-slate-400">Hourly Rate</span>
                      <span className="font-medium text-slate-800 dark:text-slate-200">
                        {salaryVisible
                          ? formatCurrency(stats.hourlyRate, settings.currency)
                          : `${settings.currency === 'PKR' ? 'Rs.' : settings.currency === 'USD' ? '$' : '€'} •••••`
                        }
                      </span>
                    </li>
                    <li className="flex justify-between py-2 pt-3">
                      <span className="text-slate-500 dark:text-slate-400">WFH Hours Logged</span>
                      <span className="font-medium text-blue-600 dark:text-blue-400">{entries.filter(e => new Date(e.date).getMonth() === currentDate.getMonth()).reduce((acc, curr) => acc + (curr.wfhHours || 0), 0).toFixed(1)} hrs</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </>
        )}
      </main>

      {isFormOpen && (
        <EntryForm
          onSave={handleSaveEntry}
          onCancel={() => setIsFormOpen(false)}
          initialData={editingEntry}
          selectedDate={new Date()}
        />
      )}

      {isSettingsOpen && (
        <SettingsModal
          settings={settings}
          onSave={updateSettings}
          onClose={() => setIsSettingsOpen(false)}
          isOnboarding={!settings.onboarded}
        />
      )}
    </div>
  );
};

export default App;
