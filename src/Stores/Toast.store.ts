import { create } from 'zustand';
import { nanoid } from 'nanoid';
import type { TToast } from '@/Types/Common.type';

export type ToastItem = TToast & { id: string };

interface ToastState {
  toasts: ToastItem[];
  addToast: (toast: TToast) => void;
  removeToast: (id: string) => void;
}

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  addToast: (toast) => set((state) => ({ toasts: [...state.toasts, { ...toast, id: nanoid() }] })),
  removeToast: (id) => set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
}));
