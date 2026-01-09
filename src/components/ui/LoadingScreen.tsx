import { useTranslation } from 'react-i18next';

const LoadingScreen = () => {
  const { t } = useTranslation();

  return (
    <div className="flex min-h-[50vh] items-center justify-center animate-fadeIn">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600" />
        <p className="text-sm text-slate-500">{t('common.loading')}</p>
      </div>
    </div>
  );
};

export default LoadingScreen;
