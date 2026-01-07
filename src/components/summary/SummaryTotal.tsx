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
    windows.reduce((sum, windowItem) => sum + (windowItem.shade ? windowItem.shade.calculatedPrice : 0), 0);

  return (
    <Card>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-slate-600">{t('summary.total')}</span>
        <span className="text-lg font-semibold text-slate-900">{formatPrice(calculatedTotal)}</span>
      </div>
    </Card>
  );
};

export default SummaryTotal;
