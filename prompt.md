Добавь функционал для администратора и страницу отслеживания для клиента.

## 1. Обнови типы (src/types/index.ts)

// Обнови User
interface User {
  id: number;
  username: string;
  fullName: string;
  role: 'admin' | 'installer';
  preferredLanguageCode: string;
}

// Добавь
interface Installer {
  id: number;
  username: string;
  fullName: string;
}

interface CompanyInfo {
  name: string;
  phone: string;
  workingHours: string;
}

interface TrackingOrder {
  id: number;
  trackingCode: string;
  clientName: string;
  clientPhone: string;
  clientAddress: string;
  notes: string | null;
  visitDate: string;
  status: 'new' | 'in_progress' | 'measured' | 'completed';
  statusName: string;
  windows: Window[];
  totalPrice: number;
}

## 2. Обнови authStore.ts

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isInstaller: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'),
  isAdmin: false,
  isInstaller: false,
  
  login: (user, token) => {
    localStorage.setItem('token', token);
    set({ 
      user, 
      token, 
      isAuthenticated: true,
      isAdmin: user.role === 'admin',
      isInstaller: user.role === 'installer',
    });
  },
  
  logout: () => {
    localStorage.removeItem('token');
    set({ 
      user: null, 
      token: null, 
      isAuthenticated: false,
      isAdmin: false,
      isInstaller: false,
    });
  },
}));

## 3. Добавь API функции (src/api/)

Создай src/api/users.api.ts:

import { api } from './client';
import { Installer } from '../types';

export const getInstallers = async (): Promise<Installer[]> => {
  const response = await api.get('/users/installers');
  return response.data.installers;
};

Обнови src/api/orders.api.ts:

// Получить заказ по tracking code (публичный)
export const getOrderByTrackingCode = async (trackingCode: string, lang: string) => {
  const response = await api.get(`/orders/track/${trackingCode}?lang=${lang}`);
  return response.data;
};

// Создать заказ (админ)
export const createOrder = async (data: {
  clientName: string;
  clientPhone: string;
  clientAddress: string;
  notes?: string;
  visitDate: string;
  assignedUserId?: number;
}) => {
  const response = await api.post('/orders', data);
  return response.data;
};

// Обновить заказ (админ)
export const updateOrder = async (id: number, data: {
  clientName?: string;
  clientPhone?: string;
  clientAddress?: string;
  notes?: string;
  visitDate?: string;
  assignedUserId?: number;
}) => {
  const response = await api.put(`/orders/${id}`, data);
  return response.data;
};

// Удалить заказ (админ)
export const deleteOrder = async (id: number) => {
  const response = await api.delete(`/orders/${id}`);
  return response.data;
};

// Завершить заказ (админ)
export const completeOrder = async (id: number) => {
  const response = await api.patch(`/orders/${id}/complete`);
  return response.data;
};

## 4. Обнови роутинг (App.tsx)

<Routes>
  {/* Публичный роут для клиента */}
  <Route path="/track/:trackingCode" element={<TrackingPage />} />
  
  <Route path="/login" element={<LoginPage />} />
  
  <Route element={<ProtectedRoute />}>
    <Route path="/" element={<Navigate to="/orders" />} />
    <Route path="/orders" element={<OrdersPage />} />
    <Route path="/orders/new" element={<OrderFormPage />} />
    <Route path="/orders/:orderId" element={<OrderDetailPage />} />
    <Route path="/orders/:orderId/edit" element={<OrderFormPage />} />
    <Route path="/orders/:orderId/windows/new" element={<WindowWizardPage />} />
    <Route path="/orders/:orderId/windows/:windowId" element={<WindowViewPage />} />
    <Route path="/orders/:orderId/windows/:windowId/edit" element={<WindowWizardPage />} />
    <Route path="/orders/:orderId/summary" element={<SummaryPage />} />
    <Route path="/profile" element={<ProfilePage />} />
  </Route>
</Routes>

## 5. Обнови OrdersPage.tsx

