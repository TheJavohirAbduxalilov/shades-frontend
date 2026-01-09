import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getOrder, getOrders, updateOrder } from '../api/orders.api';
import { Order } from '../types';

export interface OrdersFilters {
  status?: string[];
  search?: string;
  assignedUserId?: string;
}

export const useOrders = (filters: OrdersFilters) => {
  const statusKey = filters.status ? filters.status.join(',') : 'all';
  const searchKey = filters.search || '';
  const installerKey = filters.assignedUserId || 'all';

  return useQuery({
    queryKey: ['orders', statusKey, searchKey, installerKey],
    queryFn: () => getOrders(filters),
  });
};

export const useOrder = (orderId?: string) => {
  return useQuery({
    queryKey: ['order', orderId],
    queryFn: () => getOrder(orderId || ''),
    enabled: Boolean(orderId),
  });
};

export const useUpdateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orderId, payload }: { orderId: string; payload: Partial<Order> }) =>
      updateOrder(orderId, payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['order', variables.orderId] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
};
