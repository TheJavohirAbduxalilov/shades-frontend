import { useTranslation } from 'react-i18next';
import Modal from '../ui/Modal';
import Button from '../ui/Button';

interface CopyPreviousModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

const CopyPreviousModal = ({ isOpen, onConfirm, onClose }: CopyPreviousModalProps) => {
  const { t } = useTranslation();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t('wizard.copyPrevious')}
      actions={
        <div className="flex w-full flex-col gap-2 sm:flex-row sm:justify-end">
          <Button variant="ghost" onClick={onClose}>
            {t('common.no')}
          </Button>
          <Button onClick={onConfirm}>{t('common.yes')}</Button>
        </div>
      }
    >
      {t('wizard.copyPrevious')}
    </Modal>
  );
};

export default CopyPreviousModal;
