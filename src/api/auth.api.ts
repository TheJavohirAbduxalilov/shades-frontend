import client from './client';
import { User } from '../types';

export interface LoginPayload {
  username: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}

export const login = async (payload: LoginPayload) => {
  const { data } = await client.post<LoginResponse>('/api/auth/login', payload);
  return data;
};

export const getMe = async () => {
  const { data } = await client.get<User>('/api/auth/me');
  return data;
};
