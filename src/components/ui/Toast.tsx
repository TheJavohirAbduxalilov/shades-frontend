import { useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { create } from 'zustand';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastItem {
  id: string;
  type: ToastType;
  message: string;
}

interface ToastState {
  toasts: ToastItem[];
  push: (toast: ToastItem) => void;
  remove: (id: string) => void;
}

const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  push: (toast) => set((state) => ({ toasts: [...state.toasts, toast] })),
  remove: (id) => set((state) => ({ toasts: state.toasts.filter((item) => item.id !== id) })),
}));

const toast = {
  success: (message: string) =>
    useToastStore
      .getState()
      .push({ id: String(Date.now()) + Math.random().toString(16), type: 'success', message }),
  error: (message: string) =>
    useToastStore
      .getState()
      .push({ id: String(Date.now()) + Math.random().toString(16), type: 'error', message }),
  info: (message: string) =>
    useToastStore
      .getState()
      .push({ id: String(Date.now()) + Math.random().toString(16), type: 'info', message }),
};

const ToastViewport = () => {
  const toasts = useToastStore((state) => state.toasts);
  const remove = useToastStore((state) => state.remove);

  return (
    <div className="pointer-events-none fixed top-4 right-4 z-50 w-[calc(100%-2rem)] max-w-sm">
      <div className="flex flex-col gap-3">
        {toasts.map((toastItem) => (
          <ToastMessage key={toastItem.id} toast={toastItem} onClose={() => remove(toastItem.id)} />
        ))}
      </div>
    </div>
  );
};

const ToastMessage = ({ toast, onClose }: { toast: ToastItem; onClose: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(() => onClose(), 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const tone = {
    success: 'border-success/30 bg-success/10 text-emerald-700',
    error: 'border-error/30 bg-error/10 text-red-700',
    info: 'border-primary-200 bg-primary-50 text-primary-700',
  };

  return (
    <div
      className={[
        'pointer-events-auto flex items-start justify-between gap-3 rounded-xl border px-4 py-3 text-sm shadow-lg animate-slideIn',
        tone[toast.type],
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <span>{toast.message}</span>
      <button type="button" onClick={onClose} className="text-slate-500 hover:text-slate-700">
        <XMarkIcon className="h-4 w-4" />
      </button>
    </div>
  );
};

export { toast };
export default ToastViewport;
