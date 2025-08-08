import { create } from "zustand";
import axios from "axios";


const api = axios.create({
  baseURL: "/api/auth",
  withCredentials: true,
});

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  loading: false,
  isAppLoading: true,
  error: null,

  setUser: (user) => set({ user }),

  login: async (email, password, rememberMe) => {
    set({ loading: true, error: null });
    try {
      const { data } = await api.post("/login", {
        email,
        password,
        rememberMe,
      });
      const user = data.user || data;
      set({ user, loading: false, error: null });
      return user;
    } catch (err: any) {
      const errorMessage = axios.isAxiosError(err)
        ? err.response?.data?.message || "Login failed"
        : "Login failed, please try again!";
      set({ loading: false, error: errorMessage });
      return null;
    }
  },

  logout: async () => {
    set({ loading: true, error: null });
    try {
      await api.post("/logout");
      set({ user: null, loading: false, error: null });
    } catch (err: any) {
      // Even if logout fails, clear user locally
      set({ user: null, loading: false, error: null });
    }
  },

  fetchMe: async () => {
    set({ isAppLoading: true, error: null });
    try {
      const { data } = await api.get("/me");
      const user = data.user || data;
      set({ user, isAppLoading: false, error: null });
      return user;
    } catch (err: any) {
      // Silent fail for fetchMe - user not authenticated
      set({ user: null, isAppLoading: false, error: null });
      return null;
    }
  },
}));
