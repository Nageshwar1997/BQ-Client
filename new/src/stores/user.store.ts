import type { IUser } from '@/types/api.type';
import type { TUserStore } from '@/types/store.type';
import { decryptData, encryptData } from '@/utils/crypto.util';
import { create } from 'zustand';

const SESSION_KEY = 'user';

const useUserStore = create<TUserStore>((set) => {
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
      if (user) sessionStorage.setItem(SESSION_KEY, encryptData(user));
      else sessionStorage.removeItem(SESSION_KEY);

      set({ user, authenticated: !!user });
    },
  };
});

export default useUserStore;
