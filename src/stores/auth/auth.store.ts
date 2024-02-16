import { StateCreator, create } from "zustand";
import type { AuthStatus, User } from "../../interfaces";
import { AuthService } from "../../services/auth.service";
import { devtools, persist } from "zustand/middleware";



export interface AuthState {
  authStatus: AuthStatus;
  token?: string;
  user?: User;
  loginUser: (email: string, password: string) => Promise<void>;
  checkAuthStatus: () => Promise<void>;
  logoutUser: () => void;
}

const storeAPI: StateCreator<AuthState> = (set) => ({
  authStatus: 'pending',
  token: undefined,
  user: undefined,
  loginUser: async (email: string, password: string) => {
    try {
      const { token, ...user } = await AuthService.login(email, password);
      set({ authStatus: 'authorized', token, user });
    } catch(error) {
      set({ authStatus: 'unauthorized', user: undefined, token: undefined });
      throw 'Unauthorized';
    }
  },
  checkAuthStatus: async (): Promise<void> => {
    try {
      const { token, ...user } = await AuthService.checkStatus();
      set({ authStatus: 'authorized', token, user })
    } catch (error) {
      set({ authStatus: 'unauthorized', user: undefined, token: undefined });
    }
  },
  logoutUser: () => {
    set({ authStatus: 'unauthorized', user: undefined, token: undefined });
  }
});

export const useAuthStore = create<AuthState>()((
  devtools(
    persist(
      storeAPI,
      { name: 'auth-store'}
    )
  )
));