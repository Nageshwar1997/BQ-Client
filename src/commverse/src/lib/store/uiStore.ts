import { create } from 'zustand';

interface UIState {
  isLoggingOut: boolean;
  setIsLoggingOut: (value: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  isLoggingOut: false,
  setIsLoggingOut: (isLoggingOut) => set({ isLoggingOut }),
}));
