import { useTranslation } from 'react-i18next';
import { Window } from '../../types';
import { formatPrice } from '../../utils/formatPrice';
import Card from '../ui/Card';

interface WindowDetailsProps {
  window: Window;
}

const WindowDetails = ({ window }: WindowDetailsProps) => {
  const { t } = useTranslation();
  const shade = window.shade;
  const price = shade ? shade.calculatedPrice ?? shade.totalPrice : null;

  if (!shade) {
    return <p className="text-sm text-slate-500">{t('order.noWindows')}</p>;
  }

  return (
    <Card>
      <div className="space-y-3 text-sm text-slate-600">
        <p>
          <span className="font-medium text-slate-700">{t('window.name')}:</span> {window.name}
        </p>
        <p>
          <span className="font-medium text-slate-700">{t('wizard.shadeType')}:</span> {shade.shadeTypeName}
        </p>
        <p>
          <span className="font-medium text-slate-700">{t('window.dimensions')}:</span> {shade.width} x
          {shade.height}
        </p>
        <div>
          <span className="font-medium text-slate-700">{t('wizard.installation')}:</span>
          <div className="mt-1 space-y-1">
            {shade.options.map((option) => (
              <p key={option.optionTypeId} className="text-sm text-slate-600">
                {option.optionTypeName}: {option.optionValueName}
              </p>
            ))}
          </div>
        </div>
        <p>
          <span className="font-medium text-slate-700">{t('wizard.material')}:</span> {shade.materialName}
        </p>
        <p>
          <span className="font-medium text-slate-700">{t('wizard.color')}:</span> {shade.colorName}
        </p>
        <div className="flex flex-wrap gap-3 text-sm text-slate-600">
          {shade.installationIncluded ? <span>{t('services.installation')}</span> : null}
          {shade.removalIncluded ? <span>{t('services.removal')}</span> : null}
        </div>
        {typeof shade.area === 'number' ? <p>{t('price.area', { value: shade.area.toFixed(2) })}</p> : null}
        <p className="text-base font-semibold text-slate-900">
          {typeof price === 'number'
            ? t('price.total', { value: formatPrice(price), currency: t('price.currency') })
            : t('price.notCalculated')}
        </p>
      </div>
    </Card>
  );
};

export default WindowDetails;
