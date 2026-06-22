import { create } from 'zustand';
import { ADMIN_ROLES } from '@/utils/constants';

const useAuthStore = create((set) => ({
  user: null,
  token: null,
  isAdmin: false,
  isAuthenticated: false,

  setAuth: (user, token) =>
    set({
      user,
      token,
      isAdmin: ADMIN_ROLES.includes(user?.role),
      isAuthenticated: true,
    }),

  logout: () =>
    set({
      user: null,
      token: null,
      isAdmin: false,
      isAuthenticated: false,
    }),
}));

export default useAuthStore;
