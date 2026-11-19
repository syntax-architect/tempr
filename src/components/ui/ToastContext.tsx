import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertTriangle, AlertOctagon, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'warning' | 'error' | 'info';

export interface ToastItem {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
}

interface ToastContextValue {
  showToast: (toast: Omit<ToastItem, 'id'>) => void;
  addToast: (message: string, type?: ToastType) => void;
  success: (title: string, message?: string) => void;
  warning: (title: string, message?: string) => void;
  error: (title: string, message?: string) => void;
  info: (title: string, message?: string) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (toast: Omit<ToastItem, 'id'>) => {
      const id = Math.random().toString(36).substring(2, 9);
      setToasts((prev) => [...prev, { ...toast, id }]);

      setTimeout(() => {
        removeToast(id);
      }, 4000);
    },
    [removeToast]
  );

  const addToast = useCallback(
    (message: string, type: ToastType = 'info') => {
      showToast({ type, title: message });
    },
    [showToast]
  );

  const success = useCallback(
    (title: string, message?: string) => {
      showToast({ type: 'success', title, message });
    },
    [showToast]
  );

  const warning = useCallback(
    (title: string, message?: string) => {
      showToast({ type: 'warning', title, message });
    },
    [showToast]
  );

  const error = useCallback(
    (title: string, message?: string) => {
      showToast({ type: 'error', title, message });
    },
    [showToast]
  );

  const info = useCallback(
    (title: string, message?: string) => {
      showToast({ type: 'info', title, message });
    },
    [showToast]
  );

  return (
    <ToastContext.Provider value={{ showToast, addToast, success, warning, error, info }}>
      {children}

      {/* Toast Notification Stack (Bottom-Right, Accessible) */}
      <div
        aria-live="polite"
        className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none"
      >
        {toasts.map((t) => {
          const typeStyles = {
            success: 'bg-slate-900 border-emerald-500/40 text-emerald-400',
            warning: 'bg-slate-900 border-amber-500/40 text-amber-400',
            error: 'bg-slate-900 border-red-500/40 text-red-400',
            info: 'bg-slate-900 border-blue-500/40 text-blue-400',
          }[t.type];

          const Icon = {
            success: CheckCircle2,
            warning: AlertTriangle,
            error: AlertOctagon,
            info: Info,
          }[t.type];

          return (
            <div
              key={t.id}
              role="alert"
              className={`pointer-events-auto p-4 rounded-xl border shadow-2xl backdrop-blur-md flex items-start gap-3 transition-all animate-in fade-in slide-in-from-bottom-2 duration-200 ${typeStyles}`}
            >
              <Icon className="w-5 h-5 shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold text-white font-mono tracking-wide">
                  {t.title}
                </div>
                {t.message && (
                  <div className="text-xs text-slate-300 mt-0.5 leading-snug">{t.message}</div>
                )}
              </div>
              <button
                onClick={() => removeToast(t.id)}
                className="text-slate-400 hover:text-white p-1 rounded transition-colors"
                aria-label="Dismiss notification"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

const noopToastContext: ToastContextValue = {
  showToast: () => {},
  addToast: () => {},
  success: () => {},
  warning: () => {},
  error: () => {},
  info: () => {},
};

export const useToast = () => {
  const context = useContext(ToastContext);
  return context || noopToastContext;
};
