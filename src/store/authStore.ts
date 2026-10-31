import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { AuthUser } from '../api/auth';

interface AuthState {
  token: string | null;
  user: AuthUser | null;
  agencyIds: number[];
  isLoading: boolean;
  setAuth: (token: string, user: AuthUser) => Promise<void>;
  setAgencyIds: (ids: number[]) => void;
  loadFromStorage: () => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  agencyIds: [],
  isLoading: true,

  setAuth: async (token, user) => {
    await AsyncStorage.multiSet([
      ['crm_token', token],
      ['crm_user', JSON.stringify(user)],
    ]);
    set({ token, user });
  },

  setAgencyIds: (ids) => set({ agencyIds: ids }),

  loadFromStorage: async () => {
    try {
      const [[, token], [, userJson]] = await AsyncStorage.multiGet(['crm_token', 'crm_user']);
      set({
        token: token ?? null,
        user: userJson ? JSON.parse(userJson) : null,
        isLoading: false,
      });
    } catch {
      set({ isLoading: false });
    }
  },

  logout: async () => {
    await AsyncStorage.multiRemove(['crm_token', 'crm_user']);
    set({ token: null, user: null, agencyIds: [] });
  },
}));
