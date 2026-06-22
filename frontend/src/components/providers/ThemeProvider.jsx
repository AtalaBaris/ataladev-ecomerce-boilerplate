'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { AUTH_TOKEN_KEY } from '@/utils/constants';
import useAuthStore from '@/store/useAuthStore';
import { authService } from '@/services/auth.service';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('dark');
  const setAuth = useAuthStore((state) => state.setAuth);
  const logout = useAuthStore((state) => state.logout);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  useEffect(() => {
    const token = Cookies.get(AUTH_TOKEN_KEY);
    if (!token) return;

    authService
      .verifyToken()
      .then((response) => {
        if (response.success) {
          setAuth(response.data.user, token);
        }
      })
      .catch(() => {
        authService.logout();
        logout();
      });
  }, [setAuth, logout]);

  const toggleTheme = () => {
    setTheme((current) => (current === 'dark' ? 'light' : 'dark'));
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}
