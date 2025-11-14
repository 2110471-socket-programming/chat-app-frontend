import type { User } from '../interface/interface';
import Axios from './Axios';

export interface UserResponse {
  _id: string;
  name: string;
  profileUrl: string;
}
export interface UserRequest {
  name: string;
  password?: string;
  profileUrl: string;
}

export const getClients = async (): Promise<User[]> => {
  const response = await Axios.get('/api/users');
  return response.data.users;
};

export const getOnlineClientsId = async (): Promise<string[]> => {
  const response = await Axios.get('/api/users/online');
  return response.data.online_clients;
};

export const signup = async (userData: UserRequest): Promise<UserResponse> => {
  try {
    const response = await Axios.post('/api/auth/signup', userData);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const signin = async (userData: UserRequest): Promise<UserResponse> => {
  const response = await Axios.post('/api/auth/signin', userData);
  return response.data;
};

export const signout = async (): Promise<void> => {
  await Axios.post('/api/auth/signout');
};
