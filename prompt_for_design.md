Добавь плавные переходы между страницами и состояниями загрузки.

## 1. Создай компонент PageTransition для анимации страниц

Создай src/components/ui/PageTransition.tsx:

import { ReactNode } from 'react';

interface PageTransitionProps {
  children: ReactNode;
}

export const PageTransition = ({ children }: PageTransitionProps) => {
  return (
    <div className="animate-fadeIn">
      {children}
    </div>
  );
};

## 2. Добавь анимации в tailwind.config.js:

module.exports = {
  theme: {
    extend: {
      animation: {
        'fadeIn': 'fadeIn 0.3s ease-out',
        'slideUp': 'slideUp 0.3s ease-out',
        'slideIn': 'slideIn 0.3s ease-out',
        'scaleIn': 'scaleIn 0.2s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
};

## 3. Создай компонент LoadingScreen

Создай src/components/ui/LoadingScreen.tsx:

export const LoadingScreen = () => {
  return (
    <div className="flex items-center justify-center min-h-[50vh] animate-fadeIn">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
        <p className="text-gray-500">Загрузка...</p>
      </div>
    </div>
  );
};

## 4. Создай компонент Skeleton для карточек

Создай src/components/ui/Skeleton.tsx:

export const CardSkeleton = () => {
  return (
    <div className="p-4 bg-white rounded-lg shadow-sm animate-pulse">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
        <div className="w-5 h-5 bg-gray-200 rounded"></div>
      </div>
    </div>
  );
};

export const OrderCardSkeleton = () => {
  return (
    <div className="p-4 bg-white rounded-lg shadow-sm animate-pulse">
      <div className="flex items-center gap-2 mb-2">
        <div className="h-4 bg-gray-200 rounded w-12"></div>
        <div className="h-5 bg-gray-200 rounded-full w-20"></div>
      </div>
      <div className="h-5 bg-gray-200 rounded w-2/3 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-full mb-1"></div>
      <div className="h-4 bg-gray-200 rounded w-1/3"></div>
    </div>
  );
};

export const WindowCardSkeleton = () => {
  return (
    <div className="p-4 bg-white rounded-lg shadow-sm animate-pulse">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="h-5 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-1"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-5 bg-gray-200 rounded w-24"></div>
          <div className="w-5 h-5 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>
  );
};

## 5. Оберни страницы в PageTransition

В каждой странице (OrdersPage.tsx, OrderDetailPage.tsx, и т.д.):

import { PageTransition } from '../components/ui/PageTransition';
import { LoadingScreen } from '../components/ui/LoadingScreen';
import { OrderCardSkeleton } from '../components/ui/Skeleton';

export const OrdersPage = () => {
  const { data: orders, isLoading } = useOrders();

  if (isLoading) {
    return (
      <PageTransition>
        <div className="p-4 space-y-4">
          <OrderCardSkeleton />
          <OrderCardSkeleton />
          <OrderCardSkeleton />
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="p-4">
        {/* контент страницы */}
      </div>
    </PageTransition>
  );
};

## 6. Анимация для списков — каскадная загрузка

В OrderList.tsx и WindowList.tsx добавь задержку анимации для каждого элемента:

{orders.map((order, index) => (
  <div 
    key={order.id}
    className="animate-slideUp"
    style={{ animationDelay: `${index * 50}ms` }}
  >
    <OrderCard order={order} />
  </div>
))}

## 7. Анимация для модальных окон

В Modal.tsx:

// Backdrop
<div className="fixed inset-0 bg-black/50 animate-fadeIn" onClick={onClose} />

// Modal content
<div className="fixed inset-x-4 top-1/2 -translate-y-1/2 bg-white rounded-lg p-6 animate-scaleIn">
  {children}
</div>

## 8. Анимация для Toast уведомлений

В Toast.tsx:

<div className="fixed top-4 right-4 bg-white shadow-lg rounded-lg p-4 animate-slideIn">
  {message}
</div>

## 9. Анимация для Wizard шагов

В WizardLayout.tsx — анимация при смене шагов:

<div key={currentStep} className="animate-fadeIn">
  {renderStep()}
</div>

## 10. Плавный переход для кнопки загрузки

В Button.tsx добавь состояние loading:

interface ButtonProps {
  isLoading?: boolean;
  children: ReactNode;
  // ...
}

export const Button = ({ isLoading, children, ...props }: ButtonProps) => {
  return (
    <button 
      disabled={isLoading}
      className="... disabled:opacity-70"
      {...props}
    >
      {isLoading ? (
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          <span>Загрузка...</span>
        </div>
      ) : children}
    </button>
  );
};