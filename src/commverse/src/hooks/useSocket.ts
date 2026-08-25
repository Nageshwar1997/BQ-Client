import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { getUser } from '../lib/utils';
import { useNotificationStore } from '../lib/store/notificationStore';
import {
  releaseSocket,
  retainSocket,
  type NotificationPayload,
  VERSA_3D_GENERATION_COMPLETED,
  VERSA_3D_GENERATION_FAILED,
} from '../services/socket-services';

const ASSET_TYPES = [
  'asset_compression_completed',
  'asset_compression_failed',
  VERSA_3D_GENERATION_COMPLETED,
  VERSA_3D_GENERATION_FAILED,
] as const;
const MEDIA_TYPES = [
  'media_generation_completed',
  'media_generation_failed',
] as const;

interface UseSocketOptions {
  enabled?: boolean;
  onNotification?: (notification: NotificationPayload) => void;
  onError?: (error: Error) => void;
}

export const useSocket = (options?: UseSocketOptions) => {
  const enabled = options?.enabled ?? true;
  const onNotificationCallback = options?.onNotification;
  const onErrorCallback = options?.onError;
  const push = useNotificationStore((s) => s.push);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!enabled) return;

    const user = getUser();
    if (!user?.token) return;

    const socket = retainSocket();

    const onNotification = (notification: NotificationPayload) => {
      push(notification);
      onNotificationCallback?.(notification);

      if ((ASSET_TYPES as readonly string[]).includes(notification.type)) {
        void queryClient.invalidateQueries({ queryKey: ['get-3d-assets'] });
        if (notification.entityId) {
          void queryClient.invalidateQueries({
            queryKey: ['get-3d-asset', notification.entityId],
          });
        }
        void queryClient.invalidateQueries({
          queryKey: ['onboarding-session'],
        });
      }

      if ((MEDIA_TYPES as readonly string[]).includes(notification.type)) {
        void queryClient.invalidateQueries({ queryKey: ['generated-media'] });
        void queryClient.invalidateQueries({
          queryKey: ['onboarding-session'],
        });
      }
    };

    const onConnectError = (error: Error) => {
      onErrorCallback?.(error);
    };

    socket.on('notification:new', onNotification);
    socket.on('connect_error', onConnectError);

    return () => {
      socket.off('notification:new', onNotification);
      socket.off('connect_error', onConnectError);
      releaseSocket();
    };
  }, [enabled, onErrorCallback, onNotificationCallback, push, queryClient]);
};
