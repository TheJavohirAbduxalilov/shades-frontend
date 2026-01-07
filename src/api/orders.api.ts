import client from './client';
import { Order } from '../types';

export interface OrdersQuery {
  status?: string[];
  search?: string;
}

interface OrdersResponse {
  orders: Order[];
}

export const getOrders = async (query: OrdersQuery) => {
  const params: Record<string, string> = {};
  if (query.status && query.status.length) {
    params.status = query.status.join(',');
  }
  if (query.search) {
    params.search = query.search;
  }

  const { data } = await client.get<OrdersResponse>('/api/orders', { params });
  return data.orders || [];
};

export const getOrder = async (orderId: string) => {
  const { data } = await client.get<Order>('/api/orders/' + orderId);
  return data;
};

export const updateOrder = async (orderId: string, payload: Partial<Order>) => {
  const { data } = await client.patch<Order>('/api/orders/' + orderId, payload);
  return data;
};
