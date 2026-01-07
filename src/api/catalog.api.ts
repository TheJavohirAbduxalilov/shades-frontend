import client from './client';
import { Catalog } from '../types';

export const getCatalog = async () => {
  const { data } = await client.get<Catalog>('/api/catalog');
  return data;
};
