import { create } from 'zustand';
import { nanoid } from 'nanoid';
import type { IToastStore } from '@/types';

export const useToastStore = create<IToastStore>((set) => ({
  toasts: [],
  addToast: (toast) => set((state) => ({ toasts: [...state.toasts, { ...toast, id: nanoid() }] })),
  removeToast: (id) => set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
}));
