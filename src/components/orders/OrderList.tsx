import { useTranslation } from 'react-i18next';
import { Order } from '../../types';
import OrderCard from './OrderCard';

interface OrderListProps {
  orders: Order[];
}

const OrderList = ({ orders }: OrderListProps) => {
  const { t } = useTranslation();

  if (!orders.length) {
    return <p className="text-sm text-slate-500">{t('orders.noOrders')}</p>;
  }

  return (
    <div className="space-y-3">
      {orders.map((order) => (
        <OrderCard key={order.id} order={order} />
      ))}
    </div>
  );
};

export default OrderList;
