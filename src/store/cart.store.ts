import { create } from "zustand";
import { ICart } from "../types";

export type TCartStore = {
  cart: ICart | null;
  setCart: (cart: ICart | null) => void;
};

const useCartStore = create<TCartStore>((set) => ({
  cart: null,
  setCart: (cart) => set({ cart }),
}));

export default useCartStore;
