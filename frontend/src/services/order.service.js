import api from './api';
import { API_ENDPOINTS } from '@/utils/constants';

export const orderService = {
  async createOrder(payload) {
    const { data } = await api.post(API_ENDPOINTS.orders, payload);
    return data;
  },

  async getOrders(params = {}) {
    const { data } = await api.get(API_ENDPOINTS.orders, { params });
    return data;
  },
};
