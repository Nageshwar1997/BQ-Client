import type { ICart, ICartItem, IUser, IWishlist } from './Api.type';

export type TTheme = 'light' | 'dark';

export type TThemeStore = {
  theme: TTheme;
  toggleTheme: () => void;
};

export type TUserStore = {
  user: IUser | null;
  authenticated: boolean;
  setUser: (user: IUser) => void;
  localLogout: () => void;
};

export type TWishlistStore = {
  wishlist: IWishlist | null;
  setWishlist: (wishlist: IWishlist | null) => void;
  updateWishlist: {
    addProduct: (product: IWishlist['products'][number]) => void;
    removeProduct: (productId: string) => void;
  };
};

export type TCartStore = {
  cart: ICart | null;
  setCart: (cart: ICart | null) => void;
  updateCart: {
    addProduct: (product: ICartItem['product'], shade?: ICartItem['shade']) => void;
    updateQuantity: (cartItemId: string, quantity: number) => void;
    removeProduct: (cartItemId: string) => void;
  };
};
