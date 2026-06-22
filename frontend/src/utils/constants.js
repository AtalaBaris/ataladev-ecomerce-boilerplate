export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export const AUTH_TOKEN_KEY = 'atala_token';
export const REFRESH_TOKEN_KEY = 'atala_refresh_token';

export const ADMIN_ROLES = ['ADMIN'];

export const FREE_SHIPPING_THRESHOLD = 1500;

export const API_ENDPOINTS = {
  auth: {
    adminLogin: '/api/auth/admin/login',
    adminLogout: '/api/auth/admin/logout',
    adminRefresh: '/api/auth/admin/refresh',
    adminMe: '/api/auth/admin/me',
    adminForgotPassword: '/api/auth/admin/forgot-password',
    adminResetPassword: '/api/auth/admin/reset-password',
    adminLoginLogs: '/api/auth/admin/login-logs',
    login: '/api/auth/login',
    register: '/api/auth/register',
    me: '/api/auth/me',
  },
  products: '/api/products',
  orders: '/api/orders',
  cart: '/api/cart',
};
