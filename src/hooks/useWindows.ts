import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createWindow, deleteWindow, updateWindow, WindowPayload } from '../api/windows.api';

export const useCreateWindow = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orderId, payload }: { orderId: string; payload: WindowPayload }) =>
      createWindow(orderId, payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['order', variables.orderId] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
};

export const useUpdateWindow = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ windowId, payload }: { windowId: string; payload: Partial<WindowPayload> }) =>
      updateWindow(windowId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
};

export const useDeleteWindow = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (windowId: string) => deleteWindow(windowId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
};