import { useAuthStore } from '../stores/authStore';

export const OrdersPage = () => {
  const { isAdmin, isInstaller } = useAuthStore();
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [installerFilter, setInstallerFilter] = useState<string>('');
  const [search, setSearch] = useState('');
  
  const { data: installers } = useQuery({
    queryKey: ['installers'],
    queryFn: getInstallers,
    enabled: isAdmin,
  });

  return (
    <PageTransition>
      <div className="p-4 pb-24">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">{t('orders.title')}</h1>
          
          {/* Кнопка создания заказа - только для админа */}
          {isAdmin && (
            <Link to="/orders/new">
              <Button>
                <PlusIcon className="w-5 h-5 mr-2" />
                {t('orders.create')}
              </Button>
            </Link>
          )}
        </div>

        {/* Фильтры */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
          <Input
            placeholder={t('orders.search')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="mb-3"
          />
          
          <div className="flex gap-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg"
            >
              <option value="">{t('orders.allStatuses')}</option>
              <option value="new">{t('status.new')}</option>
              <option value="in_progress">{t('status.in_progress')}</option>
              <option value="measured">{t('status.measured')}</option>
              <option value="completed">{t('status.completed')}</option>
            </select>
            
            {/* Фильтр по замерщику - только для админа */}
            {isAdmin && installers && (
              <select
                value={installerFilter}
                onChange={(e) => setInstallerFilter(e.target.value)}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg"
              >
                <option value="">{t('orders.allInstallers')}</option>
                {installers.map((installer) => (
                  <option key={installer.id} value={installer.id}>
                    {installer.fullName}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>

        {/* Список заказов */}
        <div className="space-y-4">
          {orders?.map((order, index) => (
            <OrderCard key={order.id} order={order} showInstaller={isAdmin} />
          ))}
        </div>
      </div>
    </PageTransition>
  );
};

## 6. Создай OrderFormPage.tsx

Создай src/pages/OrderFormPage.tsx:

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { getOrderById, createOrder, updateOrder } from '../api/orders.api';
import { getInstallers } from '../api/users.api';
import { PageTransition } from '../components/ui/PageTransition';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { ArrowLeftIcon, ClipboardIcon, CheckIcon } from '@heroicons/react/24/outline';

export const OrderFormPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const isEditMode = !!orderId;

  const [formData, setFormData] = useState({
    clientName: '',
    clientPhone: '',
    clientAddress: '',
    notes: '',
    visitDate: '',
    assignedUserId: '',
  });

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [trackingLink, setTrackingLink] = useState('');
  const [copied, setCopied] = useState(false);

  // Загрузить данные заказа при редактировании
  const { data: order } = useQuery({
    queryKey: ['order', orderId],
    queryFn: () => getOrderById(Number(orderId)),
    enabled: isEditMode,
  });

  // Загрузить список замерщиков
  const { data: installers } = useQuery({
    queryKey: ['installers'],
    queryFn: getInstallers,
  });

  // Заполнить форму при редактировании
  useEffect(() => {
    if (order) {
      setFormData({
        clientName: order.clientName,
        clientPhone: order.clientPhone,
        clientAddress: order.clientAddress,
        notes: order.notes || '',
        visitDate: order.visitDate,
        assignedUserId: order.assignedUserId?.toString() || '',
      });
    }
  }, [order]);

  // Мутации
  const createMutation = useMutation({
    mutationFn: createOrder,
    onSuccess: (data) => {
      const link = `${window.location.origin}/track/${data.trackingCode}`;
      setTrackingLink(link);
      setShowSuccessModal(true);
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: any) => updateOrder(Number(orderId), data),
    onSuccess: () => {
      navigate(`/orders/${orderId}`);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const data = {
      ...formData,
      assignedUserId: formData.assignedUserId ? Number(formData.assignedUserId) : undefined,
    };

    if (isEditMode) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(trackingLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCloseModal = () => {
    setShowSuccessModal(false);
    navigate('/orders');
  };

  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col">
        {/* Header */}
        <div className="flex items-center gap-3 p-4 border-b">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-full hover:bg-gray-100 active:scale-95 transition-all"
          >
            <ArrowLeftIcon className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-semibold">
            {isEditMode ? t('orders.edit') : t('orders.create')}
          </h1>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 p-4">
          <div className="space-y-4 max-w-2xl mx-auto">
            <Input
              label={t('orders.clientName')}
              value={formData.clientName}
              onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
              required
            />

            <Input
              label={t('orders.clientPhone')}
              type="tel"
              value={formData.clientPhone}
              onChange={(e) => setFormData({ ...formData, clientPhone: e.target.value })}
              placeholder="+998 90 123 45 67"
              required
            />

            <Input
              label={t('orders.clientAddress')}
              value={formData.clientAddress}
              onChange={(e) => setFormData({ ...formData, clientAddress: e.target.value })}
              required
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('orders.notes')}
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                rows={3}
              />
            </div>

            <Input
              label={t('orders.visitDate')}
              type="date"
              value={formData.visitDate}
              onChange={(e) => setFormData({ ...formData, visitDate: e.target.value })}
              required
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('orders.assignedInstaller')}
              </label>
              <select
                value={formData.assignedUserId}
                onChange={(e) => setFormData({ ...formData, assignedUserId: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              >
                <option value="">{t('orders.notAssigned')}</option>
                {installers?.map((installer) => (
                  <option key={installer.id} value={installer.id}>
                    {installer.fullName}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="border-t bg-white p-4">
          <div className="max-w-2xl mx-auto">
            <Button
              type="submit"
              onClick={handleSubmit}
              className="w-full"
              isLoading={createMutation.isPending || updateMutation.isPending}
            >
              {isEditMode ? t('common.save') : t('orders.create')}
            </Button>
          </div>
        </div>

        {/* Success Modal with Tracking Link */}
        <Modal isOpen={showSuccessModal} onClose={handleCloseModal}>
          <h3 className="text-lg font-semibold mb-2">{t('orders.created')}</h3>
          <p className="text-gray-600 mb-4">{t('orders.trackingLinkDescription')}</p>
          
          <div className="bg-gray-100 rounded-lg p-3 mb-4 flex items-center gap-2">
            <input
              type="text"
              value={trackingLink}
              readOnly
              className="flex-1 bg-transparent text-sm truncate"
            />
            <button
              onClick={handleCopyLink}
              className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
            >
              {copied ? (
                <CheckIcon className="w-5 h-5 text-green-600" />
              ) : (
                <ClipboardIcon className="w-5 h-5 text-gray-600" />
              )}
            </button>
          </div>

          <Button onClick={handleCloseModal} className="w-full">
            {t('common.done')}
          </Button>
        </Modal>
      </div>
    </PageTransition>
  );
};

## 7. Обнови OrderDetailPage.tsx

Добавь кнопки для админа:

const { isAdmin, isInstaller } = useAuthStore();
const [showDeleteModal, setShowDeleteModal] = useState(false);
const [showCompleteModal, setShowCompleteModal] = useState(false);

const deleteMutation = useMutation({
  mutationFn: () => deleteOrder(order.id),
  onSuccess: () => navigate('/orders'),
});

const completeMutation = useMutation({
  mutationFn: () => completeOrder(order.id),
  onSuccess: () => refetch(),
});

const isCompleted = order?.status === 'completed';

// В JSX после информации о клиенте:
{isAdmin && (
  <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
    <h3 className="font-medium mb-3">{t('orders.trackingLink')}</h3>
    <div className="bg-gray-100 rounded-lg p-3 flex items-center gap-2">
      <input
        type="text"
        value={`${window.location.origin}/track/${order.trackingCode}`}
        readOnly
        className="flex-1 bg-transparent text-sm truncate"
      />
      <button onClick={handleCopyTrackingLink} className="p-2 hover:bg-gray-200 rounded-lg">
        <ClipboardIcon className="w-5 h-5" />
      </button>
    </div>
  </div>
)}

// Кнопки внизу для админа:
{isAdmin && !isCompleted && (
  <div className="bg-white rounded-lg shadow-sm p-4 mb-4 space-y-3">
    <Button 
      variant="secondary" 
      className="w-full"
      onClick={() => navigate(`/orders/${order.id}/edit`)}
    >
      {t('common.edit')}
    </Button>
    
    <Button 
      variant="primary" 
      className="w-full"
      onClick={() => setShowCompleteModal(true)}
    >
      {t('orders.complete')}
    </Button>
    
    <Button 
      variant="danger" 
      className="w-full"
      onClick={() => setShowDeleteModal(true)}
    >
      {t('common.delete')}
    </Button>
  </div>
)}

{/* Модалка подтверждения завершения */}
<Modal isOpen={showCompleteModal} onClose={() => setShowCompleteModal(false)}>
  <h3 className="text-lg font-semibold mb-2">{t('orders.completeConfirmTitle')}</h3>
  <p className="text-gray-600 mb-6">{t('orders.completeConfirmMessage')}</p>
  <div className="flex flex-col gap-3">
    <Button onClick={() => completeMutation.mutate()}>
      {t('orders.complete')}
    </Button>
    <Button variant="secondary" onClick={() => setShowCompleteModal(false)}>
      {t('common.cancel')}
    </Button>
  </div>
</Modal>

{/* Модалка подтверждения удаления */}
<Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
  <h3 className="text-lg font-semibold mb-2">{t('orders.deleteConfirmTitle')}</h3>
  <p className="text-gray-600 mb-6">{t('orders.deleteConfirmMessage')}</p>
  <div className="flex flex-col gap-3">
    <Button variant="danger" onClick={() => deleteMutation.mutate()}>
      {t('common.delete')}
    </Button>
    <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
      {t('common.cancel')}
    </Button>
  </div>
</Modal>

## 8. Создай TrackingPage.tsx

Создай src/pages/TrackingPage.tsx:

import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { getOrderByTrackingCode } from '../api/orders.api';
import { PageTransition } from '../components/ui/PageTransition';
import { LoadingScreen } from '../components/ui/LoadingScreen';
import { CheckCircleIcon, ClockIcon, PhoneIcon } from '@heroicons/react/24/outline';
import { formatPrice } from '../utils/formatPrice';
import { formatDate } from '../utils/formatDate';

const statusSteps = ['new', 'in_progress', 'measured', 'completed'];

export const TrackingPage = () => {
  const { trackingCode } = useParams();
  const { t, i18n } = useTranslation();

  const { data, isLoading, error } = useQuery({
    queryKey: ['tracking', trackingCode],
    queryFn: () => getOrderByTrackingCode(trackingCode!, i18n.language),
  });

  if (isLoading) return <LoadingScreen />;

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">{t('tracking.notFound')}</h1>
          <p className="text-gray-600">{t('tracking.notFoundDescription')}</p>
        </div>
      </div>
    );
  }

  const { order, companyInfo } = data;
  const currentStepIndex = statusSteps.indexOf(order.status);

  return (
    <PageTransition>
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-lg mx-auto">
          {/* Заголовок */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold mb-1">{t('tracking.title')}</h1>
            <p className="text-gray-500">#{order.trackingCode}</p>
          </div>

          {/* Статус Timeline */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-4">
            <h2 className="font-semibold mb-4">{t('tracking.status')}</h2>
            
            <div className="space-y-4">
              {statusSteps.map((step, index) => {
                const isCompleted = index <= currentStepIndex;
                const isCurrent = index === currentStepIndex;
                
                return (
                  <div key={step} className="flex items-start gap-4">
                    {/* Иконка и линия */}
                    <div className="flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        isCompleted 
                          ? 'bg-green-500 text-white' 
                          : 'bg-gray-200 text-gray-400'
                      }`}>
                        {isCompleted ? (
                          <CheckCircleIcon className="w-5 h-5" />
                        ) : (
                          <ClockIcon className="w-5 h-5" />
                        )}
                      </div>
                      {index < statusSteps.length - 1 && (
                        <div className={`w-0.5 h-8 ${
                          index < currentStepIndex ? 'bg-green-500' : 'bg-gray-200'
                        }`} />
                      )}
                    </div>
                    
                    {/* Текст */}
                    <div className={`flex-1 pb-4 ${isCurrent ? 'font-medium' : ''}`}>
                      <p className={isCompleted ? 'text-gray-900' : 'text-gray-400'}>
                        {t(`status.${step}`)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Дата визита */}
          <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
            <h2 className="font-semibold mb-2">{t('tracking.visitDate')}</h2>
            <p className="text-gray-600">{formatDate(order.visitDate)}</p>
          </div>

          {/* Детали заказа */}
          {order.windows.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
              <h2 className="font-semibold mb-4">{t('tracking.orderDetails')}</h2>
              
              <div className="space-y-3">
                {order.windows.map((window: any) => (
                  <div 
                    key={window.id} 
                    className="flex items-center justify-between py-2 border-b last:border-0"
                  >
                    <div>
                      <p className="font-medium">{window.name}</p>
                      {window.shade && (
                        <>
                          <p className="text-sm text-gray-500">
                            {window.shade.shadeTypeName}
                          </p>
                          <p className="text-sm text-gray-500">
                            {window.shade.width} x {window.shade.height} мм
                          </p>
                        </>
                      )}
                    </div>
                    {window.shade && (
                      <p className="font-medium">
                        {formatPrice(window.shade.calculatedPrice)} сум
                      </p>
                    )}
                  </div>
                ))}
              </div>

              {/* Итого */}
              <div className="flex items-center justify-between pt-4 mt-4 border-t">
                <p className="font-semibold">{t('tracking.total')}</p>
                <p className="font-semibold text-lg">
                  {formatPrice(order.totalPrice)} сум
                </p>
              </div>
            </div>
          )}

          {/* Контакты компании */}
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h2 className="font-semibold mb-3">{t('tracking.contactUs')}</h2>
            
            <div className="space-y-2">
              <p className="font-medium">{companyInfo.name}</p>
              
              <a 
                href={`tel:${companyInfo.phone.replace(/\s/g, '')}`}
                className="flex items-center gap-2 text-primary-600"
              >
                <PhoneIcon className="w-5 h-5" />
                {companyInfo.phone}
              </a>
              
              <p className="text-sm text-gray-500">{companyInfo.workingHours}</p>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

## 9. Добавь переводы в public/locales/ru/translation.json

"orders": {
  // ... существующие
  "create": "Создать заказ",
  "edit": "Редактировать заказ",
  "created": "Заказ создан",
  "trackingLinkDescription": "Отправьте эту ссылку клиенту для отслеживания заказа:",
  "trackingLink": "Ссылка для клиента",
  "clientName": "Имя клиента",
  "clientPhone": "Телефон клиента",
  "clientAddress": "Адрес клиента",
  "notes": "Заметки",
  "visitDate": "Дата визита",
  "assignedInstaller": "Назначенный замерщик",
  "notAssigned": "Не назначен",
  "allInstallers": "Все замерщики",
  "complete": "Завершить заказ",
  "completeConfirmTitle": "Завершить заказ?",
  "completeConfirmMessage": "После завершения заказ нельзя будет редактировать или удалить.",
  "deleteConfirmTitle": "Удалить заказ?",
  "deleteConfirmMessage": "Это действие нельзя отменить."
},
"tracking": {
  "title": "Отслеживание заказа",
  "notFound": "Заказ не найден",
  "notFoundDescription": "Проверьте правильность ссылки.",
  "status": "Статус заказа",
  "visitDate": "Дата визита замерщика",
  "orderDetails": "Детали заказа",
  "total": "Итого",
  "contactUs": "Связаться с нами"
},
"common": {
  // ... существующие
  "done": "Готово"
}

Добавь аналогичные переводы для uz_cyrl и uz_latn.