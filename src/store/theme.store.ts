import { create } from "zustand";
import { TThemeStore, TTheme } from "../types";

const useThemeStore = create<TThemeStore>((set) => ({
  theme: (localStorage.getItem("theme") as TTheme) || "dark",
  toggleTheme: () =>
    set((state) => {
      const newTheme = state.theme === "dark" ? "light" : "dark";
      localStorage.setItem("theme", newTheme);
      return { theme: newTheme };
    }),
}));

export default useThemeStore;
