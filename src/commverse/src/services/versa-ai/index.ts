import { useMutation, useQuery } from '@tanstack/react-query';
import {
  attach3DAssetMedia,
  get3DAssetId,
  getVersaImageGenerationResult,
  generateImageTo3D,
  generatePromptTo3D,
  queueVersaImageGeneration,
  regenerateImageTo3D,
  reGeneratePromptTo3D,
} from '../api';
import type {
  Attach3DAssetMediaPayload,
  QueueVersaImagePayload,
  QueueVersaImageResponse,
  VersaImageResultResponse,
} from '../../types';

export const useGenerateImageTo3D = () => {
  return useMutation({
    mutationKey: ['generateImageTo3D'],
    mutationFn: generateImageTo3D,
    retry: false,
  });
};

export const useGeneratePromptTo3D = () => {
  return useMutation({
    mutationKey: ['generatePromptTo3D'],
    mutationFn: generatePromptTo3D,
    retry: false,
  });
};

export const useReGeneratePromptTo3D = () => {
  return useMutation({
    mutationKey: ['reGeneratePromptTo3D'],
    mutationFn: reGeneratePromptTo3D,
    retry: false,
  });
};

export const useRegenerateImageTo3D = () => {
  return useMutation({
    mutationKey: ['regenerateImageTo3D'],
    mutationFn: regenerateImageTo3D,
    retry: false,
  });
};

export const useAttach3DAssetMedia = () => {
  return useMutation({
    mutationKey: ['attach3DAssetMedia'],
    mutationFn: ({ assetId, data }: Attach3DAssetMediaPayload) =>
      attach3DAssetMedia(assetId, data),
    retry: false,
  });
};

export const useGet3DAssetByIdVersa = () => {
  return useMutation({
    mutationKey: ['get3DAssetByIdVersa'],
    mutationFn: (assetId: string) => get3DAssetId(assetId),
    retry: false,
  });
};

export const createVersaImageJobId = () => {
  if (
    typeof crypto !== 'undefined' &&
    typeof crypto.randomUUID === 'function'
  ) {
    return crypto.randomUUID();
  }
  return `versa-job-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
};

export const useQueueVersaImageGeneration = () => {
  return useMutation<
    QueueVersaImageResponse | undefined,
    Error,
    QueueVersaImagePayload
  >({
    mutationKey: ['queueVersaImageGeneration'],
    mutationFn: queueVersaImageGeneration,
    retry: false,
  });
};

export const useVersaImageGenerationResult = (
  jobId?: string,
  enabled = true
) => {
  return useQuery<VersaImageResultResponse | undefined>({
    queryKey: ['versaImageGenerationResult', jobId],
    queryFn: () => getVersaImageGenerationResult(jobId as string),
    enabled: Boolean(jobId) && enabled,
    retry: false,
  });
};
