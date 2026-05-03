import type { TActionsStore } from '@/types/store.type';
import { create } from 'zustand';

const useActionsStore = create<TActionsStore>((set, get) => ({
  actions: [],

  addAction: (action) => set((state) => ({ actions: [...state.actions, action] })),

  runNextAction: async () => {
    const { actions } = get();

    if (!actions.length) return;

    const [first, ...rest] = actions;

    await first();

    set({ actions: rest });
  },

  runAllActions: async () => {
    while (get().actions.length) {
      await get().runNextAction();
    }
  },
}));

export default useActionsStore;
