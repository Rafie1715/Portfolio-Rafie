import Icon from './Icon';
import { useCallback, useMemo, useState } from 'react';
import { ToastContext } from '../hooks/useToast';

const toastStyles = {
  success: {
    card: 'border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-800/40 dark:bg-emerald-900/20 dark:text-emerald-100',
    icon: 'fas fa-check-circle text-emerald-500',
  },
  error: {
    card: 'border-red-200 bg-red-50 text-red-900 dark:border-red-800/40 dark:bg-red-900/20 dark:text-red-100',
    icon: 'fas fa-circle-exclamation text-red-500',
  },
  info: {
    card: 'border-blue-200 bg-blue-50 text-blue-900 dark:border-blue-800/40 dark:bg-blue-900/20 dark:text-blue-100',
    icon: 'fas fa-circle-info text-blue-500',
  },
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback(({ type = 'info', title, message, duration = 3500 }) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const nextToast = { id, type, title, message };

    setToasts((current) => [...current, nextToast]);

    window.setTimeout(() => {
      removeToast(id);
    }, duration);
  }, [removeToast]);

  const value = useMemo(() => ({ showToast, removeToast }), [removeToast, showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed inset-x-4 top-4 z-[120] flex flex-col gap-3 sm:left-auto sm:right-5 sm:top-5 sm:w-96">
        {toasts.map((toast) => {
          const style = toastStyles[toast.type] || toastStyles.info;

          return (
            <div
              key={toast.id}
              className={`rounded-2xl border p-4 shadow-lg backdrop-blur-sm ${style.card}`}
              role="status"
              aria-live="polite"
            >
              <div className="flex items-start gap-3">
                <Icon className={`${style.icon} mt-0.5 text-lg`}></Icon>
                <div className="min-w-0 flex-1 [overflow-wrap:anywhere]">
                  {toast.title && <p className="font-semibold leading-tight">{toast.title}</p>}
                  {toast.message && <p className="mt-1 text-sm leading-relaxed opacity-90">{toast.message}</p>}
                </div>
                <button
                  type="button"
                  onClick={() => removeToast(toast.id)}
                  className="flex size-11 shrink-0 items-center justify-center rounded-full text-current/70 transition hover:bg-black/5 hover:text-current dark:hover:bg-white/10"
                  aria-label="Dismiss notification"
                >
                  <Icon className="fas fa-times text-xs"></Icon>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};
