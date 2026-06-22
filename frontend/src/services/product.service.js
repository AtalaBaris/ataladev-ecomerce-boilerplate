import api from './api';
import { API_ENDPOINTS } from '@/utils/constants';

export const productService = {
  async getProducts(params = {}) {
    const { data } = await api.get(API_ENDPOINTS.products, { params });
    return data;
  },

  async getProductBySlug(slug) {
    const { data } = await api.get(`${API_ENDPOINTS.products}/${slug}`);
    return data;
  },

  async createProduct(payload) {
    const { data } = await api.post(API_ENDPOINTS.products, payload);
    return data;
  },
};
