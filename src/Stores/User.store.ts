import { create } from 'zustand';
import type { IUser } from '@/Types/Api.type';
import type { TUserStore } from '@/Types/Store.type';
import { decryptData, encryptData } from '@/Utils/Crypto.util';
import { removeStorageToken } from '@/Utils/Storage.util';

const SESSION_KEY = 'user';

export const useUserStore = create<TUserStore>((set) => {
  const getInitialUser = (): IUser | null => {
    const encrypted = sessionStorage.getItem(SESSION_KEY);
    const decrypted = decryptData(encrypted ?? '');
    return decrypted && typeof decrypted === 'object' ? (decrypted as IUser) : null;
  };

  const user = getInitialUser();

  return {
    user,
    authenticated: !!user,

    setUser: (user) => {
      sessionStorage.setItem(SESSION_KEY, encryptData(user));
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
