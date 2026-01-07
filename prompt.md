Промпт для Codex — Frontend
Создай frontend для PWA приложения замерщиков жалюзи.

## Технологический стек

- React 18 + TypeScript
- Vite
- Tailwind CSS (чистый, без UI библиотек)
- React Router v6
- Zustand (глобальный state)
- TanStack Query (React Query) для запросов
- react-i18next (мультиязычность)
- Heroicons (иконки)

## Структура проекта
shades-frontend/
├── public/
│   └── locales/
│       ├── ru/
│       │   └── translation.json
│       ├── uz_cyrl/
│       │   └── translation.json
│       └── uz_latn/
│           └── translation.json
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── api/
│   │   ├── client.ts              # Axios/fetch настройка
│   │   ├── auth.api.ts
│   │   ├── orders.api.ts
│   │   ├── windows.api.ts
│   │   ├── shades.api.ts
│   │   └── catalog.api.ts
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useOrders.ts
│   │   ├── useWindows.ts
│   │   ├── useShades.ts
│   │   ├── useCatalog.ts
│   │   └── useDraft.ts            # Автосохранение черновика
│   ├── stores/
│   │   ├── authStore.ts
│   │   ├── wizardStore.ts         # Состояние wizard
│   │   └── draftStore.ts          # Черновики в localStorage
│   ├── components/
│   │   ├── ui/
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Select.tsx
│   │   │   ├── Checkbox.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Toast.tsx
│   │   │   ├── Spinner.tsx
│   │   │   └── Badge.tsx
│   │   ├── layout/
│   │   │   ├── BottomNav.tsx
│   │   │   ├── PageHeader.tsx
│   │   │   └── ProtectedRoute.tsx
│   │   ├── orders/
│   │   │   ├── OrderCard.tsx
│   │   │   ├── OrderList.tsx
│   │   │   ├── OrderFilters.tsx
│   │   │   └── ClientInfo.tsx
│   │   ├── windows/
│   │   │   ├── WindowCard.tsx
│   │   │   ├── WindowList.tsx
│   │   │   └── WindowDetails.tsx
│   │   ├── wizard/
│   │   │   ├── WizardLayout.tsx
│   │   │   ├── WizardProgress.tsx
│   │   │   ├── steps/
│   │   │   │   ├── StepWindowName.tsx
│   │   │   │   ├── StepShadeType.tsx
│   │   │   │   ├── StepInstallation.tsx   # Место установки / Способ крепления
│   │   │   │   ├── StepControl.tsx        # Сторона управления / Тип раздвижки
│   │   │   │   ├── StepDimensions.tsx
│   │   │   │   ├── StepMaterial.tsx
│   │   │   │   ├── StepColor.tsx
│   │   │   │   ├── StepServices.tsx
│   │   │   │   └── StepConfirmation.tsx
│   │   │   └── CopyPreviousModal.tsx
│   │   └── summary/
│   │       ├── SummaryList.tsx
│   │       └── SummaryTotal.tsx
│   ├── pages/
│   │   ├── LoginPage.tsx
│   │   ├── OrdersPage.tsx
│   │   ├── OrderDetailPage.tsx
│   │   ├── WindowViewPage.tsx
│   │   ├── WindowWizardPage.tsx
│   │   ├── SummaryPage.tsx
│   │   └── ProfilePage.tsx
│   ├── i18n/
│   │   └── index.ts               # i18next конфигурация
│   ├── types/
│   │   └── index.ts
│   ├── utils/
│   │   ├── formatPrice.ts
│   │   ├── formatDate.ts
│   │   └── storage.ts
│   └── config/
│       └── index.ts               # API URL и другие настройки
├── package.json
├── tailwind.config.js
├── tsconfig.json
├── vite.config.ts
├── .env.example
└── README.md

