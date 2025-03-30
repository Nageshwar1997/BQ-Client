import { create } from "zustand";
import { UserStoreType } from "../types/index";
import { removeUserLocal, removeUserSession } from "../utils";

export const useUserStore = create<UserStoreType>((set) => ({
  user: null,

  setUser: (user) => set({ user }),

  logout: () => {
    removeUserLocal();
    removeUserSession();
    set(() => ({ user: null }));
  },
}));
