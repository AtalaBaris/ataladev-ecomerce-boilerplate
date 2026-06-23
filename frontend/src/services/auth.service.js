import Cookies from 'js-cookie';
import api from './api';
import {
  API_ENDPOINTS,
  AUTH_TOKEN_KEY,
  REFRESH_TOKEN_KEY,
  ADMIN_ROLES,
} from '@/utils/constants';

function storeTokens(accessToken, refreshToken) {
  Cookies.set(AUTH_TOKEN_KEY, accessToken, {
    expires: 1,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
  });

  if (refreshToken) {
    Cookies.set(REFRESH_TOKEN_KEY, refreshToken, {
      expires: 7,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
    });
  }
}

function clearTokens() {
  Cookies.remove(AUTH_TOKEN_KEY);
  Cookies.remove(REFRESH_TOKEN_KEY);
}

export const authService = {
  async adminLogin(email, password) {
    const { data } = await api.post(API_ENDPOINTS.auth.adminLogin, {
      email,
      password,
    });

    if (data.success && data.data?.accessToken) {
      storeTokens(data.data.accessToken, data.data.refreshToken);
    }

    return data;
  },

  async refreshSession() {
    const refreshToken = Cookies.get(REFRESH_TOKEN_KEY);
    if (!refreshToken) {
      throw new Error('Refresh token yok.');
    }

    const { data } = await api.post(API_ENDPOINTS.auth.adminRefresh, {
      refreshToken,
    });

    if (data.success && data.data?.accessToken) {
      storeTokens(data.data.accessToken, data.data.refreshToken);
    }

    return data;
  },

  async verifyAdminSession() {
    const { data } = await api.get(API_ENDPOINTS.auth.adminMe);
    return data;
  },

  async forgotPassword(email) {
    const { data } = await api.post(API_ENDPOINTS.auth.adminForgotPassword, {
      email,
    });
    return data;
  },

  async resetPassword(token, password) {
    const { data } = await api.post(API_ENDPOINTS.auth.adminResetPassword, {
      token,
      password,
    });
    return data;
  },

  async getLoginLogs(limit = 50) {
    const { data } = await api.get(API_ENDPOINTS.auth.adminLoginLogs, {
      params: { limit },
    });
    return data;
  },

  async clearLoginLogs() {
    const { data } = await api.delete(API_ENDPOINTS.auth.adminLoginLogs);
    return data;
  },

  async logout() {
    const refreshToken = Cookies.get(REFRESH_TOKEN_KEY);

    try {
      await api.post(API_ENDPOINTS.auth.adminLogout, {
        refreshToken: refreshToken || undefined,
      });
    } finally {
      clearTokens();
    }
  },

  isAdminRole(role) {
    return ADMIN_ROLES.includes(role);
  },

  clearTokens,
};
