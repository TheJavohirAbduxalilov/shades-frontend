import { useTranslation } from 'react-i18next';
import { Catalog } from '../../../types';
import useWizardStore from '../../../stores/wizardStore';
import Spinner from '../../ui/Spinner';

interface StepShadeTypeProps {
  catalog?: Catalog;
  error?: string;
}

const StepShadeType = ({ catalog, error }: StepShadeTypeProps) => {
  const { t } = useTranslation();
  const selectedId = useWizardStore((state) => state.data.shadeTypeId);
  const updateData = useWizardStore((state) => state.updateData);

  if (!catalog) {
    return (
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <Spinner size="sm" />
        {t('common.loading')}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="grid gap-3">
        {catalog.shadeTypes.map((shadeType) => {
          const isActive = selectedId === shadeType.id;
          return (
            <button
              key={shadeType.id}
              type="button"
              onClick={() => updateData({ shadeTypeId: shadeType.id })}
              className={[
                'rounded-xl border px-4 py-3 text-left text-sm font-medium transition',
                isActive ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-slate-200',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              {shadeType.name}
            </button>
          );
        })}
      </div>
      {error ? <p className="text-xs text-error">{error}</p> : null}
    </div>
  );
};

export default StepShadeType;
