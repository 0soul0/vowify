'use client';

import React, { useEffect } from 'react';
import { CheckCircle2, Info, AlertCircle, X } from 'lucide-react';
import { ToastMessage } from '../types';

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export function ToastContainer({ toasts, onDismiss }: ToastProps) {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
}

function ToastItem({
  toast,
  onDismiss,
}: {
  toast: ToastMessage;
  onDismiss: (id: string) => void;
}) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(toast.id);
    }, 4000);
    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-[#2D3B36]" />,
    info: <Info className="w-5 h-5 text-[#C5A880]" />,
    error: <AlertCircle className="w-5 h-5 text-rose-600" />,
  };

  return (
    <div className="pointer-events-auto flex items-start gap-3 p-4 rounded-xl bg-white/95 backdrop-blur-md border border-[#E8E5DF] shadow-[0_10px_25px_-5px_rgba(45,59,54,0.12)] transition-all animate-in fade-in slide-in-from-bottom-3 duration-200">
      <div className="shrink-0 mt-0.5">{icons[toast.type || 'success']}</div>
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-semibold text-stone-900 leading-tight tracking-tight">
          {toast.title}
        </h4>
        {toast.description && (
          <p className="mt-1 text-xs text-stone-500 leading-relaxed">
            {toast.description}
          </p>
        )}
      </div>
      <button
        onClick={() => onDismiss(toast.id)}
        className="shrink-0 text-stone-400 hover:text-stone-700 transition-colors p-0.5 rounded-md"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
