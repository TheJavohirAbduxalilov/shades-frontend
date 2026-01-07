import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import i18n from '../i18n';
import { User } from '../types';

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  setLanguage: (lang: string) => void;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      login: (user, token) => {
        set({ user, token, isAuthenticated: true });
        if (user?.preferredLanguageCode) {
          i18n.changeLanguage(user.preferredLanguageCode);
        }
      },
      logout: () => set({ user: null, token: null, isAuthenticated: false }),
      setLanguage: (lang) => {
        const currentUser = get().user;
        if (currentUser) {
          set({ user: { ...currentUser, preferredLanguageCode: lang } });
        }
        i18n.changeLanguage(lang);
      },
    }),
    {
      name: 'auth-store',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export default useAuthStore;
