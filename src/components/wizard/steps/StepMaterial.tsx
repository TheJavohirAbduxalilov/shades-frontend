import { useTranslation } from 'react-i18next';
import { Catalog } from '../../../types';
import useWizardStore from '../../../stores/wizardStore';
import Spinner from '../../ui/Spinner';

interface StepMaterialProps {
  catalog?: Catalog;
  error?: string;
}

const StepMaterial = ({ catalog, error }: StepMaterialProps) => {
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

  const shadeType = catalog.shadeTypes.find((item) => item.id === data.shadeTypeId);
  const allowedIds = shadeType?.materials || [];
  const materials = allowedIds.length
    ? catalog.materials.filter((material) => allowedIds.includes(material.id))
    : catalog.materials;

  return (
    <div className="space-y-3">
      <div className="grid gap-3">
        {materials.map((material) => {
          const isActive = material.id === data.materialId;
          return (
            <button
              key={material.id}
              type="button"
              onClick={() =>
                updateData({
                  materialId: material.id,
                  materialVariantId: null,
                })
              }
              className={[
                'rounded-xl border px-4 py-3 text-left text-sm font-medium transition',
                isActive ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-slate-200',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              {material.name}
            </button>
          );
        })}
      </div>
      {error ? <p className="text-xs text-error">{error}</p> : null}
    </div>
  );
};

export default StepMaterial;
