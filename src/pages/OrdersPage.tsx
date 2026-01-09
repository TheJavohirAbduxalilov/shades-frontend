import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { PlusIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import OrderFilters from '../components/orders/OrderFilters';
import OrderList from '../components/orders/OrderList';
import PageHeader from '../components/layout/PageHeader';
import Button from '../components/ui/Button';
import PageTransition from '../components/ui/PageTransition';
import { OrderCardSkeleton } from '../components/ui/Skeleton';
import { getInstallers } from '../api/users.api';
import { OrdersFilters, useOrders } from '../hooks/useOrders';
import { useAuthStore } from '../stores/authStore';

const OrdersPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isAdmin, isInstaller, user } = useAuthStore();
  const [filters, setFilters] = useState<OrdersFilters>({});
  const effectiveFilters = useMemo(() => {
    if (!isAdmin && isInstaller && user?.id) {
      return { ...filters, assignedUserId: String(user.id) };
    }
    return filters;
  }, [filters, isAdmin, isInstaller, user?.id]);
  const { data = [], isLoading, isError } = useOrders(effectiveFilters);
  const { data: installers = [] } = useQuery({
    queryKey: ['installers'],
    queryFn: getInstallers,
    enabled: isAdmin,
  });

  return (
    <PageTransition>
      <div className="mx-auto flex max-w-xl flex-col gap-5 px-4 pb-28 pt-6">
        <PageHeader
          title={t('orders.title')}
          actions={
            isAdmin ? (
              <Button size="sm" className="gap-2" onClick={() => navigate('/orders/new')}>
                <PlusIcon className="h-5 w-5" />
                {t('orders.create')}
              </Button>
            ) : null
          }
        />
        <OrderFilters
          filters={filters}
          onChange={setFilters}
          installers={installers}
          showInstallerFilter={isAdmin}
        />
        {isLoading ? (
          <div className="space-y-3">
            <OrderCardSkeleton />
            <OrderCardSkeleton />
            <OrderCardSkeleton />
          </div>
        ) : isError ? (
          <p className="text-sm text-error">{t('errors.network')}</p>
        ) : (
          <OrderList orders={data} showInstaller={isAdmin} />
        )}
      </div>
    </PageTransition>
  );
};

export default OrdersPage;
