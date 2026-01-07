import { useTranslation } from 'react-i18next';
import useWizardStore from '../../../stores/wizardStore';
import Input from '../../ui/Input';

interface StepDimensionsProps {
  widthError?: string;
  heightError?: string;
}

const StepDimensions = ({ widthError, heightError }: StepDimensionsProps) => {
  const { t } = useTranslation();
  const data = useWizardStore((state) => state.data);
  const updateData = useWizardStore((state) => state.updateData);

  const toNumber = (value: string) => {
    if (!value) {
      return null;
    }
    const parsed = Number(value);
    return Number.isNaN(parsed) ? null : parsed;
  };

  return (
    <div className="grid gap-4">
      <Input
        label={t('window.width')}
        type="number"
        min={1}
        value={data.width ?? ''}
        onChange={(event) => updateData({ width: toNumber(event.target.value) })}
        error={widthError}
      />
      <Input
        label={t('window.height')}
        type="number"
        min={1}
        value={data.height ?? ''}
        onChange={(event) => updateData({ height: toNumber(event.target.value) })}
        error={heightError}
      />
    </div>
  );
};

export default StepDimensions;
