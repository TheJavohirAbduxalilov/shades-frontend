import { useMutation, useQuery } from '@tanstack/react-query';
import { getMe, login as loginRequest } from '../api/auth.api';
import useAuthStore from '../stores/authStore';

export const useAuth = () => {
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const loginStore = useAuthStore((state) => state.login);
  const logout = useAuthStore((state) => state.logout);
  const setLanguage = useAuthStore((state) => state.setLanguage);

  useQuery({
    queryKey: ['me'],
    queryFn: getMe,
    enabled: Boolean(token && !user),
    retry: false,
    onSuccess: (data) => {
      if (token) {
        loginStore(data, token);
      }
    },
  });

  const loginMutation = useMutation({
    mutationFn: loginRequest,
    onSuccess: (data) => {
      loginStore(data.user, data.token);
    },
  });

  return {
    user,
    token,
    isAuthenticated,
    loginMutation,
    logout,
    setLanguage,
  };
};