## Страницы и роуты
```tsx
// App.tsx
<Routes>
  <Route path="/login" element={<LoginPage />} />
  
  <Route element={<ProtectedRoute />}>
    <Route path="/" element={<Navigate to="/orders" />} />
    <Route path="/orders" element={<OrdersPage />} />
    <Route path="/orders/:orderId" element={<OrderDetailPage />} />
    <Route path="/orders/:orderId/windows/new" element={<WindowWizardPage />} />
    <Route path="/orders/:orderId/windows/:windowId" element={<WindowViewPage />} />
    <Route path="/orders/:orderId/windows/:windowId/edit" element={<WindowWizardPage />} />
    <Route path="/orders/:orderId/summary" element={<SummaryPage />} />
    <Route path="/profile" element={<ProfilePage />} />
  </Route>
</Routes>
```

## Компоненты

### BottomNav.tsx
Нижняя навигация с двумя вкладками:
- Заказы (иконка: ClipboardDocumentListIcon)
- Профиль (иконка: UserCircleIcon)

Показывать только для авторизованных пользователей, скрывать на странице логина и в wizard.

### OrderCard.tsx
Карточка заказа с полями:
- ID заказа
- Имя клиента (clientName)
- Адрес (clientAddress)
- Дата визита (visitDate)
- Статус (badge с цветом)

Цвета статусов:
- new: синий
- in_progress: жёлтый
- measured: зелёный
- completed: серый

### WindowCard.tsx
Карточка окна (простая, без кнопок):
- Название окна
- Тип жалюзи (если есть)
- Размеры (если есть)
- Цена (если есть)

При клике → переход на WindowViewPage.

### WindowViewPage.tsx
Полная информация об окне:
- Название
- Тип жалюзи
- Размеры (ширина × высота)
- Параметры установки
- Материал и цвет
- Услуги (монтаж, демонтаж)
- Цена

Внизу две кнопки:
- Редактировать → переход на /edit
- Удалить → модалка подтверждения

### WizardLayout.tsx
Обёртка для wizard с:
- Заголовком шага
- Индикатором прогресса (WizardProgress)
- Кнопками Назад / Далее
- Автосохранением черновика

### WizardProgress.tsx
Визуальный индикатор прогресса:
- Точки или полоска
- Текущий шаг выделен
- Пройденные шаги отмечены

### CopyPreviousModal.tsx
Модалка при создании 2+ окна:
- "Использовать настройки предыдущего окна?"
- Кнопки: Да / Нет
- Если Да → предзаполняет все поля кроме названия и размеров

### Toast.tsx
Уведомления:
- Типы: success, error, info
- Появляется сверху
- Автоматически исчезает через 3 секунды
- Можно закрыть вручную

### Modal.tsx
Универсальная модалка для:
- Подтверждения удаления
- Копирования настроек
- Других диалогов

## Wizard шаги

### Для Горизонтальных жалюзи:
1. **StepWindowName** — Название окна (input)
2. **StepShadeType** — Тип жалюзи (выбор: Горизонтальные / Вертикальные)
3. **StepInstallation** — Место установки (На створку / На проем)
4. **StepControl** — Сторона управления (Правая / Левая)
5. **StepDimensions** — Размеры (ширина, высота в см)
6. **StepMaterial** — Материал (из каталога, фильтр по типу жалюзи)
7. **StepColor** — Цвет (из каталога, фильтр по материалу)
8. **StepServices** — Услуги (чекбоксы: монтаж, демонтаж)
9. **StepConfirmation** — Сводка всех данных + цена + кнопка Сохранить

### Для Вертикальных жалюзи:
1. **StepWindowName**
2. **StepShadeType**
3. **StepInstallation** — Способ крепления (Потолок / Стена)
4. **StepControl** — Тип раздвижки (3 варианта)
5. **StepDimensions**
6. **StepMaterial**
7. **StepColor**
8. **StepServices**
9. **StepConfirmation**

Шаги 3 и 4 динамически меняются в зависимости от выбранного типа жалюзи на шаге 2.

## Stores (Zustand)

### authStore.ts
```typescript
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  setLanguage: (lang: string) => void;
}
```

