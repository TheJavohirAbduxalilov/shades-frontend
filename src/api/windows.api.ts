import client from './client';
import { Window } from '../types';

export interface WindowPayload {
  name: string;
}

export const createWindow = async (orderId: string, payload: WindowPayload) => {
  const { data } = await client.post<Window>('/api/orders/' + orderId + '/windows', payload);
  return data;
};

export const updateWindow = async (windowId: string, payload: Partial<WindowPayload>) => {
  const { data } = await client.patch<Window>('/api/windows/' + windowId, payload);
  return data;
};

export const deleteWindow = async (windowId: string) => {
  const { data } = await client.delete('/api/windows/' + windowId);
  return data;
};
