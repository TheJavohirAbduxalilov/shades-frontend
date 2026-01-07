import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  actions?: ReactNode;
}

const PageHeader = ({ title, subtitle, onBack, actions }: PageHeaderProps) => {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="flex items-start gap-3">
        {onBack ? (
          <button
            type="button"
            onClick={onBack}
            className="mt-1 rounded-full border border-slate-200 p-2 text-slate-500 hover:bg-slate-100"
          >
            <ArrowLeftIcon className="h-5 w-5" />
          </button>
        ) : null}
        <div>
          <h1 className="text-xl font-semibold text-slate-900">{title}</h1>
          {subtitle ? <p className="mt-1 text-sm text-slate-500">{subtitle}</p> : null}
        </div>
      </div>
      {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
    </div>
  );
};

export default PageHeader;
