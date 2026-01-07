import axios, { AxiosHeaders } from 'axios';
import i18n from '../i18n';
import { API_URL } from '../config';
import useAuthStore from '../stores/authStore';

const client = axios.create({
  baseURL: API_URL,
});

client.interceptors.request.use((config) => {
  const { token } = useAuthStore.getState();
  if (token) {
    if (!config.headers) {
      config.headers = new AxiosHeaders();
    }
    if (config.headers instanceof AxiosHeaders) {
      config.headers.set('Authorization', 'Bearer ' + token);
    } else {
      (config.headers as Record<string, string>).Authorization = 'Bearer ' + token;
    }
  }

  const params = config.params || {};
  if (!params.lang) {
    params.lang = i18n.language || 'ru';
  }

  config.params = params;
  return config;
});

client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      useAuthStore.getState().logout();
    }

    return Promise.reject(error);
  }
);

export default client;
