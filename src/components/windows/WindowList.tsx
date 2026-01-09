import { useTranslation } from 'react-i18next';
import { Window } from '../../types';
import WindowCard from './WindowCard';

interface WindowListProps {
  orderId: string;
  windows: Window[];
  clickable?: boolean;
}

const WindowList = ({ orderId, windows, clickable = true }: WindowListProps) => {
  const { t } = useTranslation();

  if (!windows.length) {
    return <p className="text-sm text-slate-500">{t('order.noWindows')}</p>;
  }

  return (
    <div className="space-y-3">
      {windows.map((windowItem, index) => (
        <div
          key={windowItem.id}
          className="animate-slideUp"
          style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'both' }}
        >
          <WindowCard orderId={orderId} window={windowItem} clickable={clickable} />
        </div>
      ))}
    </div>
  );
};

export default WindowList;
