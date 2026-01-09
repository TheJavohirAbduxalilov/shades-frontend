import client from './client';
import { Installer } from '../types';

interface InstallersResponse {
  installers: Installer[];
}

export const getInstallers = async (): Promise<Installer[]> => {
  const { data } = await client.get<InstallersResponse>('/api/users/installers');
  return data.installers || [];
};
