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
    <div className="fixed inset-0 z-50">
      <div className="fixed inset-0 bg-slate-900/50 animate-fadeIn" onClick={onClose} />
      <div className="fixed inset-x-4 top-1/2 mx-auto w-full max-w-md -translate-y-1/2 animate-scaleIn rounded-2xl bg-white p-5 shadow-xl">
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
