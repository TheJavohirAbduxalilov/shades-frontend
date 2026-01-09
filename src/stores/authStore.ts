import { create } from 'zustand';
import i18n from '../i18n';

interface User {
  id: number;
  username: string;
  fullName: string;
  role: 'admin' | 'installer';
  preferredLanguageCode: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isInstaller: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  setUser: (user: User) => void;
  setLanguage: (lang: string) => void;
}

const getStoredUser = (): User | null => {
  try {
    const stored = localStorage.getItem('user');
    if (!stored) return null;
    const parsed = JSON.parse(stored);
    // Validate that user has required role field
    if (!parsed.role || !['admin', 'installer'].includes(parsed.role)) {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
};

const storedUser = getStoredUser();
const storedToken = localStorage.getItem('token');

export const useAuthStore = create<AuthState>((set, get) => ({
  user: storedUser,
  token: storedToken,
  isAuthenticated: !!storedToken,
  isAdmin: storedUser?.role === 'admin',
  isInstaller: storedUser?.role === 'installer',

  login: (user, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    set({
      user,
      token,
      isAuthenticated: true,
      isAdmin: user.role === 'admin',
      isInstaller: user.role === 'installer',
    });
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      isAdmin: false,
      isInstaller: false,
    });
  },

  setUser: (user) => {
    localStorage.setItem('user', JSON.stringify(user));
    set({
      user,
      isAdmin: user.role === 'admin',
      isInstaller: user.role === 'installer',
    });
  },
  setLanguage: (lang) => {
    const currentUser = get().user;
    if (currentUser) {
      const nextUser = { ...currentUser, preferredLanguageCode: lang };
      localStorage.setItem('user', JSON.stringify(nextUser));
      set({
        user: nextUser,
        isAdmin: nextUser.role === 'admin',
        isInstaller: nextUser.role === 'installer',
      });
    }
    i18n.changeLanguage(lang);
  },
}));
