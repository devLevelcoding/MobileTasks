import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GATEWAY_URL } from './config';

export function makeClient(baseURL: string) {
  const client = axios.create({ baseURL, timeout: 15_000 });

  client.interceptors.request.use(async (config) => {
    const token = await AsyncStorage.getItem('crm_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });

  client.interceptors.response.use(
    (res) => res,
    async (err) => {
      if (err.response?.status === 401) {
        await AsyncStorage.removeItem('crm_token');
        await AsyncStorage.removeItem('crm_user');
      }
      return Promise.reject(err);
    },
  );

  return client;
}

export const api = makeClient(GATEWAY_URL);
