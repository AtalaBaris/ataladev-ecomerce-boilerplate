'use client';

import { useEffect } from 'react';
import Cookies from 'js-cookie';
import { AUTH_TOKEN_KEY } from '@/utils/constants';
import useAuthStore from '@/store/useAuthStore';
import { authService } from '@/services/auth.service';

export function StoreSessionProvider({ children }) {
  const setAuth = useAuthStore((state) => state.setAuth);
  const logout = useAuthStore((state) => state.logout);

  useEffect(() => {
    const token = Cookies.get(AUTH_TOKEN_KEY);
    if (!token) return;

    let cancelled = false;

    async function hydrateSession() {
      try {
        const response = await authService.verifySession();
        if (cancelled) return;

        if (response.success && response.data.user) {
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

          if (refreshed.success && refreshed.data?.user) {
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
