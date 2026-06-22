import { create } from 'zustand';

const useUiStore = create((set) => ({
  isSidebarOpen: true,
  isCartDrawerOpen: false,

  toggleSidebar: () =>
    set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),

  setSidebarOpen: (isSidebarOpen) => set({ isSidebarOpen }),

  toggleCartDrawer: () =>
    set((state) => ({ isCartDrawerOpen: !state.isCartDrawerOpen })),

  setCartDrawerOpen: (isCartDrawerOpen) => set({ isCartDrawerOpen }),
}));

export default useUiStore;
