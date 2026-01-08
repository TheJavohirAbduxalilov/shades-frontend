import { useTranslation } from 'react-i18next';
import { Window } from '../../types';
import { formatPrice } from '../../utils/formatPrice';
import Card from '../ui/Card';

interface SummaryTotalProps {
  windows: Window[];
  totalPrice?: number;
}

const SummaryTotal = ({ windows, totalPrice }: SummaryTotalProps) => {
  const { t } = useTranslation();
  const calculatedTotal =
    totalPrice ??
    windows.reduce((sum, windowItem) => {
      const shade = windowItem.shade;
      const price = shade ? shade.calculatedPrice ?? shade.totalPrice ?? 0 : 0;
      return sum + price;
    }, 0);

  return (
    <Card>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-slate-600">{t('summary.totalLabel')}</span>
        <span className="text-lg font-semibold text-slate-900">
          {formatPrice(calculatedTotal)} {t('price.currency')}
        </span>
      </div>
    </Card>
  );
};

export default SummaryTotal;
