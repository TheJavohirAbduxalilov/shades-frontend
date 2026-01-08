Добавь визуальное различие между информационными и интерактивными элементами, а также hover/active эффекты для мобильной версии.

## 1. Интерактивные карточки (окна, заказы) — добавь стрелку и эффекты

В WindowCard.tsx и OrderCard.tsx:

// Добавь иконку chevron справа
import { ChevronRightIcon } from '@heroicons/react/24/outline';

<div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm 
  cursor-pointer transition-all duration-150
  hover:bg-gray-50 hover:shadow-md
  active:scale-[0.98] active:bg-gray-100">
  
  <div className="flex-1">
    <h3 className="font-medium">{window.name}</h3>
    <p className="text-sm text-gray-500">{shade?.shadeTypeName}</p>
    <p className="text-sm text-gray-500">{width} x {height}</p>
  </div>
  
  <div className="flex items-center gap-2">
    <span className="font-medium">{formatPrice(price)} сум</span>
    <ChevronRightIcon className="w-5 h-5 text-gray-400" />
  </div>
</div>

## 2. Кнопки — hover и active эффекты

В Button.tsx или везде где используются кнопки:

// Primary button
className="bg-primary-600 text-white px-4 py-3 rounded-lg font-medium
  transition-all duration-150
  hover:bg-primary-700
  active:scale-[0.98] active:bg-primary-800"

// Secondary button  
className="bg-gray-100 text-gray-700 px-4 py-3 rounded-lg font-medium
  transition-all duration-150
  hover:bg-gray-200
  active:scale-[0.98] active:bg-gray-300"

// Danger button (удалить)
className="bg-red-600 text-white px-4 py-3 rounded-lg font-medium
  transition-all duration-150
  hover:bg-red-700
  active:scale-[0.98] active:bg-red-800"

## 3. Input и Select — focus и active эффекты

В Input.tsx:

className="w-full px-4 py-3 border border-gray-300 rounded-lg
  transition-all duration-150
  hover:border-gray-400
  focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500
  active:ring-2 active:ring-primary-500"

В Select.tsx:

className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white
  transition-all duration-150
  hover:border-gray-400
  focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500
  active:ring-2 active:ring-primary-500"

## 4. Нижняя навигация (BottomNav) — active эффекты

В BottomNav.tsx для каждого пункта меню:

<Link 
  to="/orders"
  className={`flex flex-col items-center py-2 px-4 transition-all duration-150
    ${isActive 
      ? 'text-primary-600' 
      : 'text-gray-500 hover:text-gray-700 active:scale-[0.95] active:text-gray-800'
    }`}
>
  <ClipboardDocumentListIcon className="w-6 h-6" />
  <span className="text-xs mt-1">Заказы</span>
</Link>

## 5. Кнопка "Назад" — hover и active

В PageHeader.tsx или где используется кнопка назад:

<button 
  onClick={() => navigate(-1)}
  className="p-2 rounded-full transition-all duration-150
    hover:bg-gray-100
    active:scale-[0.95] active:bg-gray-200"
>
  <ArrowLeftIcon className="w-6 h-6" />
</button>

## 6. Карточки заказов (OrderCard) — стрелка и эффекты

<Link 
  to={`/orders/${order.id}`}
  className="block p-4 bg-white rounded-lg shadow-sm
    transition-all duration-150
    hover:bg-gray-50 hover:shadow-md
    active:scale-[0.98] active:bg-gray-100"
>
  <div className="flex items-center justify-between">
    <div className="flex-1">
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500">#{order.id}</span>
        <Badge status={order.status}>{order.statusName}</Badge>
      </div>
      <h3 className="font-medium mt-1">{order.clientName}</h3>
      <p className="text-sm text-gray-500">{order.clientAddress}</p>
      <p className="text-sm text-gray-500">{formatDate(order.visitDate)}</p>
    </div>
    <ChevronRightIcon className="w-5 h-5 text-gray-400" />
  </div>
</Link>

## 7. Элементы выбора в Wizard (тип жалюзи, материал, цвет и т.д.)

Если это карточки/кнопки выбора:

<button
  onClick={() => selectOption(option.id)}
  className={`w-full p-4 rounded-lg border-2 text-left
    transition-all duration-150
    ${isSelected 
      ? 'border-primary-600 bg-primary-50' 
      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50 active:scale-[0.98] active:bg-gray-100'
    }`}
>
  {option.name}
</button>

## 8. Checkbox и его label

<label className="flex items-center gap-3 p-3 rounded-lg cursor-pointer
  transition-all duration-150
  hover:bg-gray-50
  active:bg-gray-100">
  <input 
    type="checkbox" 
    className="w-5 h-5 rounded border-gray-300 text-primary-600 
      focus:ring-primary-500 transition-all duration-150"
  />
  <span>Монтаж (+50 000 сум)</span>
</label>

## Общие принципы:

1. Все интерактивные элементы: `transition-all duration-150`
2. Hover: изменение фона или border
3. Active: `scale-[0.98]` или `scale-[0.95]` + затемнение фона
4. Нажимные карточки: добавить ChevronRightIcon справа
5. Информационные карточки: оставить без стрелки и без cursor-pointer