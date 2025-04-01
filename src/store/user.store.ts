import { create } from "zustand";
import CryptoJS from "crypto-js";
import { UserStoreType, UserTypes } from "../types";
import { removeUserLocal, removeUserSession } from "../utils";
import { ENCRYPTION_SECRET_KEY } from "../envs/index.env";

// Function to decrypt user data
const decryptUser = (encryptedUser: string | null): UserTypes | null => {
  if (!encryptedUser) return null;

  try {
    const bytes = CryptoJS.AES.decrypt(encryptedUser, ENCRYPTION_SECRET_KEY);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  } catch (error) {
    console.error("Failed to decrypt user:", error);
    return null;
  }
};

export const useUserStore = create<UserStoreType>((set) => ({
  user: decryptUser(sessionStorage.getItem("user")), // Decrypt when initializing
  isAuthenticated: !!sessionStorage.getItem("user"),

  setUser: (user) => {
    const encryptedUser = CryptoJS.AES.encrypt(
      JSON.stringify(user),
      ENCRYPTION_SECRET_KEY
    ).toString();

    sessionStorage.setItem("user", encryptedUser);
    set({ user, isAuthenticated: true });
  },

  logout: () => {
    sessionStorage.removeItem("user");
    removeUserLocal();
    removeUserSession();
    set(() => ({ user: null, isAuthenticated: false }));
  },
}));
