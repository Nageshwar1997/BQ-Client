import axios from 'axios';
import { io, type Socket } from 'socket.io-client';

import { VITE_GATEWAY_BASE_URL } from '../../env';
import { getUser } from '../../lib/utils';
import { privateApiClient } from '../api';
import { validateGenerateMediaPayload } from './validation';

export * from './validation';

export type GeneratedMediaType = 'image' | 'video';
export type GeneratedMediaStatus =
  | 'queued'
  | 'processing'
  | 'completed'
  | 'failed';

export type GeneratedMediaOutput = {
  key: string;
  format: string;
  size: number;
  width?: number;
  height?: number;
  duration?: number;
  url: string;
};

export type GeneratedMediaItem = {
  id: string;
  title: string;
  prompt: string | null;
  mediaType: GeneratedMediaType;
  config: Record<string, unknown> | null;
  outputs: GeneratedMediaOutput[];
  status: GeneratedMediaStatus;
  isPriority: boolean;
  errorMessage: string | null;
  linkedProductId: string | null;
  linkedProductName: string | null;
  linkedOutputKey: string | null;
  generatedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

export type GenerationQueuedResponse = {
  generatedMediaId: string;
  status: 'queued';
  isPriority: boolean;
  queuePosition: number;
  estimatedWaitSec: number;
};

export type GenerateMediaPayload = {
  mediaType: GeneratedMediaType;
  images: File[];
  prompt: string;
  aspectRatio?: string;
  sampleCount?: number;
  useBrandMemory?: boolean;
  brandId?: string;
  imageMimeType?: string;
  endImageMimeType?: string;
  durationSeconds?: number;
  resolution?: string;
};

export type GeneratedMediaPagination = {
  total: number;
  totalPages: number;
  currentPage: number;
  limit: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

export type GeneratedMediaNotification = {
  id: string;
  type: string;
  message: string;
  entityId: string;
  entityType: string;
  createdAt: Date;
};

type SocketServerToClientEvents = {
  'notification:new': (payload: {
    id?: string;
    type?: string;
    message?: string;
    entityId?: string;
    entityType?: string;
    createdAt?: string | number | Date;
  }) => void;
};

type SocketClientToServerEvents = Record<string, never>;

export const toRecord = (value: unknown): Record<string, unknown> => {
  if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }
  return {};
};

const valueAsString = (value: unknown, fallback = ''): string => {
  return typeof value === 'string' ? value : fallback;
};

const valueAsNumber = (value: unknown, fallback = 0): number => {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string') {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return fallback;
};

const valueAsOptionalNumber = (value: unknown): number | undefined => {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string') {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return undefined;
};

const valueAsBoolean = (value: unknown, fallback = false): boolean => {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') {
    if (value.toLowerCase() === 'true') return true;
    if (value.toLowerCase() === 'false') return false;
  }
  return fallback;
};

const valueAsNullableString = (value: unknown): string | null => {
  return typeof value === 'string' ? value : null;
};

const valueAsDate = (value: unknown, fallback = new Date()): Date => {
  if (value instanceof Date) return value;
  if (typeof value === 'string' || typeof value === 'number') {
    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime())) return parsed;
  }
  return fallback;
};

const toErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const data = toRecord(error.response?.data);
    const nestedError = toRecord(data.error);
    const dataMessage = valueAsString(data.message);
    const nestedMessage = valueAsString(nestedError.message);
    if (nestedMessage) return nestedMessage;
    if (dataMessage) return dataMessage;
    if (error.message) return error.message;
  }

  if (error instanceof Error) return error.message;
  return 'Something went wrong. Please try again.';
};

const normalizeStatus = (value: unknown): GeneratedMediaStatus => {
  const status = valueAsString(value, 'processing').toLowerCase();
  if (
    status === 'queued' ||
    status === 'processing' ||
    status === 'completed' ||
    status === 'failed'
  ) {
    return status;
  }
  return 'processing';
};

const normalizeMediaType = (value: unknown): GeneratedMediaType => {
  return valueAsString(value, 'image').toLowerCase() === 'video'
    ? 'video'
    : 'image';
};