### wizardStore.ts
```typescript
interface WizardState {
  currentStep: number;
  data: {
    windowName: string;
    shadeTypeId: number | null;
    options: { optionTypeId: number; optionValueId: number }[];
    width: number | null;
    height: number | null;
    materialId: number | null;
    materialVariantId: number | null;
    installationIncluded: boolean;
    removalIncluded: boolean;
  };
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  updateData: (data: Partial<WizardState['data']>) => void;
  reset: () => void;
  loadFromDraft: (draft: WizardState['data']) => void;
  copyFromPrevious: (previousShade: Shade) => void;
}
```

### draftStore.ts
```typescript
interface DraftState {
  drafts: Record<string, WizardState['data']>; // key: `${orderId}-${windowId || 'new'}`
  saveDraft: (key: string, data: WizardState['data']) => void;
  loadDraft: (key: string) => WizardState['data'] | null;
  deleteDraft: (key: string) => void;
}
```
Хранит черновики в localStorage.

## Типы (types/index.ts)
```typescript
interface User {
  id: number;
  username: string;
  fullName: string;
  preferredLanguageCode: string;
}

interface Order {
  id: number;
  clientName: string;
  clientPhone: string;
  clientAddress: string;
  notes: string | null;
  visitDate: string;
  status: 'new' | 'in_progress' | 'measured' | 'completed';
  statusName: string;
  windows: Window[];
  totalPrice?: number;
}

interface Window {
  id: number;
  orderId: number;
  name: string;
  shade: Shade | null;
}

interface Shade {
  id: number;
  windowId: number;
  shadeTypeId: number;
  shadeTypeName: string;
  width: number;
  height: number;
  materialVariantId: number;
  materialName: string;
  colorName: string;
  options: ShadeOptionValue[];
  installationIncluded: boolean;
  removalIncluded: boolean;
  calculatedPrice: number;
}

interface ShadeOptionValue {
  optionTypeId: number;
  optionTypeName: string;
  optionValueId: number;
  optionValueName: string;
}

interface Catalog {
  shadeTypes: ShadeType[];
  materials: Material[];
  servicePrices: {
    installation: { price: number; name: string };
    removal: { price: number; name: string };
  };
}

interface ShadeType {
  id: number;
  name: string;
  minPrice: number;
  optionTypes: OptionType[];
  materials: number[]; // material IDs
}

interface OptionType {
  id: number;
  name: string;
  displayOrder: number;
  values: OptionValue[];
}

interface OptionValue {
  id: number;
  name: string;
  displayOrder: number;
}

interface Material {
  id: number;
  name: string;
  variants: MaterialVariant[];
}

interface MaterialVariant {
  id: number;
  colorName: string;
  colorHex: string | null;
  pricePerSqm: number;
}
```

## API интеграция

### client.ts
```typescript
const API_URL = import.meta.env.VITE_API_URL;

// Axios instance с:
// - baseURL
// - Authorization header из authStore
// - Interceptor для добавления ?lang= к запросам
// - Error interceptor для 401 → logout
```

