import { useTranslation } from 'react-i18next';
import { Catalog } from '../../../types';
import useWizardStore from '../../../stores/wizardStore';
import { formatPrice } from '../../../utils/formatPrice';
import Checkbox from '../../ui/Checkbox';

interface StepServicesProps {
  catalog?: Catalog;
}

const StepServices = ({ catalog }: StepServicesProps) => {
  const { t } = useTranslation();
  const data = useWizardStore((state) => state.data);
  const updateData = useWizardStore((state) => state.updateData);

  return (
    <div className="space-y-4">
      <Checkbox
        label={
          catalog?.servicePrices.installation
            ? t('services.installation') + ' ? ' + formatPrice(catalog.servicePrices.installation.price)
            : t('services.installation')
        }
        checked={data.installationIncluded}
        onChange={(event) => updateData({ installationIncluded: event.target.checked })}
      />
      <Checkbox
        label={
          catalog?.servicePrices.removal
            ? t('services.removal') + ' ? ' + formatPrice(catalog.servicePrices.removal.price)
            : t('services.removal')
        }
        checked={data.removalIncluded}
        onChange={(event) => updateData({ removalIncluded: event.target.checked })}
      />
    </div>
  );
};

export default StepServices;
