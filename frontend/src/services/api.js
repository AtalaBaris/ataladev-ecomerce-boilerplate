import axios from 'axios';
import Cookies from 'js-cookie';
import {
  API_BASE_URL,
  AUTH_TOKEN_KEY,
  REFRESH_TOKEN_KEY,
} from '@/utils/constants';
import { isPublicAuthRequest } from '@/utils/auth-routes';
import { authService } from './auth.service';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

let isRefreshing = false;
let refreshQueue = [];

function processQueue(error, token = null) {
  refreshQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(token);
  });
  refreshQueue = [];
}

function shouldAttemptRefresh(error, originalRequest) {
  if (error.response?.status !== 401) return false;
  if (originalRequest._retry) return false;
  if (originalRequest.url?.includes('/api/auth/refresh')) return false;
  if (!originalRequest.url?.includes('/api/auth')) return false;
  if (isPublicAuthRequest(originalRequest.url)) return false;
  if (!Cookies.get(REFRESH_TOKEN_KEY)) return false;
  return true;
}

api.interceptors.request.use(
  (config) => {
    const token = Cookies.get(AUTH_TOKEN_KEY);

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (!shouldAttemptRefresh(error, originalRequest)) {
      if (
        error.response?.status === 401 &&
        originalRequest.url?.includes('/api/auth') &&
        !isPublicAuthRequest(originalRequest.url)
      ) {
        authService.clearTokens();
      }
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        refreshQueue.push({ resolve, reject });
      }).then((token) => {
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return api(originalRequest);
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const result = await authService.refreshSession();
      const newToken = result.data?.accessToken;
      processQueue(null, newToken);
      originalRequest.headers.Authorization = `Bearer ${newToken}`;
      return api(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError, null);
      authService.clearTokens();
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);

export default api;
