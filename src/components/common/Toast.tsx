import React, { useState, useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  text: string;
}

type Listener = (msg: ToastMessage) => void;
const listeners = new Set<Listener>();

export const toast = {
  show(text: string, type: 'success' | 'error' | 'info' = 'info') {
    const msg: ToastMessage = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      text,
    };
    listeners.forEach((fn) => fn(msg));
  },
  success(text: string) {
    this.show(text, 'success');
  },
  error(text: string) {
    this.show(text, 'error');
  },
  info(text: string) {
    this.show(text, 'info');
  },
};

export const ToastContainer: React.FC = () => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    const handleToast: Listener = (msg) => {
      setToasts((prev) => [...prev, msg]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== msg.id));
      }, 4000);
    };

    listeners.add(handleToast);
    return () => {
      listeners.delete(handleToast);
    };
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-20 right-4 z-50 flex flex-col space-y-2 pointer-events-none max-w-sm w-full px-2">
      {toasts.map((item) => (
        <div
          key={item.id}
          className={`pointer-events-auto flex items-center p-3.5 rounded-2xl shadow-elevated border text-sm font-medium animate-in fade-in slide-in-from-top-4 duration-200 ${
            item.type === 'success'
              ? 'bg-accent-50 dark:bg-accent-950/90 text-accent-900 dark:text-accent-100 border-accent-200 dark:border-accent-800'
              : item.type === 'error'
              ? 'bg-rose-50 dark:bg-rose-950/90 text-rose-900 dark:text-rose-100 border-rose-200 dark:border-rose-800'
              : 'bg-slate-900 text-white border-slate-700'
          }`}
        >
          {item.type === 'success' && <CheckCircle2 className="w-5 h-5 text-accent-600 mr-2.5 shrink-0" />}
          {item.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-600 mr-2.5 shrink-0" />}
          {item.type === 'info' && <Info className="w-5 h-5 text-brand-400 mr-2.5 shrink-0" />}
          <span className="flex-1">{item.text}</span>
          <button
            onClick={() => setToasts((prev) => prev.filter((t) => t.id !== item.id))}
            className="ml-2 p-1 rounded-lg opacity-70 hover:opacity-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
