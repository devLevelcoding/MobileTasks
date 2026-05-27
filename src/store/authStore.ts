import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { AuthUser } from '../api/auth';

interface AuthState {
  token: string | null;
  user: AuthUser | null;
  shopId: number | null;
  isLoading: boolean;
  setAuth: (token: string, user: AuthUser, shopId: number) => Promise<void>;
  loadFromStorage: () => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  shopId: null,
  isLoading: true,

  setAuth: async (token, user, shopId) => {
    await AsyncStorage.multiSet([
      ['crm_token', token],
      ['crm_user', JSON.stringify(user)],
      ['crm_shop_id', String(shopId)],
    ]);
    set({ token, user, shopId });
  },

  loadFromStorage: async () => {
    try {
      const [[, token], [, userJson], [, shopIdStr]] = await AsyncStorage.multiGet([
        'crm_token', 'crm_user', 'crm_shop_id',
      ]);
      set({
        token: token ?? null,
        user: userJson ? JSON.parse(userJson) : null,
        shopId: shopIdStr ? Number(shopIdStr) : null,
        isLoading: false,
      });
    } catch {
      set({ isLoading: false });
    }
  },

  logout: async () => {
    await AsyncStorage.multiRemove(['crm_token', 'crm_user', 'crm_shop_id']);
    set({ token: null, user: null, shopId: null });
  },
}));
