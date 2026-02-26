import { create } from 'zustand';
import type { TAuthAction } from '@/Types/Common.type';

export const useActionStore = create<TAuthAction>((set, get) => ({
  action: null,
  setAction: (action) => set({ action }),
  runAction: () => {
    const { action } = get();
    if (action) {
      action();
      set({ action: null });
    }
  },
  clearAction: () => set({ action: null }),
}));
