import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Window } from '../../types';
import Button from '../ui/Button';
import Modal from '../ui/Modal';
import Select from '../ui/Select';

interface CopyFromWindowModalProps {
  isOpen: boolean;
  onClose: () => void;
  windows: Window[];
  onCopy: (windowId: number) => void;
  onSkip: () => void;
}

const CopyFromWindowModal = ({ isOpen, onClose, windows, onCopy, onSkip }: CopyFromWindowModalProps) => {
  const { t } = useTranslation();
  const windowsWithShade = useMemo(() => windows.filter((windowItem) => windowItem.shade), [windows]);
  const [selectedWindowId, setSelectedWindowId] = useState<number>(0);

  useEffect(() => {
    if (!isOpen || windowsWithShade.length === 0) {
      return;
    }
    const fallbackId = windowsWithShade[windowsWithShade.length - 1].id;
    if (!windowsWithShade.some((windowItem) => windowItem.id === selectedWindowId)) {
      setSelectedWindowId(fallbackId);
    }
  }, [isOpen, selectedWindowId, windowsWithShade]);

  if (windowsWithShade.length === 0) {
    return null;
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t('wizard.copyFromWindow')}
      actions={
        <div className="flex w-full flex-col gap-2 sm:flex-row sm:justify-end">
          <Button variant="secondary" onClick={onSkip}>
            {t('wizard.startEmpty')}
          </Button>
          <Button onClick={() => onCopy(selectedWindowId)}>{t('wizard.copySettings')}</Button>
        </div>
      }
    >
      <p className="mb-4 text-sm text-slate-600">{t('wizard.copyFromWindowDescription')}</p>
      <div className="mb-2">
        <Select
          label={t('wizard.selectWindow')}
          value={selectedWindowId}
          onChange={(event) => setSelectedWindowId(Number(event.target.value))}
        >
          {windowsWithShade.map((windowItem) => (
            <option key={windowItem.id} value={windowItem.id}>
              {windowItem.name} — {windowItem.shade?.shadeTypeName}, {windowItem.shade?.width} x{' '}
              {windowItem.shade?.height} мм
            </option>
          ))}
        </Select>
      </div>
    </Modal>
  );
};

export default CopyFromWindowModal;
