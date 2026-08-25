import { io, type Socket } from 'socket.io-client';
import { VITE_GATEWAY_BASE_URL } from '../env';
import { getUser } from '../lib/utils';

export interface NotificationPayload {
  id: string;
  type: string;
  message: string;
  entityId: string;
  entityType: string;
  createdAt: string;
}

interface ServerToClientEvents {
  'notification:new': (payload: NotificationPayload) => void;
}

type AppSocket = Socket<ServerToClientEvents>;

let socket: AppSocket | null = null;

export const connectSocket = (): AppSocket => {
  if (socket?.connected) return socket;

  const token = getUser()?.token;

  socket = io(VITE_GATEWAY_BASE_URL, {
    auth: { token },
    transports: ['websocket'],
    reconnectionAttempts: 5,
    path: '/socket.io',
  }) as AppSocket;

  return socket;
};

export const disconnectSocket = (): void => {
  socket?.disconnect();
  socket = null;
};

export const getSocket = (): AppSocket | null => socket;