const normalizeGeneratedMediaOutput = (
  rawOutput: unknown
): GeneratedMediaOutput => {
  const raw = toRecord(rawOutput);

  return {
    key: valueAsString(raw.key),
    format: valueAsString(raw.format),
    size: valueAsNumber(raw.size),
    width: valueAsOptionalNumber(raw.width),
    height: valueAsOptionalNumber(raw.height),
    duration: valueAsOptionalNumber(raw.duration),
    url: valueAsString(raw.url),
  };
};

const normalizeGeneratedMedia = (rawItem: unknown): GeneratedMediaItem => {
  const raw = toRecord(rawItem);
  const outputs = Array.isArray(raw.outputs)
    ? raw.outputs.map(normalizeGeneratedMediaOutput)
    : [];

  return {
    id: valueAsString(raw.id, valueAsString(raw._id, crypto.randomUUID())),
    title: valueAsString(raw.title, 'Generated Media'),
    prompt: valueAsNullableString(raw.prompt),
    mediaType: normalizeMediaType(raw.mediaType),
    config:
      raw.config !== null &&
        typeof raw.config === 'object' &&
        !Array.isArray(raw.config)
        ? (raw.config as Record<string, unknown>)
        : null,
    outputs,
    status: normalizeStatus(raw.status),
    isPriority: valueAsBoolean(raw.isPriority, false),
    errorMessage: valueAsNullableString(raw.errorMessage),
    linkedProductId: valueAsNullableString(raw.linkedProductId),
    linkedProductName: valueAsNullableString(raw.linkedProductName),
    linkedOutputKey: valueAsNullableString(raw.linkedOutputKey),
    generatedAt:
      raw.generatedAt === null
        ? null
        : valueAsDate(raw.generatedAt, new Date()),
    createdAt: valueAsDate(raw.createdAt, new Date()),
    updatedAt: valueAsDate(raw.updatedAt, new Date()),
  };
};

const normalizeQueueResponse = (
  rawQueue: unknown
): GenerationQueuedResponse => {
  const raw = toRecord(rawQueue);

  const generatedMediaId = valueAsString(
    raw.generatedMediaId,
    valueAsString(raw.id)
  );
  if (!generatedMediaId) {
    throw new Error('Invalid queue response from generated media service.');
  }

  return {
    generatedMediaId,
    status: 'queued',
    isPriority: valueAsBoolean(raw.isPriority, false),
    queuePosition: valueAsNumber(raw.queuePosition, 0),
    estimatedWaitSec: valueAsNumber(raw.estimatedWaitSec, 0),
  };
};

const normalizePagination = (
  rawPagination: unknown
): GeneratedMediaPagination => {
  const raw = toRecord(rawPagination);
  return {
    total: valueAsNumber(raw.total, 0),
    totalPages: valueAsNumber(raw.totalPages, 0),
    currentPage: valueAsNumber(raw.currentPage, 1),
    limit: valueAsNumber(raw.limit, 10),
    hasNextPage: valueAsBoolean(raw.hasNextPage, false),
    hasPreviousPage: valueAsBoolean(raw.hasPreviousPage, false),
  };
};

