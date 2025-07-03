import { create } from "zustand";
import { UserStoreType, UserTypes } from "../types";
import { encryptData, decryptData, removeStorageUser } from "../utils";

const SESSION_KEY = "user" as const;

export const useUserStore = create<UserStoreType>((set) => {
  const encrypted = sessionStorage.getItem(SESSION_KEY);
  let user: UserTypes | null = null;

  try {
    const decrypted = decryptData(encrypted || "");
    user = decrypted ? JSON.parse(decrypted) : null;
  } catch (err) {
    console.error("Failed to parse decrypted user:", err);
    sessionStorage.removeItem(SESSION_KEY);
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
      removeStorageUser();
      set({ user: null, isAuthenticated: false });
    },
  };
});
