'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/auth.service';
import useAuthStore from '@/store/useAuthStore';

export function useAdminAuth() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = useCallback(
    async (email, password) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await authService.login(email, password);

        if (!response.success) {
          throw new Error(response.error?.message || 'Giriş başarısız.');
        }

        const { user, token } = response.data;
        setAuth(user, token);
        router.push('/admin/dashboard');
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

  const logout = useCallback(() => {
    authService.logout();
    useAuthStore.getState().logout();
    router.push('/admin/login');
  }, [router]);

  return { login, logout, isLoading, error, setError };
}
