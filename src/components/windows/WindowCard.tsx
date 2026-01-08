import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Window } from '../../types';
import { formatPrice } from '../../utils/formatPrice';
import Card from '../ui/Card';

interface WindowCardProps {
  orderId: string;
  window: Window;
}

const WindowCard = ({ orderId, window }: WindowCardProps) => {
  const { t } = useTranslation();
  const shade = window.shade;
  const price = shade ? shade.calculatedPrice ?? shade.totalPrice : null;

  return (
    <Link to={'/orders/' + orderId + '/windows/' + window.id} className="block">
      <Card>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-base font-semibold text-slate-900">{window.name}</h3>
            {shade ? (
              <div className="mt-1 space-y-1 text-sm text-slate-500">
                <p>{shade.shadeTypeName}</p>
                <p>
                  {shade.width} x {shade.height}
                </p>
              </div>
            ) : (
              <p className="mt-1 text-sm text-slate-500">{t('common.loading')}</p>
            )}
          </div>
          {shade ? (
            typeof price === 'number' ? (
              <span className="text-sm font-semibold text-slate-900">
                {formatPrice(price)} {t('price.currency')}
              </span>
            ) : (
              <span className="text-xs text-slate-500">{t('price.notCalculated')}</span>
            )
          ) : null}
        </div>
      </Card>
    </Link>
  );
};

export default WindowCard;
