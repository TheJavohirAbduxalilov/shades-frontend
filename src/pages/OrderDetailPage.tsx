import { useMemo, useState } from 'react';
import { ClipboardDocumentIcon } from '@heroicons/react/24/outline';
import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { completeOrder, deleteOrder, updateOrder } from '../api/orders.api';
import ClientInfo from '../components/orders/ClientInfo';
import WindowList from '../components/windows/WindowList';
import PageHeader from '../components/layout/PageHeader';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import PageTransition from '../components/ui/PageTransition';
import { CardSkeleton, WindowCardSkeleton } from '../components/ui/Skeleton';
import { toast } from '../components/ui/Toast';
import { useOrder } from '../hooks/useOrders';
import { useAuthStore } from '../stores/authStore';

const OrderDetailPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const params = useParams();
  const orderId = params.orderId || '';
  const { data: order, isLoading, isError, refetch } = useOrder(orderId);
  const { isAdmin, isInstaller, user } = useAuthStore();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const windows = useMemo(() => order?.windows || [], [order]);
  const isCompleted = order?.status === 'completed';
  const isMeasured = order?.status === 'measured';
  const isInstallerForbidden =
    isInstaller &&
    user?.id &&
    order?.assignedUserId != null &&
    order.assignedUserId !== user.id;
  const canMarkInProgress = isInstaller && order?.status === 'new';
  const canMarkMeasured = isInstaller && order?.status === 'in_progress';
  const canManageWindows = isInstaller;

  const deleteMutation = useMutation({
    mutationFn: async () => {
      if (!order) {
        throw new Error('Order not loaded');
      }
      return deleteOrder(order.id);
    },
    onSuccess: () => {
      setShowDeleteModal(false);
      navigate('/orders');
    },
  });

  const completeMutation = useMutation({
    mutationFn: async () => {
      if (!order) {
        throw new Error('Order not loaded');
      }
      return completeOrder(order.id);
    },
    onSuccess: () => {
      setShowCompleteModal(false);
      refetch();
    },
  });

  const statusMutation = useMutation({
    mutationFn: async (nextStatus: 'in_progress' | 'measured') => {
      if (!order) {
        throw new Error('Order not loaded');
      }
      return updateOrder(order.id, { status: nextStatus });
    },
    onSuccess: () => {
      toast.success(t('common.saved'));
      refetch();
    },
    onError: () => {
      toast.error(t('errors.network'));
    },
  });

  const handleCopyTrackingLink = async () => {
    if (!order?.trackingCode) {
      return;
    }
    await navigator.clipboard.writeText(`${window.location.origin}/track/${order.trackingCode}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoading) {
    return (
      <PageTransition>
        <div className="mx-auto flex max-w-xl flex-col gap-5 px-4 pb-28 pt-6">
          <PageHeader title={t('order.clientInfo')} onBack={() => navigate('/orders')} />
          <CardSkeleton />
          <div className="space-y-3">
            <WindowCardSkeleton />
            <WindowCardSkeleton />
            <WindowCardSkeleton />
          </div>
        </div>
      </PageTransition>
    );
  }

  if (isError || !order) {
    return (
      <PageTransition>
        <p className="mx-auto max-w-xl px-4 pb-28 pt-6 text-sm text-error">{t('errors.network')}</p>
      </PageTransition>
    );
  }

  if (isInstallerForbidden) {
    return (
      <PageTransition>
        <p className="mx-auto max-w-xl px-4 pb-28 pt-6 text-sm text-error">{t('errors.unknown')}</p>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="mx-auto flex max-w-xl flex-col gap-5 px-4 pb-28 pt-6">
        <PageHeader title={t('order.clientInfo')} onBack={() => navigate('/orders')} />
        <ClientInfo order={order} />
        {isAdmin ? (
          <div className="rounded-2xl bg-white p-4 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-900">{t('orders.trackingLink')}</h3>
            <div className="mt-3 flex items-center gap-2 rounded-lg bg-slate-100 px-3 py-2">
              <input
                type="text"
                value={
                  order.trackingCode ? `${window.location.origin}/track/${order.trackingCode}` : ''
                }
                readOnly
                className="flex-1 bg-transparent text-xs text-slate-600 outline-none"
              />
              <button
                type="button"
                onClick={handleCopyTrackingLink}
                className="rounded-lg p-2 transition-colors hover:bg-slate-200"
              >
                <ClipboardDocumentIcon
                  className={`h-5 w-5 ${copied ? 'text-emerald-600' : 'text-slate-600'}`}
                />
              </button>
            </div>
          </div>
        ) : null}
        {isInstaller && (canMarkInProgress || canMarkMeasured) ? (
          <div className="grid gap-3 rounded-2xl bg-white p-4 shadow-sm">
            {canMarkInProgress ? (
              <Button
                fullWidth
                onClick={() => statusMutation.mutate('in_progress')}
                isLoading={statusMutation.isPending}
              >
                {t('status.in_progress')}
              </Button>
            ) : null}
            {canMarkMeasured ? (
              <Button
                fullWidth
                onClick={() => statusMutation.mutate('measured')}
                isLoading={statusMutation.isPending}
              >
                {t('status.measured')}
              </Button>
            ) : null}
          </div>
        ) : null}
        {isAdmin && !isCompleted ? (
          <div className="grid gap-3 rounded-2xl bg-white p-4 shadow-sm">
            <Button variant="secondary" fullWidth onClick={() => navigate(`/orders/${order.id}/edit`)}>
              {t('common.edit')}
            </Button>
            {isMeasured ? (
              <Button fullWidth onClick={() => setShowCompleteModal(true)}>
                {t('orders.complete')}
              </Button>
            ) : null}
            <Button variant="danger" fullWidth onClick={() => setShowDeleteModal(true)}>
              {t('common.delete')}
            </Button>
          </div>
        ) : null}
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-slate-900">{t('order.windows')}</h2>
          {canManageWindows ? (
            <Button size="sm" onClick={() => navigate('/orders/' + orderId + '/windows/new')}>
              {t('order.addWindow')}
            </Button>
          ) : null}
        </div>
        <WindowList orderId={orderId} windows={windows} clickable={isInstaller} />
        <Button variant="secondary" onClick={() => navigate('/orders/' + orderId + '/summary')}>
          {t('order.summary')}
        </Button>
      </div>
      <Modal
        isOpen={showCompleteModal}
        title={t('orders.completeConfirmTitle')}
        onClose={() => setShowCompleteModal(false)}
        actions={
          <div className="flex w-full flex-col gap-2 sm:flex-row sm:justify-end">
            <Button variant="secondary" onClick={() => setShowCompleteModal(false)}>
              {t('common.cancel')}
            </Button>
            <Button onClick={() => completeMutation.mutate()}>{t('orders.complete')}</Button>
          </div>
        }
      >
        {t('orders.completeConfirmMessage')}
      </Modal>
      <Modal
        isOpen={showDeleteModal}
        title={t('orders.deleteConfirmTitle')}
        onClose={() => setShowDeleteModal(false)}
        actions={
          <div className="flex w-full flex-col gap-2 sm:flex-row sm:justify-end">
            <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
              {t('common.cancel')}
            </Button>
            <Button variant="danger" onClick={() => deleteMutation.mutate()}>
              {t('common.delete')}
            </Button>
          </div>
        }
      >
        {t('orders.deleteConfirmMessage')}
      </Modal>
    </PageTransition>
  );
};

export default OrderDetailPage;
