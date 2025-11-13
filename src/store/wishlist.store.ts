import { create } from "zustand";
import { IWishlist } from "../types";

export type TWishListStore = {
  wishlist: IWishlist | null;
  setWishlist: (wishlist: IWishlist | null) => void;
  addWishlistProduct: (product: IWishlist["products"][number]) => void;
  removeWishlistProduct: (productId: string) => void;
};

const useWishlistStore = create<TWishListStore>((set) => ({
  wishlist: null,

  setWishlist: (wishlist) => set({ wishlist }),

  addWishlistProduct: (product) =>
    set((state) => {
      const wishlist = state.wishlist;
      if (!wishlist) return state;

      const exists = wishlist.products.some((p) => p._id === product._id);

      if (exists) return state; // already in wishlist

      const newProduct = {
        ...product,
        _id: Date.now().toString(), // temporary id
        wishlist: wishlist._id,
      };

      return {
        wishlist: {
          ...wishlist,
          products: [...wishlist.products, newProduct],
        },
      };
    }),

  removeWishlistProduct: (productId) =>
    set((state) => {
      if (!state.wishlist) return state;
      return {
        wishlist: {
          ...state.wishlist,
          products: state.wishlist.products.filter((p) => p._id !== productId),
        },
      };
    }),
}));

export default useWishlistStore;