### Endpoints:
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/orders?lang=ru&status=new,in_progress&search=текст`
- `GET /api/orders/:id?lang=ru`
- `PATCH /api/orders/:id`
- `POST /api/orders/:orderId/windows`
- `PATCH /api/windows/:id`
- `DELETE /api/windows/:id`
- `POST /api/windows/:windowId/shades`
- `PATCH /api/shades/:id`
- `DELETE /api/shades/:id`
- `GET /api/catalog?lang=ru`
- `POST /api/price/calculate`

## Мультиязычность (i18n)

### Структура переводов:
```json
// public/locales/ru/translation.json
{
  "common": {
    "back": "Назад",
    "next": "Далее",
    "save": "Сохранить",
    "cancel": "Отмена",
    "delete": "Удалить",
    "edit": "Редактировать",
    "confirm": "Подтвердить",
    "yes": "Да",
    "no": "Нет",
    "loading": "Загрузка...",
    "error": "Ошибка",
    "success": "Успешно"
  },
  "auth": {
    "login": "Вход",
    "username": "Имя пользователя",
    "password": "Пароль",
    "loginButton": "Войти",
    "loginError": "Неверное имя пользователя или пароль"
  },
  "orders": {
    "title": "Заказы",
    "search": "Поиск по имени или адресу",
    "filters": "Фильтры",
    "allStatuses": "Все статусы",
    "noOrders": "Нет заказов",
    "visitDate": "Дата визита"
  },
  "order": {
    "clientInfo": "Информация о клиенте",
    "phone": "Телефон",
    "address": "Адрес",
    "notes": "Заметки",
    "windows": "Окна",
    "addWindow": "Добавить окно",
    "summary": "Итого",
    "noWindows": "Нет окон"
  },
  "window": {
    "name": "Название окна",
    "namePlaceholder": "Например: Окно в спальне",
    "dimensions": "Размеры",
    "width": "Ширина (см)",
    "height": "Высота (см)",
    "price": "Цена"
  },
  "wizard": {
    "step": "Шаг {{current}} из {{total}}",
    "windowName": "Название окна",
    "shadeType": "Тип жалюзи",
    "installation": "Место установки",
    "mounting": "Способ крепления",
    "controlSide": "Сторона управления",
    "slideType": "Тип раздвижки",
    "dimensions": "Размеры",
    "material": "Материал",
    "color": "Цвет",
    "services": "Дополнительные услуги",
    "confirmation": "Подтверждение",
    "copyPrevious": "Использовать настройки предыдущего окна?",
    "totalPrice": "Стоимость"
  },
  "services": {
    "installation": "Монтаж",
    "removal": "Демонтаж"
  },
  "summary": {
    "title": "Итого",
    "backToWindows": "Назад к окнам",
    "total": "Общая сумма",
    "confirmOrder": "Подтвердить заказ",
    "orderConfirmed": "Заказ подтверждён"
  },
  "profile": {
    "title": "Профиль",
    "language": "Язык",
    "logout": "Выйти",
    "logoutConfirm": "Вы уверены, что хотите выйти?"
  },
  "delete": {
    "windowTitle": "Удалить окно?",
    "windowMessage": "Это действие нельзя отменить."
  },
  "status": {
    "new": "Новый",
    "in_progress": "В работе",
    "measured": "Замер выполнен",
    "completed": "Завершён"
  },
  "errors": {
    "network": "Ошибка сети",
    "unknown": "Что-то пошло не так"
  }
}
```
```json
// public/locales/uz_cyrl/translation.json
{
  "common": {
    "back": "Орқага",
    "next": "Кейинги",
    "save": "Сақлаш",
    "cancel": "Бекор қилиш",
    "delete": "Ўчириш",
    "edit": "Таҳрирлаш",
    "confirm": "Тасдиқлаш",
    "yes": "Ҳа",
    "no": "Йўқ",
    "loading": "Юкланмоқда...",
    "error": "Хатолик",
    "success": "Муваффақиятли"
  },
  "auth": {
    "login": "Кириш",
    "username": "Фойдаланувчи номи",
    "password": "Парол",
    "loginButton": "Кириш",
    "loginError": "Фойдаланувчи номи ёки парол нотўғри"
  },
  "orders": {
    "title": "Буюртмалар",
    "search": "Исм ёки манзил бўйича қидириш",
    "filters": "Филтрлар",
    "allStatuses": "Барча ҳолатлар",
    "noOrders": "Буюртмалар йўқ",
    "visitDate": "Ташриф санаси"
  },
  "order": {
    "clientInfo": "Мижоз маълумотлари",
    "phone": "Телефон",
    "address": "Манзил",
    "notes": "Изоҳлар",
    "windows": "Ойналар",
    "addWindow": "Ойна қўшиш",
    "summary": "Жами",
    "noWindows": "Ойналар йўқ"
  },
  "window": {
    "name": "Ойна номи",
    "namePlaceholder": "Масалан: Ётоқхонадаги ойна",
    "dimensions": "Ўлчамлар",
    "width": "Кенглик (см)",
    "height": "Баландлик (см)",
    "price": "Нарх"
  },
  "wizard": {
    "step": "{{total}} дан {{current}}-қадам",
    "windowName": "Ойна номи",
    "shadeType": "Жалюзи тури",
    "installation": "Ўрнатиш жойи",
    "mounting": "Ўрнатиш усули",
    "controlSide": "Бошқариш томони",
    "slideType": "Суриш тури",
    "dimensions": "Ўлчамлар",
    "material": "Материал",
    "color": "Ранг",
    "services": "Қўшимча хизматлар",
    "confirmation": "Тасдиқлаш",
    "copyPrevious": "Олдинги ойна созламаларини ишлатасизми?",
    "totalPrice": "Нархи"
  },
  "services": {
    "installation": "Ўрнатиш",
    "removal": "Демонтаж"
  },
  "summary": {
    "title": "Жами",
    "backToWindows": "Ойналарга қайтиш",
    "total": "Умумий сумма",
    "confirmOrder": "Буюртмани тасдиқлаш",
    "orderConfirmed": "Буюртма тасдиқланди"
  },
  "profile": {
    "title": "Профил",
    "language": "Тил",
    "logout": "Чиқиш",
    "logoutConfirm": "Ҳақиқатан ҳам чиқмоқчимисиз?"
  },
  "delete": {
    "windowTitle": "Ойнани ўчирасизми?",
    "windowMessage": "Бу амални бекор қилиб бўлмайди."
  },
  "status": {
    "new": "Янги",
    "in_progress": "Жараёнда",
    "measured": "Ўлчов олинди",
    "completed": "Тугалланди"
  },
  "errors": {
    "network": "Тармоқ хатоси",
    "unknown": "Нимадир хато кетди"
  }
}
```
```json
// public/locales/uz_latn/translation.json
{
  "common": {
    "back": "Orqaga",
    "next": "Keyingi",
    "save": "Saqlash",
    "cancel": "Bekor qilish",
    "delete": "O'chirish",
    "edit": "Tahrirlash",
    "confirm": "Tasdiqlash",
    "yes": "Ha",
    "no": "Yo'q",
    "loading": "Yuklanmoqda...",
    "error": "Xatolik",
    "success": "Muvaffaqiyatli"
  },
  "auth": {
    "login": "Kirish",
    "username": "Foydalanuvchi nomi",
    "password": "Parol",
    "loginButton": "Kirish",
    "loginError": "Foydalanuvchi nomi yoki parol noto'g'ri"
  },
  "orders": {
    "title": "Buyurtmalar",
    "search": "Ism yoki manzil bo'yicha qidirish",
    "filters": "Filtrlar",
    "allStatuses": "Barcha holatlar",
    "noOrders": "Buyurtmalar yo'q",
    "visitDate": "Tashrif sanasi"
  },
  "order": {
    "clientInfo": "Mijoz ma'lumotlari",
    "phone": "Telefon",
    "address": "Manzil",
    "notes": "Izohlar",
    "windows": "Oynalar",
    "addWindow": "Oyna qo'shish",
    "summary": "Jami",
    "noWindows": "Oynalar yo'q"
  },
  "window": {
    "name": "Oyna nomi",
    "namePlaceholder": "Masalan: Yotoqxonadagi oyna",
    "dimensions": "O'lchamlar",
    "width": "Kenglik (sm)",
    "height": "Balandlik (sm)",
    "price": "Narx"
  },
  "wizard": {
    "step": "{{total}} dan {{current}}-qadam",
    "windowName": "Oyna nomi",
    "shadeType": "Jaluzi turi",
    "installation": "O'rnatish joyi",
    "mounting": "O'rnatish usuli",
    "controlSide": "Boshqarish tomoni",
    "slideType": "Surish turi",
    "dimensions": "O'lchamlar",
    "material": "Material",
    "color": "Rang",
    "services": "Qo'shimcha xizmatlar",
    "confirmation": "Tasdiqlash",
    "copyPrevious": "Oldingi oyna sozlamalarini ishlatasizmi?",
    "totalPrice": "Narxi"
  },
  "services": {
    "installation": "O'rnatish",
    "removal": "Demontaj"
  },
  "summary": {
    "title": "Jami",
    "backToWindows": "Oynalarga qaytish",
    "total": "Umumiy summa",
    "confirmOrder": "Buyurtmani tasdiqlash",
    "orderConfirmed": "Buyurtma tasdiqlandi"
  },
  "profile": {
    "title": "Profil",
    "language": "Til",
    "logout": "Chiqish",
    "logoutConfirm": "Haqiqatan ham chiqmoqchimisiz?"
  },
  "delete": {
    "windowTitle": "Oynani o'chirasizmi?",
    "windowMessage": "Bu amalni bekor qilib bo'lmaydi."
  },
  "status": {
    "new": "Yangi",
    "in_progress": "Jarayonda",
    "measured": "O'lchov olindi",
    "completed": "Tugallandi"
  },
  "errors": {
    "network": "Tarmoq xatosi",
    "unknown": "Nimadir xato ketdi"
  }
}
```

## Дизайн

### Цветовая схема (Tailwind):
```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
        },
        success: '#22c55e',
        warning: '#f59e0b',
        error: '#ef4444',
      }
    }
  }
}
```

### UI принципы:
- Светлая тема
- Крупные кнопки (min-height: 48px) для удобства на мобильных
- Достаточно padding и margin между элементами
- Чёткая типографика, читаемые шрифты
- Карточки с тенью для визуального разделения
- Простой и понятный интерфейс

### Компоненты стили:

**Button:**
```tsx
// Варианты: primary, secondary, danger, ghost
// Размеры: sm, md, lg
// Primary: bg-primary-600 text-white
// Full width на мобильных
```

**Card:**
```tsx
// bg-white rounded-lg shadow-sm p-4
// Hover: shadow-md transition
```

**Input:**
```tsx
// border border-gray-300 rounded-lg px-4 py-3
// Focus: ring-2 ring-primary-500 border-primary-500
// Error: border-red-500
```

**Badge (статусы):**
```tsx
// Rounded-full px-3 py-1 text-sm font-medium
// new: bg-blue-100 text-blue-800
// in_progress: bg-yellow-100 text-yellow-800
// measured: bg-green-100 text-green-800
// completed: bg-gray-100 text-gray-800
```

## Конфигурация

### .env.example
VITE_API_URL=http://localhost:3000/api

### package.json
```json
{
  "name": "shades-frontend",
  "version": "1.0.0",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint src --ext ts,tsx"
  },
  "dependencies": {
    "react": "^18.x",
    "react-dom": "^18.x",
    "react-router-dom": "^6.x",
    "@tanstack/react-query": "^5.x",
    "zustand": "^4.x",
    "axios": "^1.x",
    "i18next": "^23.x",
    "react-i18next": "^14.x",
    "i18next-browser-languagedetector": "^7.x",
    "i18next-http-backend": "^2.x",
    "@heroicons/react": "^2.x"
  },
  "devDependencies": {
    "@types/react": "^18.x",
    "@types/react-dom": "^18.x",
    "@vitejs/plugin-react": "^4.x",
    "autoprefixer": "^10.x",
    "postcss": "^8.x",
    "tailwindcss": "^3.x",
    "typescript": "^5.x",
    "vite": "^5.x"
  }
}
```

## Важные требования

1. Mobile-first дизайн — всё должно отлично работать на телефоне
2. Автосохранение черновика в localStorage при каждом изменении в wizard
3. При возврате в незавершённый wizard — предложить продолжить или начать заново
4. Плавные анимации переходов между шагами wizard
5. Все тексты через i18n — никаких хардкод строк
6. Форматирование цен с пробелами (265 000 сум)
7. Форматирование дат в локальном формате
8. Loading состояния для всех запросов
9. Error handling с понятными сообщениями
10. Toast уведомления при успешных действиях и ошибках
11. Модалка подтверждения при удалении
12. Предложение копировать настройки при создании 2+ окна
13. Валидация форм с понятными сообщениями об ошибках
14. Кнопка "Назад к окнам" на странице Итого