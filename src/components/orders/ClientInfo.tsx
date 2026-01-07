import { useTranslation } from 'react-i18next';
import { Order } from '../../types';
import Card from '../ui/Card';

interface ClientInfoProps {
  order: Order;
}

const ClientInfo = ({ order }: ClientInfoProps) => {
  const { t } = useTranslation();

  return (
    <Card>
      <h2 className="text-sm font-semibold text-slate-900">{t('order.clientInfo')}</h2>
      <div className="mt-3 space-y-2 text-sm text-slate-600">
        <p>
          <span className="font-medium text-slate-700">{t('order.phone')}:</span> {order.clientPhone}
        </p>
        <p>
          <span className="font-medium text-slate-700">{t('order.address')}:</span> {order.clientAddress}
        </p>
        {order.notes ? (
          <p>
            <span className="font-medium text-slate-700">{t('order.notes')}:</span> {order.notes}
          </p>
        ) : null}
      </div>
    </Card>
  );
};

export default ClientInfo;
