import { create } from "zustand";
import CryptoJS from "crypto-js";
import { UserStoreType, UserTypes } from "../types";
import { removeUserLocal, removeUserSession } from "../utils";
import { envs } from "../envs/index.env";

// Function to decrypt user data
const decryptUser = (encryptedUser: string | null): UserTypes | null => {
  if (!encryptedUser) return null;

  try {
    const bytes = CryptoJS.AES.decrypt(
      encryptedUser,
      envs.ENCRYPTION_SECRET_KEY
    );
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    return JSON.parse(decrypted);
  } catch (error) {
    console.error("Failed to decrypt user:", error);
    sessionStorage.removeItem("user");
    return null;
  }
};

export const useUserStore = create<UserStoreType>((set) => {
  const encrypted = sessionStorage.getItem("user");
  const user = decryptUser(encrypted);

  return {
    user,
    isAuthenticated: !!user,

    setUser: (user) => {
      const encryptedUser = CryptoJS.AES.encrypt(
        JSON.stringify(user),
        envs.ENCRYPTION_SECRET_KEY
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
  };
});
