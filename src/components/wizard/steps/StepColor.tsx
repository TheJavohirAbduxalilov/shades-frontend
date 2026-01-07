import { useTranslation } from 'react-i18next';
import { Catalog } from '../../../types';
import useWizardStore from '../../../stores/wizardStore';
import Spinner from '../../ui/Spinner';

interface StepColorProps {
  catalog?: Catalog;
  error?: string;
}

const StepColor = ({ catalog, error }: StepColorProps) => {
  const { t } = useTranslation();
  const data = useWizardStore((state) => state.data);
  const updateData = useWizardStore((state) => state.updateData);

  if (!catalog) {
    return (
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <Spinner size="sm" />
        {t('common.loading')}
      </div>
    );
  }

  const material = catalog.materials.find((item) => item.id === data.materialId);

  if (!material) {
    return <p className="text-sm text-slate-500">{t('wizard.selectMaterialFirst')}</p>;
  }

  return (
    <div className="space-y-3">
      <div className="grid gap-3">
        {material.variants.map((variant) => {
          const isActive = variant.id === data.materialVariantId;
          return (
            <button
              key={variant.id}
              type="button"
              onClick={() => updateData({ materialVariantId: variant.id })}
              className={[
                'flex items-center justify-between rounded-xl border px-4 py-3 text-left text-sm font-medium transition',
                isActive ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-slate-200',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              <span>{variant.colorName}</span>
              <span
                className="h-5 w-5 rounded-full border"
                style={{ backgroundColor: variant.colorHex || '#e2e8f0' }}
              />
            </button>
          );
        })}
      </div>
      {error ? <p className="text-xs text-error">{error}</p> : null}
    </div>
  );
};

export default StepColor;
