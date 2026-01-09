Исправь два бага с модальными окнами и toast уведомлениями:

## 1. Модальные окна выходят за рамки экрана

В Modal.tsx исправь позиционирование и добавь отступы от краёв:

// Было (проблема):
<div className="fixed inset-x-4 top-1/2 -translate-y-1/2 ...">

// Стало (правильно):
// Backdrop
<div 
  className="fixed inset-0 bg-black/50 z-50 animate-fadeIn" 
  onClick={onClose} 
/>

// Modal content
<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
  <div 
    className="bg-white rounded-lg p-6 w-full max-w-sm shadow-xl animate-scaleIn"
    onClick={(e) => e.stopPropagation()}
  >
    {children}
  </div>
</div>

Полный компонент Modal.tsx:

import { ReactNode } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

export const Modal = ({ isOpen, onClose, children }: ModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 animate-fadeIn" 
        onClick={onClose} 
      />
      
      {/* Modal container */}
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div 
          className="bg-white rounded-xl p-6 w-full max-w-sm shadow-xl animate-scaleIn"
          onClick={(e) => e.stopPropagation()}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

## 2. Toast уведомления прозрачные — добавь непрозрачный фон

В Toast.tsx:

// Было (прозрачный):
<div className="fixed top-4 right-4 bg-white shadow-lg rounded-lg p-4 ...">

// Стало (непрозрачный с z-index выше всего):
<div className="fixed top-4 left-4 right-4 z-[100] animate-slideDown">
  <div className="bg-white shadow-lg rounded-lg p-4 border border-gray-100">
    {/* Success */}
    <div className="flex items-center gap-3">
      <CheckCircleIcon className="w-6 h-6 text-green-500 flex-shrink-0" />
      <p className="text-gray-800">{message}</p>
    </div>
  </div>
</div>

Полный компонент Toast.tsx с разными типами:

import { CheckCircleIcon, XCircleIcon, InformationCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface ToastProps {
  type: 'success' | 'error' | 'info';
  message: string;
  onClose: () => void;
}

export const Toast = ({ type, message, onClose }: ToastProps) => {
  const icons = {
    success: <CheckCircleIcon className="w-6 h-6 text-green-500" />,
    error: <XCircleIcon className="w-6 h-6 text-red-500" />,
    info: <InformationCircleIcon className="w-6 h-6 text-blue-500" />,
  };

  const bgColors = {
    success: 'bg-green-50 border-green-200',
    error: 'bg-red-50 border-red-200',
    info: 'bg-blue-50 border-blue-200',
  };

  return (
    <div className="fixed top-4 left-4 right-4 z-[100] animate-slideDown">
      <div className={`${bgColors[type]} border rounded-lg p-4 shadow-lg`}>
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0">{icons[type]}</div>
          <p className="flex-1 text-gray-800 font-medium">{message}</p>
          <button 
            onClick={onClose}
            className="flex-shrink-0 p-1 hover:bg-black/5 rounded-full transition-colors"
          >
            <XMarkIcon className="w-5 h-5 text-gray-500" />
          </button>
        </div>
      </div>
    </div>
  );
};

## 3. Добавь анимацию slideDown в tailwind.config.js если её нет:

module.exports = {
  theme: {
    extend: {
      animation: {
        // ... другие анимации
        'slideDown': 'slideDown 0.3s ease-out',
      },
      keyframes: {
        // ... другие keyframes
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
};