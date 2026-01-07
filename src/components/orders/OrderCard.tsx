import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Order } from '../../types';
import { formatDate } from '../../utils/formatDate';
import Badge from '../ui/Badge';
import Card from '../ui/Card';

interface OrderCardProps {
  order: Order;
}

const OrderCard = ({ order }: OrderCardProps) => {
  const { t, i18n } = useTranslation();

  return (
    <Link to={'/orders/' + order.id} className="block">
      <Card>
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs text-slate-500">#{order.id}</p>
            <h3 className="text-base font-semibold text-slate-900">{order.clientName}</h3>
            <p className="text-sm text-slate-500">{order.clientAddress}</p>
            <p className="mt-2 text-xs text-slate-500">
              {t('orders.visitDate')}: {formatDate(order.visitDate, i18n.language)}
            </p>
          </div>
          <Badge tone={order.status}>{t('status.' + order.status)}</Badge>
        </div>
      </Card>
    </Link>
  );
};

export default OrderCard;
