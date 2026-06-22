export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export const AUTH_TOKEN_KEY = 'atala_token';

export const ADMIN_ROLES = ['ADMIN', 'admin'];

export const FREE_SHIPPING_THRESHOLD = 1500;

export const API_ENDPOINTS = {
  auth: {
    login: '/api/auth/login',
    register: '/api/auth/register',
    me: '/api/auth/me',
  },
  products: '/api/products',
  orders: '/api/orders',
  cart: '/api/cart',
};
