import { create } from "zustand";
import { ICart, TCartProduct } from "../types";

export type TCartStore = {
  cart: ICart | null;
  setCart: (cart: ICart | null) => void;
  addProductToCart: (
    product: TCartProduct["product"],
    shade?: TCartProduct["shade"]
  ) => void;
  updateProductQuantity: (cartItemId: string, quantity: number) => void;
  removeProductFromCart: (cartItemId: string) => void;
};

const useCartStore = create<TCartStore>((set, get) => ({
  cart: null,

  setCart: (cart) => set({ cart }),

  addProductToCart: (product, shade) => {
    const cart = get().cart;
    if (!cart) return;

    const exists = cart.products.some(
      (item) =>
        item.product._id === product._id &&
        (shade ? item.shade?._id === shade._id : true)
    );

    if (exists) return; // already in cart

    const newItem = {
      _id: Date.now().toString(), // temporary id
      cart: cart._id,
      quantity: 1,
      product,
      shade,
    };

    set({ cart: { ...cart, products: [...cart.products, newItem] } });
  },

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
