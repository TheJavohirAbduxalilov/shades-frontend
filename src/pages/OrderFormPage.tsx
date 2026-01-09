import { useEffect, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { CheckIcon, ClipboardDocumentIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { createOrder, getOrderById, updateOrder } from '../api/orders.api';
import { getInstallers } from '../api/users.api';
import PageHeader from '../components/layout/PageHeader';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import LoadingScreen from '../components/ui/LoadingScreen';
import Modal from '../components/ui/Modal';
import PageTransition from '../components/ui/PageTransition';
import Select from '../components/ui/Select';
import useAuthStore from '../stores/authStore';

const OrderFormPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const params = useParams();
  const orderId = params.orderId;
  const isEditMode = Boolean(orderId);
  const isAdmin = useAuthStore((state) => state.isAdmin);

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

  const { data: order, isLoading, isError } = useQuery({
    queryKey: ['order', orderId],
    queryFn: () => getOrderById(Number(orderId)),
    enabled: isEditMode,
  });

  const { data: installers = [] } = useQuery({
    queryKey: ['installers'],
    queryFn: getInstallers,
    enabled: isAdmin,
  });

  useEffect(() => {
    if (!order) {
      return;
    }
    setFormData({
      clientName: order.clientName || '',
      clientPhone: order.clientPhone || '',
      clientAddress: order.clientAddress || '',
      notes: order.notes || '',
      visitDate: order.visitDate || '',
      assignedUserId: order.assignedUserId ? String(order.assignedUserId) : '',
    });
  }, [order]);

  const createMutation = useMutation({
    mutationFn: createOrder,
    onSuccess: (data) => {
      const link = `${window.location.origin}/track/${data.trackingCode}`;
      setTrackingLink(link);
      setShowSuccessModal(true);
    },
  });

  const updateMutation = useMutation({
    mutationFn: (payload: Parameters<typeof updateOrder>[1]) => updateOrder(orderId || '', payload),
    onSuccess: () => {
      navigate('/orders/' + orderId);
    },
  });

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const payload = {
      clientName: formData.clientName,
      clientPhone: formData.clientPhone,
      clientAddress: formData.clientAddress,
      notes: formData.notes ? formData.notes : undefined,
      visitDate: formData.visitDate,
      assignedUserId: formData.assignedUserId ? Number(formData.assignedUserId) : undefined,
    };

    if (isEditMode) {
      updateMutation.mutate(payload);
      return;
    }

    createMutation.mutate(payload);
  };

  const handleCopyLink = async () => {
    if (!trackingLink) {
      return;
    }
    await navigator.clipboard.writeText(trackingLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCloseModal = () => {
    setShowSuccessModal(false);
    navigate('/orders');
  };

  if (isEditMode && isLoading) {
    return (
      <PageTransition>
        <LoadingScreen />
      </PageTransition>
    );
  }

  if (isEditMode && isError) {
    return (
      <PageTransition>
        <p className="mx-auto max-w-xl px-4 pb-28 pt-6 text-sm text-error">{t('errors.network')}</p>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="flex min-h-screen flex-col">
        <div className="border-b border-slate-200 bg-white">
          <div className="mx-auto w-full max-w-2xl px-4 py-4">
            <PageHeader
              title={isEditMode ? t('orders.edit') : t('orders.create')}
              onBack={() => navigate(-1)}
            />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex-1">
          <div className="mx-auto w-full max-w-2xl space-y-4 px-4 py-6">
            <Input
              label={t('orders.clientName')}
              value={formData.clientName}
              onChange={(event) => setFormData({ ...formData, clientName: event.target.value })}
              required
            />
            <Input
              label={t('orders.clientPhone')}
              type="tel"
              value={formData.clientPhone}
              onChange={(event) => setFormData({ ...formData, clientPhone: event.target.value })}
              placeholder="+998 90 123 45 67"
              required
            />
            <Input
              label={t('orders.clientAddress')}
              value={formData.clientAddress}
              onChange={(event) => setFormData({ ...formData, clientAddress: event.target.value })}
              required
            />
            <label className="block text-sm text-slate-700">
              <span className="mb-2 block font-medium">{t('orders.notes')}</span>
              <textarea
                value={formData.notes}
                onChange={(event) => setFormData({ ...formData, notes: event.target.value })}
                className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition-all duration-150 focus:border-primary-500 focus:ring-2 focus:ring-primary-500 active:ring-2 active:ring-primary-500"
                rows={3}
              />
            </label>
            <Input
              label={t('orders.visitDate')}
              type="date"
              value={formData.visitDate}
              onChange={(event) => setFormData({ ...formData, visitDate: event.target.value })}
              required
            />
            {isAdmin ? (
              <Select
                label={t('orders.assignedInstaller')}
                value={formData.assignedUserId}
                onChange={(event) => setFormData({ ...formData, assignedUserId: event.target.value })}
              >
                <option value="">{t('orders.notAssigned')}</option>
                {installers.map((installer) => (
                  <option key={installer.id} value={installer.id}>
                    {installer.fullName}
                  </option>
                ))}
              </Select>
            ) : null}
          </div>
        </form>

        <div className="border-t border-slate-200 bg-white">
          <div className="mx-auto w-full max-w-2xl px-4 py-4">
            <Button
              type="submit"
              fullWidth
              isLoading={createMutation.isPending || updateMutation.isPending}
            >
              {isEditMode ? t('common.save') : t('orders.create')}
            </Button>
          </div>
        </div>

        <Modal
          isOpen={showSuccessModal}
          title={t('orders.created')}
          onClose={handleCloseModal}
          actions={
            <Button fullWidth onClick={handleCloseModal}>
              {t('common.done')}
            </Button>
          }
        >
          <p className="mb-4 text-sm text-slate-600">{t('orders.trackingLinkDescription')}</p>
          <div className="flex items-center gap-2 rounded-lg bg-slate-100 px-3 py-2">
            <input
              type="text"
              value={trackingLink}
              readOnly
              className="flex-1 bg-transparent text-xs text-slate-600 outline-none"
            />
            <button
              type="button"
              onClick={handleCopyLink}
              className="rounded-lg p-2 transition-colors hover:bg-slate-200"
            >
              {copied ? (
                <CheckIcon className="h-5 w-5 text-emerald-600" />
              ) : (
                <ClipboardDocumentIcon className="h-5 w-5 text-slate-600" />
              )}
            </button>
          </div>
        </Modal>
      </div>
    </PageTransition>
  );
};

export default OrderFormPage;
