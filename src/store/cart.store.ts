import { create } from "zustand";
import { ICart } from "../types";

export type TCartStore = {
  cart: ICart | null;
  setCart: (cart: ICart | null) => void;
  updateProductQuantity: (cartItemId: string, quantity: number) => void;
  removeProductFromCart: (cartItemId: string) => void;
};

const useCartStore = create<TCartStore>((set) => ({
  cart: null,
  setCart: (cart) => set({ cart }),
  updateProductQuantity: (cartItemId, quantity) =>
    set((state) => {
      if (!state.cart) return state;
      return {
        cart: {
          ...state.cart,
          products: state.cart.products.map((item) =>
            item._id === cartItemId ? { ...item, quantity } : item
          ),
        },
      };
    }),
  removeProductFromCart: (cartItemId) =>
    set((state) => {
      if (!state.cart) return state;
      return {
        cart: {
          ...state.cart,
          products: state.cart.products.filter(
            (item) => item._id !== cartItemId
          ),
        },
      };
    }),
}));

export default useCartStore;
