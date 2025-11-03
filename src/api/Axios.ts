import axios from 'axios';
import { serverUrl } from '../config/config';

const Axios = axios.create({
  baseURL: serverUrl,
});

Axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default Axios;
