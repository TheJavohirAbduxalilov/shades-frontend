import { ReactNode, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import Button from './Button';

interface ModalProps {
  isOpen: boolean;
  title?: string;
  children: ReactNode;
  onClose: () => void;
  actions?: ReactNode;
}

const Modal = ({ isOpen, title, children, onClose, actions }: ModalProps) => {
  const { t } = useTranslation();

  useEffect(() => {
    if (!isOpen) {
      return;
    }
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-xl">
        {title ? <h3 className="text-lg font-semibold text-slate-900">{title}</h3> : null}
        <div className="mt-3 text-sm text-slate-600">{children}</div>
        <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-end">
          {actions || (
            <Button variant="ghost" onClick={onClose}>
              {t('common.cancel')}
            </Button>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default Modal;
