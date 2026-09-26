import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function ToastContainer() {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      className="fixed top-20 right-4 z-50 flex flex-col gap-2.5 max-w-sm pointer-events-none"
    >
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isWarning = toast.type === 'warning';

        return (
          <div
            key={toast.id}
            role="status"
            className={`pointer-events-auto p-3.5 rounded-2xl shadow-elevated border backdrop-blur-md flex items-start gap-3 transition-all animate-in slide-in-from-top-2 duration-200 ${
              isSuccess
                ? 'bg-emerald-900/95 text-white border-emerald-500/40'
                : isWarning
                ? 'bg-amber-900/95 text-white border-amber-500/40'
                : 'bg-stone-900/95 text-white border-stone-700'
            }`}
          >
            {isSuccess && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />}
            {isWarning && <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />}
            {!isSuccess && !isWarning && <Info className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />}

            <p className="text-xs font-medium leading-relaxed flex-1">
              {toast.message}
            </p>

            <button
              type="button"
              onClick={() => removeToast(toast.id)}
              className="text-white/60 hover:text-white p-0.5"
              aria-label="Dismiss notification"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
