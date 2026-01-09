import { Link } from 'react-router-dom';
import { ChevronRightIcon } from '@heroicons/react/24/outline';
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
      <Card className="cursor-pointer transition-all duration-150 hover:bg-slate-50 active:scale-[0.98] active:bg-slate-100">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500">#{order.id}</span>
              <Badge tone={order.status}>{t('status.' + order.status)}</Badge>
            </div>
            <h3 className="mt-1 text-base font-semibold text-slate-900">{order.clientName}</h3>
            <p className="text-sm text-slate-500">{order.clientAddress}</p>
            <p className="mt-2 text-xs text-slate-500">
              {t('orders.visitDate')}: {formatDate(order.visitDate, i18n.language)}
            </p>
          </div>
          <ChevronRightIcon className="h-5 w-5 flex-shrink-0 text-slate-400" />
        </div>
      </Card>
    </Link>
  );
};

export default OrderCard;