export const generateMedia = async (
  payload: GenerateMediaPayload
): Promise<GenerationQueuedResponse> => {
  try {
    validateGenerateMediaPayload(payload);

    const formData = new FormData();

    payload.images.forEach((file) => {
      formData.append('images', file);
    });

    formData.append('prompt', payload.prompt.trim());

    if (payload.aspectRatio) {
      formData.append('aspectRatio', payload.aspectRatio);
    }

    if (payload.mediaType === 'video' && payload.sampleCount !== undefined) {
      formData.append('sampleCount', String(payload.sampleCount));
    }

    if (payload.useBrandMemory !== undefined) {
      formData.append(
        'useBrandMemory',
        payload.useBrandMemory ? 'true' : 'false'
      );
    }

    if (payload.brandId) {
      formData.append('brandId', payload.brandId);
    }

    if (payload.imageMimeType) {
      formData.append('imageMimeType', payload.imageMimeType);
    }

    if (payload.mediaType === 'video' && payload.endImageMimeType) {
      formData.append('endImageMimeType', payload.endImageMimeType);
    }

    if (
      payload.mediaType === 'video' &&
      payload.durationSeconds !== undefined
    ) {
      formData.append('durationSeconds', String(payload.durationSeconds));
    }

    if (payload.mediaType === 'video' && payload.resolution) {
      formData.append('resolution', payload.resolution);
    }

    const response = await privateApiClient.post(
      `/generated-media/generate/${payload.mediaType}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    const responseBody = toRecord(response.data);
    return normalizeQueueResponse(responseBody.data);
  } catch (error) {
    throw new Error(toErrorMessage(error));
  }
};

export const getGeneratedMediaById = async (
  generatedMediaId: string
): Promise<GeneratedMediaItem> => {
  try {
    const response = await privateApiClient.get(
      `/generated-media/${generatedMediaId}`
    );
    const responseBody = toRecord(response.data);
    return normalizeGeneratedMedia(responseBody.data);
  } catch (error) {
    throw new Error(toErrorMessage(error));
  }
};

export const listGeneratedMedia = async (params?: {
  mediaType?: GeneratedMediaType;
  status?: GeneratedMediaStatus;
  page?: number;
  limit?: number;
}): Promise<{
  items: GeneratedMediaItem[];
  pagination: GeneratedMediaPagination;
}> => {
  try {
    const response = await privateApiClient.get('/generated-media', { params });
    const responseBody = toRecord(response.data);
    const source = Array.isArray(responseBody.data) ? responseBody.data : [];

    return {
      items: source.map(normalizeGeneratedMedia),
      pagination: normalizePagination(responseBody.pagination),
    };
  } catch (error) {
    throw new Error(toErrorMessage(error));
  }
};

export const linkGeneratedMediaToProduct = async (payload: {
  generatedMediaId: string;
  productId: string;
  outputKey: string;
}): Promise<GeneratedMediaItem> => {
  try {
    const response = await privateApiClient.put(
      `/generated-media/${payload.generatedMediaId}/link-product`,
      {
        productId: payload.productId,
        outputKey: payload.outputKey,
      }
    );

    const responseBody = toRecord(response.data);
    return normalizeGeneratedMedia(responseBody.data);
  } catch (error) {
    throw new Error(toErrorMessage(error));
  }
};

export const unlinkGeneratedMediaFromProduct = async (payload: {
  generatedMediaId: string;
  outputKey?: string;
}): Promise<GeneratedMediaItem> => {
  try {
    const response = await privateApiClient.put(
      `/generated-media/${payload.generatedMediaId}/unlink`,
      payload.outputKey ? { outputKey: payload.outputKey } : {}
    );

    const responseBody = toRecord(response.data);
    return normalizeGeneratedMedia(responseBody.data);
  } catch (error) {
    throw new Error(toErrorMessage(error));
  }
};

export const deleteGeneratedMediaById = async (
  generatedMediaId: string
): Promise<void> => {
  try {
    await privateApiClient.delete(`/generated-media/${generatedMediaId}`);
  } catch (error) {
    throw new Error(toErrorMessage(error));
  }
};

export const pollGeneratedMediaUntilComplete = async (
  generatedMediaId: string,
  options?: {
    maxAttempts?: number;
    intervalMs?: number;
    onStatusChange?: (status: GeneratedMediaStatus) => void;
  }
): Promise<GeneratedMediaItem> => {
  const maxAttempts = options?.maxAttempts ?? 60;
  const intervalMs = options?.intervalMs ?? 2000;
  let previousStatus: GeneratedMediaStatus | null = null;

  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    const item = await getGeneratedMediaById(generatedMediaId);

    if (item.status !== previousStatus) {
      previousStatus = item.status;
      options?.onStatusChange?.(item.status);
    }

    if (item.status === 'completed') {
      return item;
    }

    if (item.status === 'failed') {
      throw new Error(item.errorMessage || 'Media generation failed.');
    }

    await new Promise((resolve) => {
      window.setTimeout(resolve, intervalMs);
    });
  }

  throw new Error('Media generation timed out. Please try again.');
};

export const waitForGeneratedMediaCompletion = async (
  generatedMediaId: string,
  options?: {
    timeoutMs?: number;
    pollIntervalMs?: number;
    onStatusChange?: (status: GeneratedMediaStatus) => void;
  }
): Promise<GeneratedMediaItem> => {
  const timeoutMs = options?.timeoutMs ?? 4 * 60_000;
  const pollIntervalMs = options?.pollIntervalMs ?? 3000;

  return new Promise<GeneratedMediaItem>((resolve, reject) => {
    let isResolved = false;
    let isChecking = false;
    let lastStatus: GeneratedMediaStatus | null = null;

    const cleanup = () => {
      if (isResolved) return;
      isResolved = true;
      window.clearTimeout(timeoutId);
      window.clearInterval(intervalId);
      socketSubscription.disconnect();
    };

    const finalizeSuccess = (value: GeneratedMediaItem) => {
      cleanup();
      resolve(value);
    };

    const finalizeError = (error: Error) => {
      cleanup();
      reject(error);
    };

    const handleStatusItem = (item: GeneratedMediaItem) => {
      if (item.status !== lastStatus) {
        lastStatus = item.status;
        options?.onStatusChange?.(item.status);
      }

      if (item.status === 'completed') {
        finalizeSuccess(item);
      } else if (item.status === 'failed') {
        finalizeError(
          new Error(item.errorMessage || 'Media generation failed.')
        );
      }
    };

    const checkNow = async () => {
      if (isResolved || isChecking) return;
      isChecking = true;
      try {
        const item = await getGeneratedMediaById(generatedMediaId);
        handleStatusItem(item);
      } catch {
        // Keep polling until timeout when transient failures happen.
      } finally {
        isChecking = false;
      }
    };

    const socketSubscription = subscribeGeneratedMediaNotifications({
      onGeneratedMediaNotification: (notification) => {
        if (notification.entityId === generatedMediaId) {
          void checkNow();
        }
      },
    });

    const intervalId = window.setInterval(() => {
      void checkNow();
    }, pollIntervalMs);

    const timeoutId = window.setTimeout(() => {
      finalizeError(new Error('Media generation timed out. Please try again.'));
    }, timeoutMs);

    void checkNow();
  });
};

export const subscribeGeneratedMediaNotifications = (handlers: {
  onGeneratedMediaNotification: (payload: GeneratedMediaNotification) => void;
  onError?: (error: Error) => void;
}) => {
  const token = getUser()?.token;

  if (!token) {
    handlers.onError?.(
      new Error('Authentication token missing for generated media socket.')
    );
    return {
      disconnect: () => undefined,
    };
  }

  const socket: Socket<SocketServerToClientEvents, SocketClientToServerEvents> =
    io(VITE_GATEWAY_BASE_URL, {
      path: '/socket.io',
      auth: { token },
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
    });

  const onNotification = (payload: {
    id?: string;
    type?: string;
    message?: string;
    entityId?: string;
    entityType?: string;
    createdAt?: string | number | Date;
  }) => {
    if (payload.entityType !== 'generated_media') return;
    if (!payload.entityId) return;

    handlers.onGeneratedMediaNotification({
      id: valueAsString(payload.id, crypto.randomUUID()),
      type: valueAsString(payload.type),
      message: valueAsString(payload.message),
      entityId: valueAsString(payload.entityId),
      entityType: valueAsString(payload.entityType),
      createdAt: valueAsDate(payload.createdAt, new Date()),
    });
  };

  const onConnectError = (error: Error) => {
    handlers.onError?.(error);
  };

  socket.on('notification:new', onNotification);
  socket.on('connect_error', onConnectError);

  return {
    disconnect: () => {
      socket.off('notification:new', onNotification);
      socket.off('connect_error', onConnectError);
      socket.disconnect();
    },
  };
};
