import { useTranslation } from 'react-i18next';

interface WizardProgressProps {
  currentStep: number;
  totalSteps: number;
}

const WizardProgress = ({ currentStep, totalSteps }: WizardProgressProps) => {
  const { t } = useTranslation();
  const percentage = Math.round((currentStep / totalSteps) * 100);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-xs text-slate-500">
        <span>{t('wizard.step', { current: currentStep, total: totalSteps })}</span>
        <span>{percentage}%</span>
      </div>
      <div className="h-2 w-full rounded-full bg-slate-200">
        <div className="h-2 rounded-full bg-primary-600" style={{ width: percentage + '%' }} />
      </div>
      <div className="flex items-center justify-between">
        {Array.from({ length: totalSteps }).map((_, index) => {
          const stepNumber = index + 1;
          return (
            <span
              key={stepNumber}
              className={[
                'h-2 w-2 rounded-full',
                stepNumber <= currentStep ? 'bg-primary-600' : 'bg-slate-200',
              ]
                .filter(Boolean)
                .join(' ')}
            />
          );
        })}
      </div>
    </div>
  );
};

export default WizardProgress;
