import { useTranslation } from 'react-i18next';
import { Window } from '../../types';
import { formatPrice } from '../../utils/formatPrice';
import Card from '../ui/Card';

interface SummaryListProps {
  windows: Window[];
}

const SummaryList = ({ windows }: SummaryListProps) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-3">
      {windows.map((windowItem) => {
        const shade = windowItem.shade;
        const price = shade ? shade.calculatedPrice ?? shade.totalPrice : null;
        return (
          <Card key={windowItem.id}>
            <div className="space-y-2 text-sm text-slate-600">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-base font-semibold text-slate-900">{windowItem.name}</p>
                  {shade ? <p className="text-sm text-slate-500">{shade.shadeTypeName}</p> : null}
                </div>
                <span className="text-sm font-semibold text-slate-900">
                  {shade && typeof price === 'number'
                    ? formatPrice(price) + ' ' + t('price.currency')
                    : t('price.notCalculated')}
                </span>
              </div>
              {shade ? (
                <div className="space-y-1">
                  <p>
                    {t('window.dimensions')}: {shade.width} x {shade.height}
                  </p>
                  <p>
                    {t('wizard.material')}: {shade.materialName}
                  </p>
                  <p>
                    {t('wizard.color')}: {shade.colorName}
                  </p>
                </div>
              ) : null}
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default SummaryList;
