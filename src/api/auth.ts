import { api } from './client';

export interface AuthUser {
  id: number;
  username: string;
  email?: string;
  permissions: string[];
  tenantId?: number;
}

export interface LoginResponse {
  accessToken: string;
  user: AuthUser;
}

export const authApi = {
  login: (username: string, password: string) =>
    api.post<LoginResponse>('/auth/login', { username, password }),

  me: () => api.get<AuthUser>('/auth/me'),
};
