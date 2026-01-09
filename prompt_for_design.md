Исправь три бага в дизайне:

## 1. Стрелки в карточках заказов — по центру справа

В OrderCard.tsx измени расположение стрелки с items-start на items-center:

// Было:
<div className="flex items-start justify-between ...">

// Стало:
<div className="flex items-center justify-between ...">

Или если структура другая, убедись что ChevronRightIcon выровнен по центру:

<div className="flex items-center justify-between p-4 ...">
  <div className="flex-1">
    {/* контент карточки */}
  </div>
  <ChevronRightIcon className="w-5 h-5 text-gray-400 flex-shrink-0" />
</div>

## 2. Кнопки Wizard внизу экрана — исправь отступ от нижней панели

В WizardLayout.tsx или WindowWizardPage.tsx:

Проблема: кнопки не прижаты к низу из-за padding для BottomNav.

Решение: в Wizard не должно быть нижней панели, убери отступ снизу:

// Структура страницы Wizard должна быть:
<div className="min-h-screen flex flex-col">
  {/* Header */}
  <div className="p-4">
    <button onClick={goBack}>
      <ArrowLeftIcon className="w-6 h-6" />
    </button>
    <h1>Название окна</h1>
  </div>
  
  {/* Progress */}
  <div className="px-4">
    <WizardProgress currentStep={currentStep} totalSteps={9} />
  </div>
  
  {/* Content - растягивается */}
  <div className="flex-1 p-4 overflow-auto">
    {renderStep()}
  </div>
  
  {/* Buttons - прижаты к низу */}
  <div className="p-4 border-t bg-white">
    <div className="flex gap-4">
      <Button variant="secondary" onClick={prevStep} className="flex-1">
        Назад
      </Button>
      <Button onClick={nextStep} className="flex-1">
        Далее
      </Button>
    </div>
  </div>
</div>

Также в App.tsx или ProtectedRoute.tsx — скрывай BottomNav на страницах Wizard:

const location = useLocation();
const hideBottomNav = location.pathname.includes('/windows/new') || 
                      location.pathname.includes('/windows/') && location.pathname.includes('/edit');

return (
  <>
    <Outlet />
    {!hideBottomNav && <BottomNav />}
  </>
);

## 3. Заголовок страницы — стрелка и текст по центру вертикально

В PageHeader.tsx:

<div className="flex items-center gap-3 p-4">
  <button 
    onClick={() => navigate(-1)}
    className="p-2 -ml-2 rounded-full transition-all duration-150
      hover:bg-gray-100 active:scale-95 active:bg-gray-200"
  >
    <ArrowLeftIcon className="w-6 h-6" />
  </button>
  <h1 className="text-xl font-semibold">{title}</h1>
</div>

Убедись что:
- flex items-center выравнивает по центру вертикально
- gap-3 даёт отступ между стрелкой и текстом
- Нет лишних margin/padding которые смещают элементы

Если стрелка в отдельном круге (как на скриншоте), то:

<div className="flex items-center gap-3 p-4">
  <button 
    onClick={() => navigate(-1)}
    className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-200
      transition-all duration-150 hover:bg-gray-100 active:scale-95"
  >
    <ArrowLeftIcon className="w-5 h-5" />
  </button>
  <h1 className="text-xl font-semibold">{title}</h1>
</div>