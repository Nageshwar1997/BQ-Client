import { io, type Socket } from 'socket.io-client';
import { VITE_GATEWAY_BASE_URL } from '../../env';
import { getUser } from '../../lib/utils';

export const NOTIFICATION_TYPES = [
  'media_generation_completed',
  'media_generation_failed',
  'asset_compression_completed',
  'asset_compression_failed',
  'vton_generation_completed',
  'vton_generation_failed',
  'versa_3d_generation_completed',
  'versa_3d_generation_failed',
  'versa_image_generation_completed',
  'versa_image_generation_failed',
] as const;
export type NotificationTypeValue = (typeof NOTIFICATION_TYPES)[number];

export const VERSA_3D_GENERATION_COMPLETED = 'versa_3d_generation_completed';
export const VERSA_3D_GENERATION_FAILED = 'versa_3d_generation_failed';
export const VERSA_IMAGE_GENERATION_COMPLETED =
  'versa_image_generation_completed';
export const VERSA_IMAGE_GENERATION_FAILED = 'versa_image_generation_failed';

export interface NotificationPayload {
  id: string;
  type: NotificationTypeValue | (string & {});
  message: string;
  entityId: string | null;
  entityType: string | null;
  createdAt: string | Date;
}

interface ServerToClientEvents {
  'notification:new': (payload: NotificationPayload) => void;
}

type AppSocket = Socket<ServerToClientEvents>;

let socket: AppSocket | null = null;
let socketSubscribers = 0;
let disconnectTimeout: ReturnType<typeof setTimeout> | null = null;
const DISCONNECT_GRACE_MS = 300;

const clearDisconnectTimeout = () => {
  if (!disconnectTimeout) return;
  clearTimeout(disconnectTimeout);
  disconnectTimeout = null;
};

export const connectSocket = (): AppSocket => {
  clearDisconnectTimeout();
  if (socket) return socket;

  const token = getUser()?.token;

  socket = io(VITE_GATEWAY_BASE_URL, {
    auth: { token },
    transports: ['websocket'],
    reconnectionAttempts: 5,
    path: '/socket.io',
  }) as AppSocket;

  return socket;
};

export const retainSocket = (): AppSocket => {
  socketSubscribers += 1;
  return connectSocket();
};

export const releaseSocket = (): void => {
  socketSubscribers = Math.max(0, socketSubscribers - 1);
  if (socketSubscribers > 0) return;

  clearDisconnectTimeout();
  disconnectTimeout = setTimeout(() => {
    if (socketSubscribers > 0) return;
    socket?.disconnect();
    socket = null;
    disconnectTimeout = null;
  }, DISCONNECT_GRACE_MS);
};

export const disconnectSocket = (): void => {
  socketSubscribers = 0;
  clearDisconnectTimeout();
  socket?.disconnect();
  socket = null;
};

export const getSocket = (): AppSocket | null => socket;
