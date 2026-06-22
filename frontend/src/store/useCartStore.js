import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product, quantity = 1) => {
        const items = get().items;
        const existing = items.find((item) => item.id === product.id);

        if (existing) {
          set({
            items: items.map((item) =>
              item.id === product.id
                ? { ...item, quantity: item.quantity + quantity }
                : item,
            ),
          });
          return;
        }

        set({ items: [...items, { ...product, quantity }] });
      },

      removeItem: (productId) =>
        set({ items: get().items.filter((item) => item.id !== productId) }),

      updateQuantity: (productId, quantity) =>
        set({
          items: get().items.map((item) =>
            item.id === productId ? { ...item, quantity } : item,
          ),
        }),

      clearCart: () => set({ items: [] }),

      getTotal: () =>
        get().items.reduce(
          (total, item) => total + item.price * item.quantity,
          0,
        ),
    }),
    { name: 'atala-cart' },
  ),
);

export default useCartStore;
