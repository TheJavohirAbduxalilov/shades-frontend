import client from './client';
import { CompanyInfo, Order, TrackingOrder } from '../types';

export interface OrdersQuery {
  status?: string[];
  search?: string;
  assignedUserId?: string | number;
}

interface OrdersResponse {
  orders: Order[];
}

interface TrackingResponse {
  order: TrackingOrder;
  companyInfo: CompanyInfo;
}

export const getOrders = async (query: OrdersQuery) => {
  const params: Record<string, string> = {};
  if (query.status && query.status.length) {
    params.status = query.status.join(',');
  }
  if (query.search) {
    params.search = query.search;
  }
  if (query.assignedUserId) {
    params.assignedUserId = String(query.assignedUserId);
  }

  const { data } = await client.get<OrdersResponse>('/api/orders', { params });
  return data.orders || [];
};

export const getOrder = async (orderId: string | number) => {
  const { data } = await client.get<Order>('/api/orders/' + orderId);
  return data;
};

export const getOrderById = async (orderId: number) => {
  return getOrder(orderId);
};

export const getOrderByTrackingCode = async (trackingCode: string, lang: string) => {
  const { data } = await client.get<TrackingResponse>('/api/orders/track/' + trackingCode, {
    params: { lang },
  });
  return data;
};

export const createOrder = async (payload: {
  clientName: string;
  clientPhone: string;
  clientAddress: string;
  notes?: string;
  visitDate: string;
  assignedUserId?: number;
}) => {
  const { data } = await client.post<Order>('/api/orders', payload);
  return data;
};

export const updateOrder = async (orderId: string | number, payload: Partial<Order>) => {
  const { data } = await client.put<Order>('/api/orders/' + orderId, payload);
  return data;
};

export const deleteOrder = async (orderId: string | number) => {
  const { data } = await client.delete('/api/orders/' + orderId);
  return data;
};

export const completeOrder = async (orderId: string | number) => {
  const { data } = await client.patch('/api/orders/' + orderId + '/complete');
  return data;
};
