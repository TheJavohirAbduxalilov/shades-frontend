import { useTranslation } from 'react-i18next';
import useWizardStore from '../../../stores/wizardStore';
import Input from '../../ui/Input';

interface StepWindowNameProps {
  error?: string;
}

const StepWindowName = ({ error }: StepWindowNameProps) => {
  const { t } = useTranslation();
  const windowName = useWizardStore((state) => state.data.windowName);
  const updateData = useWizardStore((state) => state.updateData);

  return (
    <Input
      label={t('wizard.windowName')}
      value={windowName}
      placeholder={t('window.namePlaceholder')}
      onChange={(event) => updateData({ windowName: event.target.value })}
      error={error}
    />
  );
};

export default StepWindowName;
