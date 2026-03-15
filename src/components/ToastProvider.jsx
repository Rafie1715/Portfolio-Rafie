import { createContext, useContext, useMemo, useState } from 'react';

const ToastContext = createContext(null);

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

  const removeToast = (id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  };

  const showToast = ({ type = 'info', title, message, duration = 3500 }) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const nextToast = { id, type, title, message };

    setToasts((current) => [...current, nextToast]);

    window.setTimeout(() => {
      removeToast(id);
    }, duration);
  };

  const value = useMemo(() => ({ showToast, removeToast }), []);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed top-5 right-5 z-[120] flex w-[min(92vw,24rem)] flex-col gap-3">
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
                <i className={`${style.icon} mt-0.5 text-lg`}></i>
                <div className="min-w-0 flex-1">
                  {toast.title && <p className="font-semibold leading-tight">{toast.title}</p>}
                  {toast.message && <p className="mt-1 text-sm leading-relaxed opacity-90">{toast.message}</p>}
                </div>
                <button
                  type="button"
                  onClick={() => removeToast(toast.id)}
                  className="rounded-full p-1 text-current/70 transition hover:bg-black/5 hover:text-current dark:hover:bg-white/10"
                  aria-label="Dismiss notification"
                >
                  <i className="fas fa-times text-xs"></i>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }

  return context;
};
