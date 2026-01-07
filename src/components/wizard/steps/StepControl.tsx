import { useTranslation } from 'react-i18next';
import { Catalog, OptionType } from '../../../types';
import useWizardStore from '../../../stores/wizardStore';
import Spinner from '../../ui/Spinner';

interface StepControlProps {
  catalog?: Catalog;
  error?: string;
}

const getOptionType = (catalog: Catalog | undefined, shadeTypeId: number | null, index: number) => {
  if (!catalog || !shadeTypeId) {
    return null;
  }

  const shadeType = catalog.shadeTypes.find((item) => item.id === shadeTypeId);
  if (!shadeType) {
    return null;
  }

  const sorted = [...shadeType.optionTypes].sort((a, b) => a.displayOrder - b.displayOrder);
  return sorted[index] || null;
};

const StepControl = ({ catalog, error }: StepControlProps) => {
  const { t } = useTranslation();
  const data = useWizardStore((state) => state.data);
  const updateData = useWizardStore((state) => state.updateData);
  const optionType: OptionType | null = getOptionType(catalog, data.shadeTypeId, 1);

  if (!optionType) {
    return (
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <Spinner size="sm" />
        {t('common.loading')}
      </div>
    );
  }

  const selected = data.options.find((opt) => opt.optionTypeId === optionType.id)?.optionValueId;

  const handleSelect = (valueId: number) => {
    const nextOptions = data.options.filter((opt) => opt.optionTypeId !== optionType.id);
    nextOptions.push({ optionTypeId: optionType.id, optionValueId: valueId });
    updateData({ options: nextOptions });
  };

  return (
    <div className="space-y-3">
      <p className="text-sm font-medium text-slate-700">{optionType.name}</p>
      <div className="grid gap-3">
        {optionType.values.map((value) => {
          const isActive = selected === value.id;
          return (
            <button
              key={value.id}
              type="button"
              onClick={() => handleSelect(value.id)}
              className={[
                'rounded-xl border px-4 py-3 text-left text-sm font-medium transition',
                isActive ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-slate-200',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              {value.name}
            </button>
          );
        })}
      </div>
      {error ? <p className="text-xs text-error">{error}</p> : null}
    </div>
  );
};

export default StepControl;
