
import { useState, useEffect, useMemo } from 'react';
import { DailyEntry, AppSettings, MonthStats } from '../types';
import { getMonthKey, getWorkingDaysInMonth, getWorkingDaysUpToDate } from '../utils';
import { db } from '../lib/firebase';
import { 
  collection, 
  doc, 
  setDoc, 
  deleteDoc, 
  onSnapshot, 
  query, 
  orderBy 
} from 'firebase/firestore';
import { useToast } from '../components/Toast';

const DEFAULT_SETTINGS: AppSettings = {
  monthlySalary: 85000,
  standardHoursPerDay: 8,
  currency: 'PKR',
  onboarded: false,
};

export const useWorkData = (userId: string | undefined) => {
  const [entries, setEntries] = useState<DailyEntry[]>([]);
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  // Sync Data from Firestore
  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    // We don't set loading=true here to avoid flashing loading screens on re-renders
    // The initial true state covers the first load.

    // Entries Listener
    const entriesRef = collection(db, 'users', userId, 'entries');
    const q = query(entriesRef, orderBy('date', 'desc'));
    
    const unsubEntries = onSnapshot(q, (snapshot) => {
      const fetchedEntries = snapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      })) as DailyEntry[];
      setEntries(fetchedEntries);
      // We only consider "loading" done when we have at least the entries listener active
      setLoading(false);
    }, (error) => {
      console.error("Error fetching entries:", error);
      showToast("Failed to load entries", 'error');
      setLoading(false);
    });

    // Settings Listener
    const settingsRef = doc(db, 'users', userId, 'settings', 'config');
    const unsubSettings = onSnapshot(settingsRef, (docSnap) => {
      if (docSnap.exists()) {
        setSettings(docSnap.data() as AppSettings);
      }
      // Note: We don't block loading on settings, as defaults work fine
    });

    return () => {
      unsubEntries();
      unsubSettings();
    };
  }, [userId]);

  // Actions
  const addOrUpdateEntry = async (entry: DailyEntry) => {
    if (!userId) return;
    try {
      const entryRef = doc(db, 'users', userId, 'entries', entry.id);
      await setDoc(entryRef, entry);
      showToast('Entry saved successfully', 'success');
    } catch (error) {
      console.error("Error saving entry:", error);
      showToast('Failed to save entry', 'error');
    }
  };

  const deleteEntry = async (id: string) => {
    if (!userId) return;
    try {
      await deleteDoc(doc(db, 'users', userId, 'entries', id));
      showToast('Entry deleted', 'success');
    } catch (error) {
      console.error("Error deleting entry:", error);
      showToast('Failed to delete entry', 'error');
    }
  };

  const updateSettings = async (newSettings: AppSettings) => {
    if (!userId) return;
    try {
      // Always mark as onboarded when saving
      const settingsToSave = { ...newSettings, onboarded: true };
      await setDoc(doc(db, 'users', userId, 'settings', 'config'), settingsToSave);
      showToast('Settings updated', 'success');
    } catch (error) {
      console.error("Error updating settings:", error);
      showToast('Failed to update settings', 'error');
    }
  };

  // Calculations for current month
  const stats: MonthStats = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    // Filter entries for selected month
    const monthEntries = entries.filter(e => {
      const d = new Date(e.date);
      return d.getFullYear() === year && d.getMonth() === month;
    });

    // 1. Total Worked Hours
    const totalWorkedHours = monthEntries.reduce((acc, curr) => acc + (curr.calculatedHours || 0) + (curr.wfhHours || 0), 0);

    // 2. Expected Working Hours
    const now = new Date();
    const isCurrentMonth = now.getFullYear() === year && now.getMonth() === month;
    
    let workingDaysSoFar = 0;
    if (isCurrentMonth) {
        workingDaysSoFar = getWorkingDaysUpToDate(now.toISOString());
    } else if (now < new Date(year, month, 1)) {
        workingDaysSoFar = 0;
    } else {
        workingDaysSoFar = getWorkingDaysInMonth(year, month);
    }
    
    const expectedHoursToDate = workingDaysSoFar * settings.standardHoursPerDay;

    // 3. Salary Calculation
    const totalWorkingDaysInMonth = getWorkingDaysInMonth(year, month);
    const monthlyWorkingHours = totalWorkingDaysInMonth * settings.standardHoursPerDay;
    
    const hourlyRate = monthlyWorkingHours > 0 ? settings.monthlySalary / monthlyWorkingHours : 0;
    
    const earnedSalary = totalWorkedHours * hourlyRate;

    const completionPercentage = monthlyWorkingHours > 0 
      ? Math.min(100, (totalWorkedHours / monthlyWorkingHours) * 100) 
      : 0;

    return {
      totalWorkedHours,
      expectedHoursToDate,
      totalWorkingDaysInMonth,
      hourlyRate,
      earnedSalary,
      completionPercentage
    };
  }, [entries, settings, currentDate]);

  return {
    entries,
    settings,
    currentDate,
    setCurrentDate,
    stats,
    addOrUpdateEntry,
    deleteEntry,
    updateSettings,
    loading
  };
};
