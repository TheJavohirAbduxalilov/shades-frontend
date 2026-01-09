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
      {orders.map((order, index) => (
        <div
          key={order.id}
          className="animate-slideUp"
          style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'both' }}
        >
          <OrderCard order={order} />
        </div>
      ))}
    </div>
  );
};

export default OrderList;
