import { create } from 'zustand';
import { User } from '../types/auth';
import { authService } from '../services/authService';

interface AuthStore {
  user: User | null;
  token: string | null;
  login: (username: string, password: string) => void;
  logout: () => void;
}

// Initialize synchronously from localStorage to avoid flash of unauthenticated state
const initialToken = authService.getToken();
const initialUser = authService.getUser();

export const useAuthStore = create<AuthStore>((set) => ({
  user: initialUser,
  token: initialToken,

  login(username, password) {
    const { token, user } = authService.login(username, password);
    set({ token, user });
  },

  logout() {
    authService.logout();
    set({ token: null, user: null });
  },
}));
