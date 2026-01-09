import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { UserIcon } from '@heroicons/react/24/outline';
import PageHeader from '../components/layout/PageHeader';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import PageTransition from '../components/ui/PageTransition';
import Select from '../components/ui/Select';
import { useAuth } from '../hooks/useAuth';

const ProfilePage = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { user, logout, setLanguage } = useAuth();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  return (
    <PageTransition>
      <div className="mx-auto flex max-w-xl flex-col gap-5 px-4 pb-28 pt-6">
        <PageHeader title={t('profile.title')} />
        <div className="rounded-lg bg-white p-4 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-100">
              <UserIcon className="h-8 w-8 text-primary-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                {user?.fullName || user?.username || t('profile.title')}
              </h2>
              {user?.username ? <p className="text-sm text-slate-500">@{user.username}</p> : null}
            </div>
          </div>
        </div>
        <div className="rounded-lg bg-white p-4 shadow-sm">
          <Select
            label={t('profile.language')}
            value={i18n.language}
            onChange={(event) => setLanguage(event.target.value)}
          >
            <option value="ru">{t('profile.languageRu')}</option>
            <option value="uz_cyrl">{t('profile.languageUzCyrl')}</option>
            <option value="uz_latn">{t('profile.languageUzLatn')}</option>
          </Select>
        </div>
        <Button variant="danger" fullWidth onClick={() => setShowLogoutModal(true)}>
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
