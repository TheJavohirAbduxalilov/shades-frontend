import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '../ui/Button';
import PageHeader from '../layout/PageHeader';
import WizardProgress from './WizardProgress';

interface WizardLayoutProps {
  title: string;
  currentStep: number;
  totalSteps: number;
  children: ReactNode;
  onNext: () => void;
  onPrev: () => void;
  nextLabel?: string;
  prevLabel?: string;
  isNextDisabled?: boolean;
  isNextLoading?: boolean;
}

const WizardLayout = ({
  title,
  currentStep,
  totalSteps,
  children,
  onNext,
  onPrev,
  nextLabel,
  prevLabel,
  isNextDisabled,
  isNextLoading,
}: WizardLayoutProps) => {
  const { t } = useTranslation();

  return (
    <div className="mx-auto flex min-h-screen max-w-xl flex-col gap-6 px-4 pb-28 pt-6">
      <PageHeader title={title} onBack={onPrev} />
      <WizardProgress currentStep={currentStep} totalSteps={totalSteps} />
      <div>{children}</div>
      <div className="mt-auto flex gap-3">
        <Button variant="ghost" fullWidth onClick={onPrev}>
          {prevLabel || t('common.back')}
        </Button>
        <Button
          fullWidth
          onClick={onNext}
          isLoading={isNextLoading}
          disabled={isNextDisabled}
        >
          {nextLabel || t('common.next')}
        </Button>
      </div>
    </div>
  );
};

export default WizardLayout;
