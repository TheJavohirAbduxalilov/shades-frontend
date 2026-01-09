import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/layout/PageHeader';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import PageTransition from '../components/ui/PageTransition';
import Select from '../components/ui/Select';
import { useAuth } from '../hooks/useAuth';

const ProfilePage = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { logout, setLanguage } = useAuth();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  return (
    <PageTransition>
      <div className="mx-auto flex max-w-xl flex-col gap-5 px-4 pb-28 pt-6">
        <PageHeader title={t('profile.title')} />
        <Select
          label={t('profile.language')}
          value={i18n.language}
          onChange={(event) => setLanguage(event.target.value)}
        >
          <option value="ru">{t('profile.languageRu')}</option>
          <option value="uz_cyrl">{t('profile.languageUzCyrl')}</option>
          <option value="uz_latn">{t('profile.languageUzLatn')}</option>
        </Select>
        <Button variant="danger" onClick={() => setShowLogoutModal(true)}>
          {t('profile.logout')}
        </Button>
        <Modal
          isOpen={showLogoutModal}
          title={t('profile.logout')}
          onClose={() => setShowLogoutModal(false)}
          actions={
            <div className="flex w-full flex-col gap-2 sm:flex-row sm:justify-end">
              <Button variant="ghost" onClick={() => setShowLogoutModal(false)}>
                {t('common.cancel')}
              </Button>
              <Button
                variant="danger"
                onClick={() => {
                  logout();
                  navigate('/login');
                }}
              >
                {t('profile.logout')}
              </Button>
            </div>
          }
        >
          {t('profile.logoutConfirm')}
        </Modal>
      </div>
    </PageTransition>
  );
};

export default ProfilePage;
