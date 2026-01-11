import { PhoneIcon, MapPinIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';
import { Order } from '../../types';
import Card from '../ui/Card';

interface ClientInfoProps {
  order: Order;
}

const ClientInfo = ({ order }: ClientInfoProps) => {
  const { t } = useTranslation();

  const getMapsUrl = (address: string) => {
    const encoded = encodeURIComponent(address);
    return `https://www.google.com/maps/search/?api=1&query=${encoded}`;
  };

  return (
    <Card>
      <h2 className="text-sm font-semibold text-slate-900">{t('order.clientInfo')}</h2>
      <div className="mt-3 space-y-2 text-sm text-slate-600">
        <p>
          <span className="font-medium text-slate-700">{t('order.phone')}:</span>{' '}
          <a
            href={`tel:${order.clientPhone}`}
            className="inline-flex items-center gap-1 text-primary-600 underline decoration-primary-300 underline-offset-2 transition-colors hover:text-primary-700"
          >
            {order.clientPhone}
            <PhoneIcon className="h-4 w-4" />
          </a>
        </p>
        <p>
          <span className="font-medium text-slate-700">{t('order.address')}:</span>{' '}
          <a
            href={getMapsUrl(order.clientAddress)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-primary-600 underline decoration-primary-300 underline-offset-2 transition-colors hover:text-primary-700"
          >
            {order.clientAddress}
            <MapPinIcon className="h-4 w-4" />
          </a>
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
