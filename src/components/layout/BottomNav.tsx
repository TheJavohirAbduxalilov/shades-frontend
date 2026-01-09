import { ClipboardDocumentListIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';

const BottomNav = () => {
  const { t } = useTranslation();
  const { isAuthenticated } = useAuthStore();
  const location = useLocation();
  const path = location.pathname;

  const isWizard = path.includes('/windows/') && (path.endsWith('/new') || path.endsWith('/edit'));

  if (!isAuthenticated || path === '/login' || isWizard) {
    return null;
  }

  const linkClasses = (isActive: boolean) =>
    [
      'flex flex-col items-center gap-1 text-xs font-medium transition-all duration-150 active:scale-[0.95]',
      isActive ? 'text-primary-600' : 'text-slate-500 hover:text-slate-700 active:text-slate-800',
    ]
      .filter(Boolean)
      .join(' ');

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-xl items-center justify-around px-6 py-3">
        <NavLink to="/orders" className={({ isActive }) => linkClasses(isActive)}>
          <ClipboardDocumentListIcon className="h-6 w-6" />
          <span>{t('orders.title')}</span>
        </NavLink>
        <NavLink to="/profile" className={({ isActive }) => linkClasses(isActive)}>
          <UserCircleIcon className="h-6 w-6" />
          <span>{t('profile.title')}</span>
        </NavLink>
      </div>
    </nav>
  );
};

export default BottomNav;
