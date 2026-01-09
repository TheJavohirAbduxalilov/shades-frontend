import { create } from 'zustand';

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
}

const getStoredUser = (): User | null => {
  try {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

const storedUser = getStoredUser();
const storedToken = localStorage.getItem('token');

export const useAuthStore = create<AuthState>((set) => ({
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
}));