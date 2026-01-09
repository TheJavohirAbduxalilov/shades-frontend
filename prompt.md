3 исправления:

## 1. Изменить единицу измерения с "см" на "мм"

В public/locales/ru/translation.json:

// Было:
"width": "Ширина (см)",
"height": "Высота (см)",

// Стало:
"width": "Ширина (мм)",
"height": "Высота (мм)",

То же самое для uz_cyrl и uz_latn:

// uz_cyrl:
"width": "Кенглик (мм)",
"height": "Баландлик (мм)",

// uz_latn:
"width": "Kenglik (mm)",
"height": "Balandlik (mm)",

В WindowCard.tsx, WindowViewPage.tsx и везде где показываются размеры:

// Было:
<p>{width} x {height} см</p>

// Стало:
<p>{width} x {height} мм</p>

## 2. Показывать данные профиля в разделе "Профиль"

В ProfilePage.tsx:

import { useAuthStore } from '../stores/authStore';
import { UserIcon } from '@heroicons/react/24/outline';

export const ProfilePage = () => {
  const { user, logout } = useAuthStore();
  const { t, i18n } = useTranslation();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLang = e.target.value;
    i18n.changeLanguage(newLang);
    // Можно также обновить на сервере через API
  };

  return (
    <PageTransition>
      <div className="p-4 pb-24">
        <h1 className="text-2xl font-bold mb-6">{t('profile.title')}</h1>
        
        {/* Данные профиля */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
              <UserIcon className="w-8 h-8 text-primary-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">{user?.fullName}</h2>
              <p className="text-gray-500">@{user?.username}</p>
            </div>
          </div>
        </div>

        {/* Выбор языка */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('profile.language')}
          </label>
          <select
            value={i18n.language}
            onChange={handleLanguageChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg
              focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="ru">Русский</option>
            <option value="uz_cyrl">Ўзбекча (Кирилл)</option>
            <option value="uz_latn">O'zbekcha (Lotin)</option>
          </select>
        </div>

        {/* Кнопка выхода */}
        <Button 
          variant="danger" 
          className="w-full"
          onClick={() => setShowLogoutModal(true)}
        >
          {t('profile.logout')}
        </Button>

        {/* Модалка подтверждения выхода */}
        <Modal isOpen={showLogoutModal} onClose={() => setShowLogoutModal(false)}>
          <h3 className="text-lg font-semibold mb-2">{t('profile.logout')}</h3>
          <p className="text-gray-600 mb-6">{t('profile.logoutConfirm')}</p>
          <div className="flex flex-col gap-3">
            <Button variant="danger" onClick={logout}>
              {t('profile.logout')}
            </Button>
            <Button variant="secondary" onClick={() => setShowLogoutModal(false)}>
              {t('common.cancel')}
            </Button>
          </div>
        </Modal>
      </div>
    </PageTransition>
  );
};

## 3. Модальное окно выбора окна для копирования — добавь Select

Измени CopyPreviousModal.tsx (или создай CopyFromWindowModal.tsx):

import { useState } from 'react';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';
import { useTranslation } from 'react-i18next';
import { Window } from '../types';

interface CopyFromWindowModalProps {
  isOpen: boolean;
  onClose: () => void;
  windows: Window[];
  onCopy: (windowId: number) => void;
  onSkip: () => void;
}

export const CopyFromWindowModal = ({ 
  isOpen, 
  onClose, 
  windows, 
  onCopy, 
  onSkip 
}: CopyFromWindowModalProps) => {
  const { t } = useTranslation();
  const windowsWithShade = windows.filter(w => w.shade !== null);
  
  const [selectedWindowId, setSelectedWindowId] = useState<number>(
    windowsWithShade.length > 0 ? windowsWithShade[windowsWithShade.length - 1].id : 0
  );

  if (windowsWithShade.length === 0) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h3 className="text-lg font-semibold mb-2">
        {t('wizard.copyFromWindow')}
      </h3>
      <p className="text-gray-600 mb-4">
        {t('wizard.copyFromWindowDescription')}
      </p>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('wizard.selectWindow')}
        </label>
        <select
          value={selectedWindowId}
          onChange={(e) => setSelectedWindowId(Number(e.target.value))}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg
            focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          {windowsWithShade.map((window) => (
            <option key={window.id} value={window.id}>
              {window.name} — {window.shade?.shadeTypeName}, {window.shade?.width}x{window.shade?.height} мм
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-3">
        <Button onClick={() => onCopy(selectedWindowId)}>
          {t('wizard.copySettings')}
        </Button>
        <Button variant="secondary" onClick={onSkip}>
          {t('wizard.startEmpty')}
        </Button>
      </div>
    </Modal>
  );
};

В WindowWizardPage.tsx обнови использование:

const handleCopyFromWindow = (windowId: number) => {
  const windowToCopy = order?.windows.find(w => w.id === windowId);
  if (windowToCopy?.shade) {
    wizardStore.copyFromPrevious(windowToCopy.shade);
  }
  setShowCopyModal(false);
};

// Замени старую модалку на новую:
<CopyFromWindowModal
  isOpen={showCopyModal}
  onClose={() => setShowCopyModal(false)}
  windows={order?.windows || []}
  onCopy={handleCopyFromWindow}
  onSkip={() => setShowCopyModal(false)}
/>

Добавь переводы в public/locales/ru/translation.json:

"wizard": {
  // ... существующие
  "copyFromWindow": "Скопировать настройки?",
  "copyFromWindowDescription": "Выберите окно, настройки которого хотите использовать.",
  "selectWindow": "Выберите окно",
  "copySettings": "Скопировать",
  "startEmpty": "Начать с нуля"
}

И для uz_cyrl:

"wizard": {
  "copyFromWindow": "Созламаларни нусхалаш?",
  "copyFromWindowDescription": "Созламаларини ишлатмоқчи бўлган ойнани танланг.",
  "selectWindow": "Ойнани танланг",
  "copySettings": "Нусхалаш",
  "startEmpty": "Бўш бошлаш"
}

И для uz_latn:

"wizard": {
  "copyFromWindow": "Sozlamalarni nusxalash?",
  "copyFromWindowDescription": "Sozlamalarini ishlatmoqchi bo'lgan oynani tanlang.",
  "selectWindow": "Oynani tanlang",
  "copySettings": "Nusxalash",
  "startEmpty": "Bo'sh boshlash"
}

## 4. Кнопки Wizard на всю ширину на десктопе

В WizardLayout.tsx или WindowWizardPage.tsx:

// Вся страница Wizard
<div className="min-h-screen flex flex-col">
  {/* Header */}
  <div className="max-w-2xl mx-auto w-full p-4">
    {/* header content */}
  </div>

  {/* Content */}
  <div className="flex-1 max-w-2xl mx-auto w-full p-4 overflow-auto">
    {renderStep()}
  </div>

  {/* Footer buttons - фиксированы внизу, на всю ширину */}
  <div className="border-t bg-white">
    <div className="max-w-2xl mx-auto w-full p-4">
      <div className="flex gap-4">
        <Button variant="secondary" onClick={prevStep} className="flex-1">
          {t('common.back')}
        </Button>
        <Button onClick={nextStep} className="flex-1">
          {t('common.next')}
        </Button>
      </div>
    </div>
  </div>
</div>

Это ограничит контент до max-w-2xl (672px) и центрирует, при этом кнопки будут занимать всю ширину контейнера.