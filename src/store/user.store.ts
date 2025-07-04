import { create } from "zustand";
import { UserStoreType, UserTypes } from "../types";
import { decryptData, encryptData, removeStorageToken } from "../utils";

const SESSION_KEY = "admin";

export const useUserStore = create<UserStoreType>((set) => {
  const encrypted = sessionStorage.getItem(SESSION_KEY);
  let user: UserTypes | null = null;
  const decrypted = decryptData(encrypted ?? "");
  if (decrypted && typeof decrypted === "object") {
    user = decrypted as UserTypes;
  }

  return {
    user,
    isAuthenticated: !!user,

    setUser: (user) => {
      const encryptedUser = encryptData(user);

      sessionStorage.setItem(SESSION_KEY, encryptedUser);
      set({ user, isAuthenticated: true });
    },

    logout: () => {
      sessionStorage.removeItem(SESSION_KEY);
      removeStorageToken();
      set({ user: null, isAuthenticated: false });
    },
  };
});
