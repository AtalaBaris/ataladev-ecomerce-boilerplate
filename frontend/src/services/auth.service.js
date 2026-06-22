import Cookies from 'js-cookie';
import api from './api';
import { API_ENDPOINTS, AUTH_TOKEN_KEY } from '@/utils/constants';

export const authService = {
  /**
   * @param {string} email
   * @param {string} password
   */
  async login(email, password) {
    const { data } = await api.post(API_ENDPOINTS.auth.login, {
      email,
      password,
    });

    if (data.success && data.data?.token) {
      Cookies.set(AUTH_TOKEN_KEY, data.data.token, {
        expires: 7,
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production',
      });
    }

    return data;
  },

  async verifyToken() {
    const { data } = await api.get(API_ENDPOINTS.auth.me);
    return data;
  },

  logout() {
    Cookies.remove(AUTH_TOKEN_KEY);
  },
};
