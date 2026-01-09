import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import WindowDetails from '../components/windows/WindowDetails';
import PageHeader from '../components/layout/PageHeader';
import Button from '../components/ui/Button';
import LoadingScreen from '../components/ui/LoadingScreen';
import Modal from '../components/ui/Modal';
import PageTransition from '../components/ui/PageTransition';
import { toast } from '../components/ui/Toast';
import { useOrder } from '../hooks/useOrders';
import { useDeleteShade } from '../hooks/useShades';
import { useDeleteWindow } from '../hooks/useWindows';

const WindowViewPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const params = useParams();
  const orderId = params.orderId || '';
  const windowId = params.windowId || '';
  const { data: order, isLoading, isError } = useOrder(orderId);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const deleteWindow = useDeleteWindow();
  const deleteShade = useDeleteShade();

  const windowItem = useMemo(() => {
    if (!order) {
      return null;
    }
    return order.windows.find((item) => String(item.id) === windowId) || null;
  }, [order, windowId]);

  const handleDelete = async () => {
    if (!windowItem) {
      return;
    }
    try {
      if (windowItem.shade) {
        await deleteShade.mutateAsync(String(windowItem.shade.id));
      }
      await deleteWindow.mutateAsync(String(windowItem.id));
      toast.success(t('common.success'));
      navigate('/orders/' + orderId);
    } catch {
      toast.error(t('errors.network'));
    }
  };

  if (isLoading) {
    return (
      <PageTransition>
        <LoadingScreen />
      </PageTransition>
    );
  }

  if (isError || !windowItem) {
    return (
      <PageTransition>
        <p className="mx-auto max-w-xl px-4 pb-28 pt-6 text-sm text-error">{t('errors.network')}</p>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="mx-auto flex max-w-xl flex-col gap-5 px-4 pb-28 pt-6">
        <PageHeader title={windowItem.name} onBack={() => navigate('/orders/' + orderId)} />
        <WindowDetails window={windowItem} />
        <div className="grid gap-3">
          <Button onClick={() => navigate('/orders/' + orderId + '/windows/' + windowId + '/edit')}>
            {t('common.edit')}
          </Button>
          <Button variant="danger" onClick={() => setShowDeleteModal(true)}>
            {t('common.delete')}
          </Button>
        </div>
        <Modal
          isOpen={showDeleteModal}
          title={t('delete.windowTitle')}
          onClose={() => setShowDeleteModal(false)}
          actions={
            <div className="flex w-full flex-col gap-2 sm:flex-row sm:justify-end">
              <Button variant="ghost" onClick={() => setShowDeleteModal(false)}>
                {t('common.cancel')}
              </Button>
              <Button variant="danger" onClick={handleDelete}>
                {t('common.delete')}
              </Button>
            </div>
          }
        >
          {t('delete.windowMessage')}
        </Modal>
      </div>
    </PageTransition>
  );
};

export default WindowViewPage;
