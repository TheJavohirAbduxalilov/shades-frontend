import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import i18n from '../i18n';
import { User } from '../types';

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isInstaller: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  setLanguage: (lang: string) => void;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => {
      const storedToken = localStorage.getItem('token');
      return {
        user: null,
        token: storedToken,
        isAuthenticated: Boolean(storedToken),
        isAdmin: false,
        isInstaller: false,
        login: (user, token) => {
          localStorage.setItem('token', token);
          set({
            user,
            token,
            isAuthenticated: true,
            isAdmin: user.role === 'admin',
            isInstaller: user.role === 'installer',
          });
          if (user?.preferredLanguageCode) {
            i18n.changeLanguage(user.preferredLanguageCode);
          }
        },
        logout: () => {
          localStorage.removeItem('token');
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isAdmin: false,
            isInstaller: false,
          });
        },
        setLanguage: (lang) => {
          const currentUser = get().user;
          if (currentUser) {
            set({ user: { ...currentUser, preferredLanguageCode: lang } });
          }
          i18n.changeLanguage(lang);
        },
      };
    },
    {
      name: 'auth-store',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        isAdmin: state.isAdmin,
        isInstaller: state.isInstaller,
      }),
      onRehydrateStorage: () => (state) => {
        if (!state) {
          return;
        }
        const role = state.user?.role;
        state.isAdmin = role === 'admin';
        state.isInstaller = role === 'installer';
      }),
    }
  )
);

export default useAuthStore;
