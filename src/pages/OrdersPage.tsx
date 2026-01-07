import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import OrderFilters from '../components/orders/OrderFilters';
import OrderList from '../components/orders/OrderList';
import PageHeader from '../components/layout/PageHeader';
import Spinner from '../components/ui/Spinner';
import { OrdersFilters, useOrders } from '../hooks/useOrders';

const OrdersPage = () => {
  const { t } = useTranslation();
  const [filters, setFilters] = useState<OrdersFilters>({});
  const { data = [], isLoading, isError } = useOrders(filters);

  return (
    <div className="mx-auto flex max-w-xl flex-col gap-5 px-4 pb-28 pt-6">
      <PageHeader title={t('orders.title')} />
      <OrderFilters filters={filters} onChange={setFilters} />
      {isLoading ? (
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Spinner size="sm" />
          {t('common.loading')}
        </div>
      ) : null}
      {isError ? <p className="text-sm text-error">{t('errors.network')}</p> : null}
      {!isLoading && !isError ? <OrderList orders={data} /> : null}
    </div>
  );
};

export default OrdersPage;
