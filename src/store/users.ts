import { create } from "zustand";
import type { User } from "../auth/auth.store";
import { api } from "../api/axios";
import axios from "axios";

type CrudState = {
  loading: boolean;
  error: string | null;
  success: string | null
};

type UserState = {
  users: User[];
  user: User | null;

  // ---- CRUD STATE ----
  fetchState: CrudState;
  userState: CrudState;
  updateState: CrudState;
  deleteState: CrudState;

  // ---- GETTERS ----
  getUserById: (id: number) => User | undefined;
  getUsersByRole: (role: User["role"]) => User[];

  // ---- CRUD OPERATIONS ----
  fetchUsers: () => Promise<void>;
  fetchUser: (id: number) => Promise<void>;
  addUser: (user: Omit<User, "id">) => Promise<void>;
  updateUser: (id: number, data: Partial<User>) => Promise<void>;
  deleteUser: (id: number) => Promise<void>;
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

export const useUserStore = create<UserState>((set, get) => ({
  users: [],
  user: null,

  // ---- CRUD STATE ----
  fetchState: { loading: false, error: null, success: null },
  userState: { loading: false, error: null , success: null },
  updateState: { loading: false, error: null, success: null  },
  deleteState: { loading: false, error: null , success: null },

  // ---- GETTERS ----
  getUserById: (id) => get().users.find((u) => u.id === id),
  getUsersByRole: (role) => get().users.filter((u) => u.role === role),

  // ---- FETCH ----
  fetchUsers: async () => {
    set({ fetchState: { loading: true, error: null , success: null } });
    try {
      const res = await api.get("/users");
      set({ users: res.data, fetchState: { loading: false, error: null, success: "Users required succesfully"  } });
    } catch (error: unknown) {
      set({
        fetchState: {
          loading: false,
          error: getErrorMessage(error),
          success: null 
        },
      });
    }
  },
  fetchUser: async (id) => {
    set({ userState: { loading: true, error: null , success: null } });
    try {
      const res = await api.get(`/users/${id}`);
      set({ user: res.data, userState: { loading: false, error: null , success: "User required succesfully" } });
    } catch (error: unknown) {
      set({
        fetchState: {
          loading: false,
          error: getErrorMessage(error),
           success: null 
        },
      });
    }
  },
  addUser: async (user) => {
  set({ userState: { loading: true, error: null, success: null  } });
  try {
    const res = await api.post("/users", user);

    if (!res.data.id) {
      throw new Error("User created without id");
    }

    set((state) => ({
      users: [...state.users, res.data],
      userState: { loading: false, error: null , success: "User add!" },
    }));
  } catch (error: unknown) {
    set({
      userState: {
        loading: false,
        error: getErrorMessage(error),
        success: null 
      },
    });
  }
},
  updateUser: async (id, data) => {
    set({ updateState: { loading: true, error: null, success: null  } });
    try {
      const res = await api.put(`/users/${id}`, data);
      set((state) => ({
        users: state.users.map((u) => (u.id === id ? res.data : u)),
        updateState: { loading: false, error: null , success: "User updated!" },
      }));
    } catch (error: unknown) {
      set({
        fetchState: {
          loading: false,
          error: getErrorMessage(error),
         success: null 
        },
      });
    }
  },
  deleteUser: async (id) => {
    set({ deleteState: { loading: true, error: null, success: null  } });
    try {
      await api.delete(`/users/${id}`);
      set((state) => ({
        users: state.users.filter((u) => u.id !== id),
        deleteState: { loading: false, error: null , success: "User deleted" },
      }));
    } catch (error: unknown) {
      set({
        fetchState: {
          loading: false,
          error: getErrorMessage(error),
          success: null 
        },
      });
    }
  },
}));
