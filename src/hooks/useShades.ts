import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  calculatePrice,
  createShade,
  deleteShade,
  ShadePayload,
  updateShade,
} from '../api/shades.api';

export const useCreateShade = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ windowId, payload }: { windowId: string; payload: ShadePayload }) =>
      createShade(windowId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
};

export const useUpdateShade = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ shadeId, payload }: { shadeId: string; payload: ShadePayload }) =>
      updateShade(shadeId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
};

export const useDeleteShade = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (shadeId: string) => deleteShade(shadeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
};

export const useCalculatePrice = (payload: ShadePayload, enabled: boolean) => {
  return useQuery({
    queryKey: ['price', payload],
    queryFn: () => calculatePrice(payload),
    enabled,
  });
};
