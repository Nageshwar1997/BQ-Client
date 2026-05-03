import type { TTheme, TThemeStore } from '@/types/store.type';
import { create } from 'zustand';

const useThemeStore = create<TThemeStore>((set) => {
  const currentTheme = localStorage.getItem('theme') || '';
  const isValidTheme = currentTheme && ['dark', 'light'].includes(currentTheme);

  return {
    theme: isValidTheme ? (currentTheme as TTheme) : 'dark',
    toggleTheme: () =>
      set((state) => {
        const newTheme = state.theme === 'dark' ? 'light' : 'dark';
        localStorage.setItem('theme', newTheme);
        return { theme: newTheme };
      }),
  };
});

export default useThemeStore;
