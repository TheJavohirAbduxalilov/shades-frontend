import { useEffect } from 'react';
import {
  CheckCircleIcon,
  InformationCircleIcon,
  XCircleIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
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
    <div className="pointer-events-none fixed left-4 right-4 top-4 z-[100]">
      <div className="mx-auto flex max-w-md flex-col gap-3">
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

  const icons = {
    success: <CheckCircleIcon className="h-6 w-6 text-emerald-500" />,
    error: <XCircleIcon className="h-6 w-6 text-red-500" />,
    info: <InformationCircleIcon className="h-6 w-6 text-blue-500" />,
  };

  const tone = {
    success: 'border-emerald-200 bg-emerald-50',
    error: 'border-red-200 bg-red-50',
    info: 'border-blue-200 bg-blue-50',
  };

  return (
    <div
      className={[
        'pointer-events-auto flex items-center gap-3 rounded-lg border px-4 py-3 text-sm shadow-lg animate-slideDown',
        tone[toast.type],
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <span className="flex-shrink-0">{icons[toast.type]}</span>
      <span className="flex-1 font-medium text-slate-800">{toast.message}</span>
      <button
        type="button"
        onClick={onClose}
        className="flex-shrink-0 rounded-full p-1 text-slate-500 transition-colors hover:bg-black/5 hover:text-slate-700"
      >
        <XMarkIcon className="h-4 w-4" />
      </button>
    </div>
  );
};

export { toast };
export default ToastViewport;
