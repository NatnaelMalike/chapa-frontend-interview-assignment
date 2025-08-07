// src/services/auth-api.ts
import axios from 'axios';
import { useState } from 'react';
import { useAuthStore } from '@/store/auth-store';

const api = axios.create({
  baseURL: '/api/auth',
  withCredentials: true,
});

const authApi = {
  login: (email: string, password: string, rememberMe: boolean) =>
    api.post('/login', { email, password, rememberMe }),

  logout: () => api.post('/logout'),
  
  getMe: () => api.get('/me'),
};

export function useAuth() {
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setUser, clearUser } = useAuthStore();

  const login = async (email: string, password: string, rememberMe: boolean) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await authApi.login(email, password, rememberMe);
      setUser(data);
      console.log('Login successful:', data);
      return data;
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'Login failed');
      } else {
        setError('Login failed, please try again!');
      }
    return null;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
      clearUser();
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  const getCurrentUser = async () => {
    try {
      const { data } = await authApi.getMe();
      if (data.user) setUser(data.user);
      return data;
    } catch (err) {
      clearUser();
    }
  };

  return { login, logout, getCurrentUser, isLoading, error };
}