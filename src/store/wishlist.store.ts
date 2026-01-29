import { create } from 'zustand';
import type { TWishlistStore } from '../types';

export const useWishlistStore = create<TWishlistStore>((set) => ({
  wishlist: null,

  setWishlist: (wishlist) => set({ wishlist }),

  updateWishlist: {
    addProduct: (product) =>
      set((state) => {
        const wishlist = state.wishlist;
        if (!wishlist) return state;

        const exists = wishlist.products.some((p) => p._id === product._id);

        if (exists) return state; // already in wishlist

        const newProduct = { ...product, _id: Date.now().toString(), wishlist: wishlist._id }; // NOTE: _id is temporary

        return { wishlist: { ...wishlist, products: [...wishlist.products, newProduct] } };
      }),
    removeProduct: (productId) =>
      set((state) => {
        if (!state.wishlist) return state;
        return {
          wishlist: {
            ...state.wishlist,
            products: state.wishlist.products.filter((p) => p._id !== productId),
          },
        };
      }),
  },
}));
