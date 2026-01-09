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
    <div className="flex min-h-screen flex-col">
      <div className="mx-auto w-full max-w-2xl px-4 pt-6">
        <PageHeader title={title} onBack={onPrev} />
      </div>
      <div className="mx-auto w-full max-w-2xl px-4 pt-2">
        <WizardProgress currentStep={currentStep} totalSteps={totalSteps} />
      </div>
      <div className="mx-auto w-full max-w-2xl flex-1 overflow-y-auto px-4 py-6">
        <div key={currentStep} className="animate-fadeIn">
          {children}
        </div>
      </div>
      <div className="border-t border-slate-200 bg-white">
        <div className="mx-auto w-full max-w-2xl px-4 py-4">
          <div className="flex gap-3">
            <Button variant="ghost" className="flex-1" onClick={onPrev}>
              {prevLabel || t('common.back')}
            </Button>
            <Button
              className="flex-1"
              onClick={onNext}
              isLoading={isNextLoading}
              disabled={isNextDisabled}
            >
              {nextLabel || t('common.next')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WizardLayout;
