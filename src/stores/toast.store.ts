import type { IToastStore } from '@/types/store.type';
import { nanoid } from 'nanoid';
import { create } from 'zustand';

const useToastStore = create<IToastStore>((set) => ({
  toasts: [],
  addToast: (toast) => {
    const id = nanoid();

    set((state) => ({
      toasts: [...state.toasts, { ...toast, id }],
    }));

    return id; // return the id of the toast for removal
  },
  removeToast: (id) => set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
}));

export default useToastStore;
