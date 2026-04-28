import type { TUserStore } from '@/types/store.type';
import { create } from 'zustand';

const useUserStore = create<TUserStore>((set) => ({
  user: null,
  authenticated: false,

  setUser: (user) => set({ user, authenticated: !!user }),
  logout: () => set({ user: null, authenticated: false }),
}));

export default useUserStore;