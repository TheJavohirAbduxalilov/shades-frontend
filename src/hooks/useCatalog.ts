import { useQuery } from '@tanstack/react-query';
import { getCatalog } from '../api/catalog.api';

export const useCatalog = () => {
  return useQuery({
    queryKey: ['catalog'],
    queryFn: getCatalog,
  });
};
