import api from './api';
import { API_ENDPOINTS } from '@/utils/constants';

export const cartService = {
  async getCart() {
    const { data } = await api.get(API_ENDPOINTS.cart);
    return data;
  },

  async syncCart(items) {
    const { data } = await api.put(API_ENDPOINTS.cart, { items });
    return data;
  },
};
