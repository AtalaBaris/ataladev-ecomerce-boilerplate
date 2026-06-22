'use client';

import { useEffect } from 'react';
import Cookies from 'js-cookie';
import { AUTH_TOKEN_KEY } from '@/utils/constants';
import useAuthStore from '@/store/useAuthStore';
import { authService } from '@/services/auth.service';

export function AdminSessionProvider({ children }) {
  const setAuth = useAuthStore((state) => state.setAuth);
  const logout = useAuthStore((state) => state.logout);

  useEffect(() => {
    const token = Cookies.get(AUTH_TOKEN_KEY);
    if (!token) return;

    let cancelled = false;

    async function hydrateSession() {
      try {
        const response = await authService.verifyAdminSession();
        if (cancelled) return;

        if (response.success && authService.isAdminRole(response.data.user?.role)) {
          setAuth(response.data.user, token);
          return;
        }

        authService.clearTokens();
        logout();
      } catch {
        if (cancelled) return;

        try {
          const refreshed = await authService.refreshSession();
          if (cancelled) return;

          if (refreshed.success && authService.isAdminRole(refreshed.data.user?.role)) {
            setAuth(refreshed.data.user, refreshed.data.accessToken);
            return;
          }
        } catch {
          // refresh başarısız
        }

        authService.clearTokens();
        logout();
      }
    }

    hydrateSession();

    return () => {
      cancelled = true;
    };
  }, [setAuth, logout]);

  return children;
}
