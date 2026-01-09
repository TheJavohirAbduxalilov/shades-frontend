import { useEffect } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { getMe, login as loginRequest } from '../api/auth.api';
import { useAuthStore } from '../stores/authStore';

export const useAuth = () => {
  const { user, token, isAuthenticated, login, logout, setLanguage } = useAuthStore();

  const meQuery = useQuery({
    queryKey: ['me'],
    queryFn: getMe,
    enabled: Boolean(token && !user),
    retry: false,
  });

  useEffect(() => {
    if (meQuery.data && token) {
      login(meQuery.data, token);
    }
  }, [login, meQuery.data, token]);

  const loginMutation = useMutation({
    mutationFn: loginRequest,
    onSuccess: (data) => {
      login(data.user, data.token);
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
