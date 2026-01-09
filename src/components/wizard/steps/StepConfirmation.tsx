import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Catalog } from '../../../types';
import useWizardStore from '../../../stores/wizardStore';
import { formatPrice } from '../../../utils/formatPrice';
import { calculatePrice } from '../../../api/shades.api';
import Card from '../../ui/Card';
import Spinner from '../../ui/Spinner';

interface StepConfirmationProps {
  catalog?: Catalog;
}

const StepConfirmation = ({ catalog }: StepConfirmationProps) => {
  const { t } = useTranslation();
  const data = useWizardStore((state) => state.data);

  const payload = useMemo(
    () => ({
      shadeTypeId: data.shadeTypeId,
      options: data.options,
      width: data.width,
      height: data.height,
      materialVariantId: data.materialVariantId,
      installationIncluded: data.installationIncluded,
      removalIncluded: data.removalIncluded,
    }),
    [
      data.shadeTypeId,
      data.options,
      data.width,
      data.height,
      data.materialVariantId,
      data.installationIncluded,
      data.removalIncluded,
    ]
  );

  const priceEnabled = Boolean(data.shadeTypeId && data.width && data.height && data.materialVariantId);
  const {
    data: priceData,
    isLoading: priceLoading,
    isError: priceError,
  } = useQuery({
    queryKey: [
      'price',
      data.shadeTypeId,
      data.width,
      data.height,
      data.materialVariantId,
      data.installationIncluded,
      data.removalIncluded,
    ],
    queryFn: () => calculatePrice(payload),
    enabled: priceEnabled,
  });

  const shadeType = catalog?.shadeTypes.find((item) => item.id === data.shadeTypeId);
  const material = catalog?.materials.find((item) => item.id === data.materialId);
  const variant = material?.variants.find((item) => item.id === data.materialVariantId);

  const optionSummaries = data.options
    .map((option) => {
      const optionType = shadeType?.optionTypes.find((item) => item.id === option.optionTypeId);
      const value = optionType?.values.find((item) => item.id === option.optionValueId);
      if (!optionType || !value) {
        return null;
      }
      return optionType.name + ': ' + value.name;
    })
    .filter(Boolean) as string[];

  return (
    <div className="space-y-4">
      <Card>
        <div className="space-y-2 text-sm text-slate-600">
          <p>
            <span className="font-medium text-slate-700">{t('wizard.windowName')}:</span> {data.windowName}
          </p>
          {shadeType ? (
            <p>
              <span className="font-medium text-slate-700">{t('wizard.shadeType')}:</span> {shadeType.name}
            </p>
          ) : null}
          {data.width && data.height ? (
            <p>
              <span className="font-medium text-slate-700">{t('window.dimensions')}:</span> {data.width} x
              {data.height} мм
            </p>
          ) : null}
          {optionSummaries.length ? (
            <div>
              <span className="font-medium text-slate-700">{t('wizard.installation')}:</span>
              <div className="mt-1 space-y-1">
                {optionSummaries.map((item) => (
                  <p key={item}>{item}</p>
                ))}
              </div>
            </div>
          ) : null}
          {material ? (
            <p>
              <span className="font-medium text-slate-700">{t('wizard.material')}:</span> {material.name}
            </p>
          ) : null}
          {variant ? (
            <p>
              <span className="font-medium text-slate-700">{t('wizard.color')}:</span> {variant.colorName}
            </p>
          ) : null}
          <div className="flex flex-wrap gap-3 text-sm text-slate-600">
            {data.installationIncluded ? <span>{t('services.installation')}</span> : null}
            {data.removalIncluded ? <span>{t('services.removal')}</span> : null}
          </div>
        </div>
      </Card>
      <Card>
        {priceError ? (
          <p className="text-sm text-error">{t('errors.network')}</p>
        ) : priceLoading ? (
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Spinner size="sm" />
            {t('price.calculating')}
          </div>
        ) : priceData ? (
          <div className="space-y-2 text-sm text-slate-600">
            <p>{t('price.area', { value: priceData.area.toFixed(2) })}</p>
            <p className="text-base font-semibold text-slate-900">
              {t('price.total', {
                value: formatPrice(priceData.totalPrice),
                currency: t('price.currency'),
              })}
            </p>
            {priceData.breakdown?.minPriceApplied ? (
              <p className="text-xs text-slate-500">{t('price.minPriceApplied')}</p>
            ) : null}
          </div>
        ) : (
          <p className="text-sm text-slate-500">{t('price.notCalculated')}</p>
        )}
      </Card>
    </div>
  );
};

export default StepConfirmation;
