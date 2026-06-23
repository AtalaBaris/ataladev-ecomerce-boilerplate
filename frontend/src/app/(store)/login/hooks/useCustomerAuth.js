'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/auth.service';
import useAuthStore from '@/store/useAuthStore';

export function useCustomerAuth() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = useCallback(
    async (email, password, redirectTo = '/profile') => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await authService.login(email, password);

        if (!response.success) {
          throw new Error(response.error?.message || 'Giriş başarısız.');
        }

        const { user, accessToken } = response.data;
        setAuth(user, accessToken);
        router.push(redirectTo);
        return response;
      } catch (err) {
        const message =
          err.response?.data?.error?.message ||
          err.message ||
          'Giriş sırasında bir hata oluştu.';
        setError(message);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [router, setAuth],
  );

  const register = useCallback(
    async (formData, redirectTo = '/profile') => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await authService.register(formData);

        if (!response.success) {
          throw new Error(response.error?.message || 'Kayıt başarısız.');
        }

        const { user, accessToken } = response.data;
        setAuth(user, accessToken);
        router.push(redirectTo);
        return response;
      } catch (err) {
        const message =
          err.response?.data?.error?.message ||
          err.message ||
          'Kayıt sırasında bir hata oluştu.';
        setError(message);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [router, setAuth],
  );

  const logout = useCallback(async () => {
    await authService.logout();
    useAuthStore.getState().logout();
    router.push('/');
  }, [router]);

  return { login, register, logout, isLoading, error, setError };
}
