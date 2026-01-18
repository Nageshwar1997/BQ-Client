import { create } from 'zustand';
import type { IUser, TUserStore } from '../types';
import { decryptData, encryptData, removeStorageToken } from '../utils';
const SESSION_KEY = 'user';

export const useUserStore = create<TUserStore>((set) => {
  const encrypted = sessionStorage.getItem(SESSION_KEY);
  let user: IUser | null = null;
  const decrypted = decryptData(encrypted ?? '');
  if (decrypted && typeof decrypted === 'object') {
    user = decrypted as IUser;
  }

  return {
    user,
    authenticated: !!user,

    setUser: (user) => {
      const encryptedUser = encryptData(user);

      sessionStorage.setItem(SESSION_KEY, encryptedUser);
      set({ user, authenticated: true });
    },

    localLogout: () => {
      sessionStorage.removeItem(SESSION_KEY);
      removeStorageToken();
      set({ user: null, authenticated: false });
      // Reset cart on logout
      //   const { setCart } = useCartStore.getState();
      //   const { setWishlist } = useWishlistStore.getState();
      //   setCart(null);
      //   setWishlist(null);
    },
  };
});
