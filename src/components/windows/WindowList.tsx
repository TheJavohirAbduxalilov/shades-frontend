import { useTranslation } from 'react-i18next';
import { Window } from '../../types';
import WindowCard from './WindowCard';

interface WindowListProps {
  windows: Window[];
}

const WindowList = ({ windows }: WindowListProps) => {
  const { t } = useTranslation();

  if (!windows.length) {
    return <p className="text-sm text-slate-500">{t('order.noWindows')}</p>;
  }

  return (
    <div className="space-y-3">
      {windows.map((windowItem) => (
        <WindowCard key={windowItem.id} window={windowItem} />
      ))}
    </div>
  );
};

export default WindowList;
