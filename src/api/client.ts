import axios from 'axios';
import { GATEWAY_URL } from './config';

// Lazy import to avoid circular dependency (store → client → store)
function getStore() {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  return require('../store/authStore').useAuthStore;
}

export function makeClient(baseURL: string) {
  const client = axios.create({ baseURL, timeout: 15_000 });

  client.interceptors.request.use((config) => {
    const token = getStore().getState().token;
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });

  client.interceptors.response.use(
    (res) => res,
    (err) => {
      if (err.response?.status === 401) {
        getStore().getState().logout();
      }
      return Promise.reject(err);
    },
  );

  return client;
}

export const api = makeClient(GATEWAY_URL);
