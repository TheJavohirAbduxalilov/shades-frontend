import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import OrderFilters from '../components/orders/OrderFilters';
import OrderList from '../components/orders/OrderList';
import PageHeader from '../components/layout/PageHeader';
import PageTransition from '../components/ui/PageTransition';
import { OrderCardSkeleton } from '../components/ui/Skeleton';
import { OrdersFilters, useOrders } from '../hooks/useOrders';

const OrdersPage = () => {
  const { t } = useTranslation();
  const [filters, setFilters] = useState<OrdersFilters>({});
  const { data = [], isLoading, isError } = useOrders(filters);

  return (
    <PageTransition>
      <div className="mx-auto flex max-w-xl flex-col gap-5 px-4 pb-28 pt-6">
        <PageHeader title={t('orders.title')} />
        <OrderFilters filters={filters} onChange={setFilters} />
        {isLoading ? (
          <div className="space-y-3">
            <OrderCardSkeleton />
            <OrderCardSkeleton />
            <OrderCardSkeleton />
          </div>
        ) : isError ? (
          <p className="text-sm text-error">{t('errors.network')}</p>
        ) : (
          <OrderList orders={data} />
        )}
      </div>
    </PageTransition>
  );
};

export default OrdersPage;
