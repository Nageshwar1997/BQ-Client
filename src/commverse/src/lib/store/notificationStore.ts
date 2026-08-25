import { create } from 'zustand';
import type { NotificationPayload } from '../../services/socket-services';

interface NotificationState {
  queue: NotificationPayload[];
  push: (notification: NotificationPayload) => void;
  dismiss: () => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  queue: [],
  push: (notification) =>
    set((state) => ({ queue: [...state.queue, notification] })),
  dismiss: () => set((state) => ({ queue: state.queue.slice(1) })),
}));
