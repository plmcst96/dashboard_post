import { create } from 'zustand';

export type User = {
  id: number;
  name: string;
  surname: string;
  password: string;
  email: string;
  address?: string | null;
  city?: string | null;
  zipCode?: string | null;
  country?: string | null;
  province?: string | null;
  role: 'admin' | 'user';
};

type AuthState = {
  user: User | null;
  email: string;
  password: string;
  error: string | null;

  setEmail: (email: string) => void;
  setPassword: (password: string) => void;

  login: (user: User) => void;
  logout: () => void;
  setError: (error: string | null) => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  email: '',
  password: '',
  error: null,

  setEmail: (email) => set({ email }),
  setPassword: (password) => set({ password }),

  login: (user) => set({ user, error: null }),
  logout: () => set({ user: null }),
  setError: (error) => set({ error }),
}));
