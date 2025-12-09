import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 4000);
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border animate-in slide-in-from-right-full duration-300 max-w-sm w-full ${
              toast.type === 'success' 
                ? 'bg-white dark:bg-slate-900 border-emerald-100 dark:border-emerald-900/30 text-emerald-800 dark:text-emerald-400' 
                : toast.type === 'error'
                ? 'bg-white dark:bg-slate-900 border-rose-100 dark:border-rose-900/30 text-rose-800 dark:text-rose-400'
                : 'bg-white dark:bg-slate-900 border-blue-100 dark:border-blue-900/30 text-blue-800 dark:text-blue-400'
            }`}
          >
            <div className={`p-1 rounded-full ${
              toast.type === 'success' ? 'bg-emerald-100 dark:bg-emerald-900/50' :
              toast.type === 'error' ? 'bg-rose-100 dark:bg-rose-900/50' :
              'bg-blue-100 dark:bg-blue-900/50'
            }`}>
              {toast.type === 'success' && <CheckCircle size={16} />}
              {toast.type === 'error' && <AlertCircle size={16} />}
              {toast.type === 'info' && <Info size={16} />}
            </div>
            <p className="text-sm font-medium flex-1">{toast.message}</p>
            <button 
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};