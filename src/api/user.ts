import type { User } from '../interface/interface';
import Axios from './Axios';

export const getClients = async (): Promise<User[]> => {
  const response = await Axios.get('/api/users');
  return response.data.users;
};

export const getOnlineClientsId = async (): Promise<string[]> => {
  const response = await Axios.get('/api/users/online');
  return response.data.online_clients;
};
