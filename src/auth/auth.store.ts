import axios from 'axios';
import { create } from 'zustand';
import { api } from '../api/axios';

export type User = {
  id: number;
  name: string;
  surname: string;
  password?: string;
  email: string;
  address?: string | null;
  city?: string | null;
  zipCode?: string | null;
  country?: string | null;
  province?: string | null;
  role: 'admin' | 'user';
};

type CrudState = {
  loading: boolean;
  error: string | null;
};

const initialState = {
  user: null,
  email: "",
  password: "",
  error: null,
  userState: { loading: false, error: null },
};


type AuthState = {
  user: User | null;
  email: string;
  password: string;
  error: string | null;

  userState: CrudState;

  setEmail: (email: string) => void;
  setPassword: (password: string) => void;

  login: (email: string, password: string) => Promise<User | null>;
  logout: () => void;
  setError: (error: string | null) => void;
};

const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "Something went wrong";
};

export const useAuthStore = create<AuthState>((set) => ({
  ...initialState,

  setEmail: (email) => set({ email }),
  setPassword: (password) => set({ password }),

  login: async (email, password) => {
  set({ userState: { loading: true, error: null }, error: null });

  try {
    const res = await api.get<User[]>("/users", {
      params: { email, password },
    });

    const user = res.data[0]; // prendiamo il primo

    if (!user) {
      set({
        userState: { loading: false, error: "Invalid credentials" },
        error: "Invalid credentials",
      });
      return null;
    }

    set({
      user,
      userState: { loading: false, error: null },
      error: null,
    });

    return user;
  } catch (error: unknown) {
    const message = getErrorMessage(error);

    set({
      userState: { loading: false, error: message },
      error: message,
    });

    return null;
  }
},
  logout: () => set(initialState),
  setError: (error) => set({ error }),
}));
