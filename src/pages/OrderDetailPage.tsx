import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import ClientInfo from '../components/orders/ClientInfo';
import WindowList from '../components/windows/WindowList';
import PageHeader from '../components/layout/PageHeader';
import Button from '../components/ui/Button';
import PageTransition from '../components/ui/PageTransition';
import { CardSkeleton, WindowCardSkeleton } from '../components/ui/Skeleton';
import { useOrder } from '../hooks/useOrders';

const OrderDetailPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const params = useParams();
  const orderId = params.orderId || '';
  const { data: order, isLoading, isError } = useOrder(orderId);

  const windows = useMemo(() => order?.windows || [], [order]);

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

  return (
    <PageTransition>
      <div className="mx-auto flex max-w-xl flex-col gap-5 px-4 pb-28 pt-6">
        <PageHeader title={t('order.clientInfo')} onBack={() => navigate('/orders')} />
        <ClientInfo order={order} />
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-slate-900">{t('order.windows')}</h2>
          <Button size="sm" onClick={() => navigate('/orders/' + orderId + '/windows/new')}>
            {t('order.addWindow')}
          </Button>
        </div>
        <WindowList orderId={orderId} windows={windows} />
        <Button variant="secondary" onClick={() => navigate('/orders/' + orderId + '/summary')}>
          {t('order.summary')}
        </Button>
      </div>
    </PageTransition>
  );
};

export default OrderDetailPage;
