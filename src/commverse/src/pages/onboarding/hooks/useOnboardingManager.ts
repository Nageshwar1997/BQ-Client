import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router';

import { useUpdateBrand } from '../../../services/auth-service';
import { useCreateSite } from '../../../services/auth-service';
import {
  getGeneratedMediaById,
  waitForGeneratedMediaCompletion,
} from '../../../services/ai-creative-studio';
import { getOnboardingSession } from '../../../services/onboarding';
import {
  useCheckVtonHealth,
  useGenerateFashionVton,
} from '../../../services/fashion-vton';
import {
  useCompleteOnboarding,
  useCompleteOnboardingStep,
  useExtractPdp,
  useBrandAdvertisement,
  useCreativeStudioPhotoshoot,
  useSaveUserInfo,
  useValidateProduct,
} from '../../../services/onboarding-services';
import type { MediaAttachment } from '../../../types/chat';
import type {
  OnboardingBrandKitData,
  OnboardingSession,
  OnboardingStepId,
  OnboardingUserInfo,
} from '../../../types/onboarding';
import type { TTryOn } from '../../../types';
import {
  createImmersivePipeline,
  createMarketingPipeline,
} from '../components/pipeline/pipeline.config';
import { usePipeline } from '../components/pipeline/usePipeline';
import {
  BRAND_KIT_CONFIRMED_KEY,
  ONBOARDING_QUESTION_BRAND_DNA_READY,
  ONBOARDING_POLL_INTERVAL_MS,
  ONBOARDING_POLL_JITTER_MS,
} from '../onboarding.constants';
import type { BrandKitRawData } from '../onboarding.types';
import { buildBrandKitData } from '../components/buildBrandKitData';
import {
  allSubStepsDone,
  buildQuestionKey,
  resolveCmsSubcategoryId,
  extractVersaAssetId,
  getDisplayChips,
  getDisplayQuestion,
  getImmersivePipelineRequirements,
  getPipelineRefetchInterval,
  getQuestionForCurrentStep,
  hasBrandDnaReadyMessage,
  hydrateMessagesFromSession,
  isUserInfoIncomplete,
  shouldWaitForBrandDnaBeforeQuestion,
} from '../onboarding.utils';
import { useMessageManager } from './useMessageManager';
import { useOnboardingHandlers } from './useOnboardingHandlers';
import { useBrandOnboarding } from './useBrandOnboarding';
import { useIndividualOnboarding } from './useIndividualOnboarding';
import { useOnboardingState } from './useOnboardingState';
import { useOnboardingSessionManager } from './useOnboardingSessionManager';
import { useSyncPipeline } from './useSyncPipeline';
import {
  FASHION_DEFAULT_MODELS,
  SUPPORTED_TRYON_CATEGORIES,
} from '../../../constants';
import { useProductImageSelection } from './useProductImageSelection';
import { isImmersiveProductPageStep } from '../../../services/onboarding/stepMapping';
import {
  createVersaImageJobId,
  useAttach3DAssetMedia,
  useGenerateImageTo3D,
  useGet3DAssetByIdVersa,
} from '../../../services/versa-ai';
import { useSocket } from '../../../hooks/useSocket';
import {
  type NotificationPayload,
  VERSA_3D_GENERATION_COMPLETED,
  VERSA_3D_GENERATION_FAILED,
} from '../../../services/socket-services';
import {
  useCreateExperience,
  usePublishExperience,
  useUpdateExperience,
} from '../../../services/experience-services';
import { blobUrlToFile, getDefaultPayload } from '../../../lib/utils';
import { PUBLISH_BASE_URL } from '../../../env';
import { getDefaultValues } from '../../virtual-tryon/utils';
import { inferGarmentType } from '../onboarding.utils';
import { useSpriteWorker } from '../../../webWorker/useSpriteWorker';
import { useCreateProductCMS } from '../../../services/product-service';
import { useGetCategories } from '../../../services/category-service';

const DEFAULT_TRY_ON_SUB_CATEGORY: TTryOn = 'Lipstick';
const getIndividualCompletionHoldKey = (sessionId?: string) =>
  sessionId ? `onboarding:individual:hold-complete:${sessionId}` : null;

type CosmeticTryOnModalData = {
  productTitle: string;
  subCategory: TTryOn;
  variants: string[];
  productLink?: string;
};

type ImmersivePipelineStorage = {
  ts?: number;
  jobId?: string;
  assetId?: string;
  assetStatus?: string | null;
  modelUrl?: string | null;
  spriteUrl?: string | null;
  thumbnailUrl?: string | null;
  siteId?: string;
  brandSubdomain?: string;
  productSlug?: string;
  visualizerExperienceId?: string;
  arExperienceId?: string;
  arExperienceLink?: string;
  productId?: string;
  tryOnExperienceId?: string;
  tryOnExperienceType?: 'beauty_tryon' | 'fashion_tryon';
};

type ImmersiveStepId = 'visualizer' | 'ar-experience' | 'ar-tryon';
type ImmersivePublishedExperienceType = '3d_visualizer' | 'ar_experience';
type ImmersiveRunnerOutcome = 'done' | 'waiting';
type ImmersiveRunnerStep = {
  id: 'asset-3d' | ImmersiveStepId;
  required: boolean;
  run: () => Promise<ImmersiveRunnerOutcome>;
  fail: (message: string) => void;
};

const DEFAULT_FASHION_CTA_VALUES = {
  'try-on': {
    text: 'Try Now',
    buttonColor: '#002dff',
    textColor: '#FFFFFF',
  },
  'buy-now': {
    text: 'Buy Now',
    buttonColor: '#000000',
    textColor: '#FFFFFF',
  },
  retry: {
    text: 'Retry',
    buttonColor: '#EAEBF1',
    textColor: '#18181A',
  },
} as const;

const getImmersivePipelineStorageKey = (sessionId?: string) =>
  sessionId ? `onboarding:immersive-pipeline:${sessionId}` : null;

const readImmersivePipelineStorage = (
  sessionId?: string
): ImmersivePipelineStorage | null => {
  if (typeof sessionStorage === 'undefined') return null;
  const key = getImmersivePipelineStorageKey(sessionId);
  if (!key) return null;

  const raw = sessionStorage.getItem(key);
  if (!raw?.trim()) return null;

  try {
    return JSON.parse(raw) as ImmersivePipelineStorage;
  } catch {
    sessionStorage.removeItem(key);
    return null;
  }
};

const writeImmersivePipelineStorage = (
  sessionId: string,
  nextState: ImmersivePipelineStorage
) => {
  if (typeof sessionStorage === 'undefined') return;
  const key = getImmersivePipelineStorageKey(sessionId);
  if (!key) return;
  sessionStorage.setItem(key, JSON.stringify(nextState));
};

const mergeImmersivePipelineStorage = (
  sessionId: string,
  updates: Partial<ImmersivePipelineStorage>
) => {
  const nextState = {
    ...(readImmersivePipelineStorage(sessionId) ?? {}),
    ...updates,
    ts: Date.now(),
  };
  writeImmersivePipelineStorage(sessionId, nextState);
  return nextState;
};

const sanitizeSlugPart = (text: string, charLimit: number) => {
  const sanitized = text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');

  if (!sanitized) return '';
  if (sanitized.length <= charLimit) return sanitized;
  return sanitized.slice(0, charLimit);
};

const getStringValue = (value: unknown): string | null =>
  typeof value === 'string' && value.trim() ? value.trim() : null;

const parseProductPriceAmount = (value: unknown): number => {
  if (typeof value === 'number' && Number.isFinite(value) && value > 0) {
    return value;
  }

  if (typeof value === 'string') {
    const normalized = value.replace(/[^0-9.]/g, '').trim();
    if (!normalized) return 0;
    const parsed = Number(normalized);
    if (Number.isFinite(parsed) && parsed > 0) {
      return parsed;
    }
  }

  return 0;
};

const isModelLikeFile = (value?: string | null) =>
  typeof value === 'string' &&
  /\.(glb|gltf|usdz|fbx|obj|stl|usdc)(?:$|[?#])/i.test(value.trim());

const asRecordArray = (value: unknown): Record<string, unknown>[] =>
  Array.isArray(value)
    ? value.filter(
        (item): item is Record<string, unknown> =>
          Boolean(item) && typeof item === 'object' && !Array.isArray(item)
      )
    : [];

const getImmersiveAssetFiles = (value: Record<string, unknown> | null) => {
  const rawFiles = [
    ...asRecordArray(value?.data),
    ...asRecordArray(value?.files),
    ...asRecordArray(value?.downloads),
  ];

  const seenUrls = new Set<string>();

  return rawFiles
    .map((file) => {
      const url =
        getStringValue(file?.url) ?? getStringValue(file?.signedUrl) ?? null;

      if (!url || seenUrls.has(url)) return null;
      seenUrls.add(url);

      const name =
        getStringValue(file?.name) ??
        getStringValue(file?.fileName) ??
        decodeURIComponent(
          url.split('?')[0].split('#')[0].split('/').pop() || ''
        ) ??
        null;

      return name ? { name, url } : null;
    })
    .filter((file): file is { name: string; url: string } => Boolean(file));
};

const getImmersiveAssetPayload = (
  assetResponse: unknown
): {
  assetId: string | null;
  modelFileName: string | null;
  modelUrl: string | null;
  spriteUrl: string | null;
  thumbnailUrl: string | null;
} => {
  const root = asRecord(assetResponse);
  const data = asRecord(root?.data) ?? root;
  const nestedData = asRecord(data?.data);
  const candidateFiles = [
    ...getImmersiveAssetFiles(data),
    ...getImmersiveAssetFiles(nestedData),
  ];
  const modelFile =
    candidateFiles.find(
      (file) => isModelLikeFile(file.url) || isModelLikeFile(file.name)
    ) ?? null;
  const assetId =
    getStringValue(data?.assetId) ??
    getStringValue(data?._id) ??
    getStringValue(nestedData?._id) ??
    getStringValue(nestedData?.assetId) ??
    null;
  const modelUrl =
    getStringValue(data?.modelUrl) ??
    getStringValue(nestedData?.modelUrl) ??
    getStringValue(nestedData?.url) ??
    modelFile?.url ??
    null;
  const spriteUrl =
    getStringValue(data?.spriteUrl) ??
    getStringValue(nestedData?.spriteUrl) ??
    null;
  const thumbnailUrl =
    getStringValue(data?.thumbnailUrl) ??
    getStringValue(data?.thumbnail) ??
    getStringValue(nestedData?.thumbnailUrl) ??
    getStringValue(nestedData?.thumbnail) ??
    getStringValue(data?.image) ??
    getStringValue(nestedData?.image) ??
    null;

  return {
    assetId,
    modelFileName: modelFile?.name ?? null,
    modelUrl,
    spriteUrl,
    thumbnailUrl,
  };
};

const isOtherSelection = (value?: string | null) => {
  const normalized = value?.trim().toLowerCase();
  return normalized === 'others' || normalized === 'other';
};

const resolveTryOnSubCategory = (value?: string | null): TTryOn => {
  if (!value) return DEFAULT_TRY_ON_SUB_CATEGORY;
  const matched = SUPPORTED_TRYON_CATEGORIES.find(
    (category) => category.toLowerCase() === value.trim().toLowerCase()
  );
  return matched ?? DEFAULT_TRY_ON_SUB_CATEGORY;
};

const asRecord = (value: unknown): Record<string, unknown> | null =>
  value && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;

const asStringArray = (value: unknown): string[] =>
  Array.isArray(value)
    ? value.filter((item): item is string => typeof item === 'string')
    : [];

const asProductShadeHexArray = (value: unknown): string[] =>
  Array.isArray(value)
    ? value
        .map((item) => {
          if (typeof item === 'string') return item;
          if (!item || typeof item !== 'object' || Array.isArray(item))
            return null;
          const hex = (item as { hex?: unknown }).hex;
          return typeof hex === 'string' ? hex : null;
        })
        .filter((item): item is string => Boolean(item))
    : [];

const areStringArraysEqual = (
  left?: string[] | null,
  right?: string[] | null
) => {
  const safeLeft = left ?? [];
  const safeRight = right ?? [];
  if (safeLeft.length !== safeRight.length) return false;
  return safeLeft.every((value, index) => value === safeRight[index]);
};

const getQueueDescription = (
  queuePosition?: number,
  estimatedWaitSec?: number
) => {
  const parsedQueuePosition = Number(queuePosition);
  const parsedEstimatedWaitSec = Number(estimatedWaitSec);
  const safeQueuePosition = Number.isFinite(parsedQueuePosition)
    ? parsedQueuePosition
    : 0;
  const safeEstimatedWaitSec = Number.isFinite(parsedEstimatedWaitSec)
    ? parsedEstimatedWaitSec
    : 0;

  const queueText =
    safeQueuePosition <= 0
      ? 'Your request is next in queue.'
      : `Queue position: ${safeQueuePosition}.`;

  const waitText =
    safeEstimatedWaitSec <= 0
      ? 'Processing should begin shortly.'
      : `Estimated wait: ${Math.ceil(safeEstimatedWaitSec)} sec.`;

  return `${queueText} ${waitText} We will update this once ready.`;
};

const areBrandAdvertisementDataEqual = (
  left: {
    originalImageUrl: string;
    resultUrl: string;
    bgRemovedImage?: string | null;
    originalImageKey?: string | null;
    resultImageKey?: string | null;
    bgRemovedImageKey?: string | null;
  } | null,
  right: {
    originalImageUrl: string;
    resultUrl: string;
    bgRemovedImage?: string | null;
    originalImageKey?: string | null;
    resultImageKey?: string | null;
    bgRemovedImageKey?: string | null;
  } | null
) =>
  (left?.originalImageUrl ?? '') === (right?.originalImageUrl ?? '') &&
  (left?.resultUrl ?? '') === (right?.resultUrl ?? '') &&
  (left?.bgRemovedImage ?? null) === (right?.bgRemovedImage ?? null) &&
  (left?.originalImageKey ?? null) === (right?.originalImageKey ?? null) &&
  (left?.resultImageKey ?? null) === (right?.resultImageKey ?? null) &&
  (left?.bgRemovedImageKey ?? null) === (right?.bgRemovedImageKey ?? null);

const areValidatedProductDetailsEqual = (
  left: {
    productName?: string | null;
    description?: string | null;
    price?: string | null;
    productUrl?: string | null;
    productImages?: string[] | null;
    productColors?: string[] | null;
    subCategory?: string | null;
  } | null,
  right: {
    productName?: string | null;
    description?: string | null;
    price?: string | null;
    productUrl?: string | null;
    productImages?: string[] | null;
    productColors?: string[] | null;
    subCategory?: string | null;
  } | null
) =>
  (left?.productName ?? null) === (right?.productName ?? null) &&
  (left?.description ?? null) === (right?.description ?? null) &&
  (left?.price ?? null) === (right?.price ?? null) &&
  (left?.productUrl ?? null) === (right?.productUrl ?? null) &&
  (left?.subCategory ?? null) === (right?.subCategory ?? null) &&
  areStringArraysEqual(left?.productImages, right?.productImages) &&
  areStringArraysEqual(left?.productColors, right?.productColors);

const logImmersivePipeline = (
  stage: string,
  payload?: Record<string, unknown>
) => {
  if (payload) {
    console.log(`[immersive-pipeline] ${stage}`, payload);
    return;
  }

  console.log(`[immersive-pipeline] ${stage}`);
};

const fetchGeneratedMediaResultUrlWithRetry = async (
  generatedMediaId: string,
  options?: {
    maxAttempts?: number;
    intervalMs?: number;
  }
) => {
  const maxAttempts = options?.maxAttempts ?? 8;
  const intervalMs = options?.intervalMs ?? 1000;

  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    try {
      const media = await getGeneratedMediaById(generatedMediaId);
      const resultUrl = media.outputs.find((output) => output.url)?.url;
      if (resultUrl) return resultUrl;
    } catch {
      // Keep retrying until max attempts because completion/consistency can lag.
    }

    if (attempt < maxAttempts - 1) {
      await new Promise((resolve) => {
        window.setTimeout(resolve, intervalMs);
      });
    }
  }

  return null;
};

export function useOnboardingManager() {
  const navigate = useNavigate();
  const [state, dispatch] = useOnboardingState();
  const onboardingSuccessStorageKey = 'onboarding-success-payload';

  const marketingPipeline = usePipeline(createMarketingPipeline());
  const immersivePipeline = usePipeline(createImmersivePipeline());
  const immersivePipelineRef = useRef(immersivePipeline);
  useEffect(() => {
    immersivePipelineRef.current = immersivePipeline;
  }, [immersivePipeline]);
  const immersive3dUiRef = useRef<{
    assetId: string | null;
    assetStatus: string | null;
  }>({
    assetId: null,
    assetStatus: null,
  });
  const immersiveAssetMediaTaskRef = useRef<Promise<unknown> | null>(null);
  const immersiveCreationLocksRef = useRef<
    Partial<Record<ImmersiveStepId | 'site', boolean>>
  >({});

  const { session, isLoading, isError, errorMessage, refetch } =
    useOnboardingSessionManager({
      refetchInterval: getPipelineRefetchInterval(
        state.showingPipeline,
        state.pipelineComplete,
        ONBOARDING_POLL_INTERVAL_MS,
        ONBOARDING_POLL_JITTER_MS
      ),
    });

  const saveUserInfoMutation = useSaveUserInfo();
  const validateProductMutation = useValidateProduct();
  const extractPdpMutation = useExtractPdp();
  const checkVtonHealthMutation = useCheckVtonHealth();
  const generateFashionVtonMutation = useGenerateFashionVton();
  const brandAdvertisementMutation = useBrandAdvertisement();
  const creativeStudioPhotoshootMutation = useCreativeStudioPhotoshoot();
  const { mutateAsync: generateImageTo3D } = useGenerateImageTo3D();
  const { mutateAsync: attachAssetMedia } = useAttach3DAssetMedia();
  const { mutateAsync: get3DAssetByIdVersa } = useGet3DAssetByIdVersa();
  const { generate: generateSpriteAndThumbnail } = useSpriteWorker();
  const createSiteMutation = useCreateSite();
  const createExperienceMutation = useCreateExperience();
  const updateExperienceMutation = useUpdateExperience();
  const publishExperienceMutation = usePublishExperience();
  const createProductCMSMutation = useCreateProductCMS();
  const categoriesQuery = useGetCategories();
  const categoriesListForCms = useMemo(
    () => (Array.isArray(categoriesQuery.data) ? categoriesQuery.data : []),
    [categoriesQuery.data]
  );
  const completeOnboardingStepMutation = useCompleteOnboardingStep();
  const completeOnboardingMutation = useCompleteOnboarding();
  const updateBrandMutation = useUpdateBrand();
  const questionKeysRef = useRef<Set<string>>(new Set());
  const tabInitializedRef = useRef(false);
  const hasNavigatedToSuccessRef = useRef(false);
  const [isSubmitLocked, setIsSubmitLocked] = useState(false);
  const [cosmeticTryOnModalData, setCosmeticTryOnModalData] =
    useState<CosmeticTryOnModalData | null>(null);
  const beautyTryOnModalSnapshot = useMemo(
    () => ({
      productLink: cosmeticTryOnModalData?.productLink ?? null,
      subCategory: cosmeticTryOnModalData?.subCategory ?? null,
      variants: cosmeticTryOnModalData?.variants ?? [],
    }),
    [cosmeticTryOnModalData]
  );

  const { appendMessage, appendText, appendCard } = useMessageManager(dispatch);

  const appendQuestionKey = (key: string) => {
    questionKeysRef.current.add(key);
  };

  const persistImmersivePipelineState = useCallback(
    (updates: Partial<ImmersivePipelineStorage>) => {
      if (!session?.sessionId) return null;
      return mergeImmersivePipelineStorage(session.sessionId, updates);
    },
    [session?.sessionId]
  );

  const debugFetchImmersiveStatus = useCallback(async (reason: string) => {
    try {
      const latestSession = await getOnboardingSession();
      logImmersivePipeline(`status-${reason}`, {
        sessionId: latestSession.sessionId,
        flowStatus: latestSession.flow?.status ?? null,
        flowCurrentStepKey: latestSession.flow?.currentStepKey ?? null,
        currentStep: latestSession.currentStep,
        subSteps: latestSession.subSteps ?? null,
        experienceUrl: latestSession.experienceUrl ?? null,
      });
    } catch (error) {
      logImmersivePipeline(`status-${reason}-failed`, {
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }, []);

  const ensureImmersiveSite = useCallback(async () => {
    const sessionId = session?.sessionId;
    if (!sessionId) {
      throw new Error(
        'Onboarding session is unavailable for immersive site creation.'
      );
    }

    const existingState = readImmersivePipelineStorage(sessionId);
    if (existingState?.siteId && existingState.brandSubdomain) {
      return {
        siteId: existingState.siteId,
        brandSubdomain: existingState.brandSubdomain,
      };
    }

    if (immersiveCreationLocksRef.current.site) {
      throw new Error('Immersive site creation is already in progress.');
    }

    immersiveCreationLocksRef.current.site = true;

    try {
      const baseBrandName =
        sanitizeSlugPart(session?.brand?.name ?? 'brand', 15) || 'brand';
      let candidateSubdomain = baseBrandName;
      let siteId = '';

      const createSiteWithValue = async (value: string) => {
        const response = await createSiteMutation.mutateAsync({ value });
        siteId =
          getStringValue(
            (response as { data?: { _id?: string } } | undefined)?.data?._id
          ) ?? '';
        if (!siteId) {
          throw new Error(
            'Site creation succeeded but no site identifier was returned.'
          );
        }
        candidateSubdomain = value;
      };

      try {
        await createSiteWithValue(candidateSubdomain);
      } catch {
        const suffix = Math.random().toString(36).slice(2, 5);
        await createSiteWithValue(`${baseBrandName}-${suffix}`);
      }

      persistImmersivePipelineState({
        siteId,
        brandSubdomain: candidateSubdomain,
      });
      logImmersivePipeline('site-ready', {
        sessionId,
        siteId,
        brandSubdomain: candidateSubdomain,
      });
      void debugFetchImmersiveStatus('site-ready');

      return { siteId, brandSubdomain: candidateSubdomain };
    } finally {
      immersiveCreationLocksRef.current.site = false;
    }
  }, [
    createSiteMutation,
    persistImmersivePipelineState,
    session?.brand?.name,
    session?.sessionId,
  ]);

  const storeImmersiveAssetResponse = useCallback(
    async (assetId: string, assetResponse: unknown) => {
      const { modelUrl, spriteUrl, thumbnailUrl } =
        getImmersiveAssetPayload(assetResponse);

      if (!modelUrl) {
        throw new Error('Generated 3D asset is missing a model URL.');
      }

      persistImmersivePipelineState({
        assetId,
        assetStatus: 'uploaded',
        modelUrl,
        spriteUrl,
        thumbnailUrl,
      });
      logImmersivePipeline('asset-ready', {
        assetId,
        modelUrl,
        spriteUrl,
        thumbnailUrl,
      });
      void debugFetchImmersiveStatus('asset-ready');

      return { modelUrl, spriteUrl, thumbnailUrl };
    },
    [debugFetchImmersiveStatus, persistImmersivePipelineState]
  );

  const fetchAndStoreImmersiveAsset = useCallback(
    async (assetId: string) => {
      const assetResponse = await get3DAssetByIdVersa(assetId);
      return storeImmersiveAssetResponse(assetId, assetResponse);
    },
    [get3DAssetByIdVersa, storeImmersiveAssetResponse]
  );

  const createImmersiveAssetModelFile = useCallback(
    async (assetId: string, assetResponse: unknown) => {
      const { modelFileName, modelUrl } =
        getImmersiveAssetPayload(assetResponse);

      if (!modelUrl) {
        throw new Error('Generated 3D asset is missing a model URL.');
      }

      const modelResponse = await fetch(modelUrl);
      if (!modelResponse.ok) {
        throw new Error('Failed to download generated 3D asset model.');
      }

      const modelBlob = await modelResponse.blob();
      if (modelBlob.size === 0) {
        throw new Error('Generated 3D asset model is empty.');
      }

      const resolvedName =
        (state.validatedProductDetails?.productName?.trim()
          ? `${sanitizeSlugPart(state.validatedProductDetails.productName, 48) || 'product'}.glb`
          : null) ||
        modelFileName?.trim() ||
        decodeURIComponent(
          modelUrl.split('?')[0].split('#')[0].split('/').pop() ||
            `${assetId}.glb`
        );

      return new File([modelBlob], resolvedName, {
        type: modelBlob.type || 'model/gltf-binary',
      });
    },
    [state.validatedProductDetails?.productName]
  );

  const finalizeImmersiveAssetMedia = useCallback(
    async (assetId: string) => {
      if (immersiveAssetMediaTaskRef.current) {
        await immersiveAssetMediaTaskRef.current;
        return;
      }

      const task = (async () => {
        immersivePipelineRef.current.setStepLabel(
          'asset-3d',
          'Preparing 3D asset preview...'
        );
        immersivePipelineRef.current.startStep('asset-3d');
        persistImmersivePipelineState({
          assetId,
          assetStatus: 'finalizing',
        });

        const assetResponse = await get3DAssetByIdVersa(assetId);
        const { modelUrl, spriteUrl, thumbnailUrl } =
          getImmersiveAssetPayload(assetResponse);

        if (!modelUrl) {
          throw new Error('Generated 3D asset is missing a model URL.');
        }

        const hasPreviewMedia = Boolean(spriteUrl && thumbnailUrl);

        if (!hasPreviewMedia) {
          try {
            immersivePipelineRef.current.setStepLabel(
              'asset-3d',
              'Generating 3D asset preview...'
            );
            const modelFile = await createImmersiveAssetModelFile(
              assetId,
              assetResponse
            );
            const { spriteFile, thumbnailFile } =
              await generateSpriteAndThumbnail(
                modelFile,
                '/assets/hdri/studio.jpg'
              );

            immersivePipelineRef.current.setStepLabel(
              'asset-3d',
              'Attaching 3D asset preview...'
            );
            const mediaFormData = new FormData();
            mediaFormData.append('spriteFile', spriteFile);
            mediaFormData.append('thumbnailFile', thumbnailFile);

            await attachAssetMedia({
              assetId,
              data: mediaFormData,
            });
            logImmersivePipeline('asset-preview-attached', { assetId });
          } catch (error) {
            logImmersivePipeline('asset-preview-skipped', {
              assetId,
              reason:
                error instanceof Error ? error.message : 'unknown-error',
            });
          }
        }

        immersivePipelineRef.current.setStepLabel(
          'asset-3d',
          'Finalizing 3D asset...'
        );
        const refreshedAssetResponse = hasPreviewMedia
          ? assetResponse
          : await get3DAssetByIdVersa(assetId);

        return storeImmersiveAssetResponse(assetId, refreshedAssetResponse);
      })();

      immersiveAssetMediaTaskRef.current = task;

      try {
        return await task;
      } finally {
        immersiveAssetMediaTaskRef.current = null;
      }
    },
    [
      attachAssetMedia,
      createImmersiveAssetModelFile,
      generateSpriteAndThumbnail,
      get3DAssetByIdVersa,
      persistImmersivePipelineState,
      storeImmersiveAssetResponse,
    ]
  );

  const ensureImmersiveFashionProduct = useCallback(async () => {
    const sessionId = session?.sessionId;
    if (!sessionId) {
      throw new Error('Onboarding session is unavailable for fashion try-on.');
    }

    const existingState = readImmersivePipelineStorage(sessionId);
    if (existingState?.productId) {
      return { _id: existingState.productId };
    }

    const categories = categoriesListForCms;
    const normalizedCategory = (
      state.validateProductAnswers.category ??
      session?.answers?.category ??
      ''
    )
      .trim()
      .toLowerCase();
    const resolvedCategory =
      categories.find((item: { _id?: string; name?: string }) => {
        const name = (item?.name ?? '').trim().toLowerCase();
        return (
          name === normalizedCategory ||
          name.startsWith(normalizedCategory) ||
          normalizedCategory.startsWith(name)
        );
      }) ??
      (normalizedCategory === 'fashion'
        ? categories.find((item: { _id?: string; name?: string }) => {
            const name = (item?.name ?? '').trim().toLowerCase();
            return (
              name === 'clothes' ||
              name.includes('fashion') ||
              name.includes('apparel') ||
              name.includes('clothing')
            );
          })
        : undefined);

    const categoryId = getStringValue(resolvedCategory?._id);
    if (!categoryId) {
      throw new Error(
        'Fashion category is unavailable for try-on product creation.'
      );
    }

    const productName =
      state.validatedProductDetails?.productName?.trim() || 'Your Product';
    const productSlugBase = sanitizeSlugPart(productName, 36) || 'product';
    const productSlug = `${productSlugBase}-${Date.now().toString().slice(-6)}`;
    const marketingStepData = asRecord(
      session.flow?.steps.find((step) => step.stepKey === 'marketing_image')
        ?.data
    );
    const preferredImageUrl =
      getStringValue(marketingStepData?.bgRemovedImage) ??
      getStringValue(marketingStepData?.adWithoutBrandMemory) ??
      state.validatedProductDetails?.productImages?.[0] ??
      null;

    if (!preferredImageUrl) {
      throw new Error('Fashion try-on product image is unavailable.');
    }

    const imageFile = await blobUrlToFile(
      preferredImageUrl,
      `${productSlugBase}.png`,
      'image/png'
    );
    if (!imageFile) {
      throw new Error('Failed to prepare fashion try-on product image.');
    }

    logImmersivePipeline('fashion-product-create-started', {
      sessionId,
      categoryId,
      productName,
      sourceImage: preferredImageUrl,
    });

    const rawSubCategory =
      state.validatedProductDetails?.subCategory ??
      state.validateProductAnswers.subCategory ??
      session?.answers?.subCategory ??
      'Others';
    const productPrice =
      parseProductPriceAmount(state.validatedProductDetails?.price) || 1;
    const formData = new FormData();
    formData.append('images', imageFile);
    formData.append(
      'productDetails',
      JSON.stringify({
        productName,
        productId: productSlug,
        slug: productSlug,
        description: state.validatedProductDetails?.description || undefined,
        productLink:
          state.validatedProductDetails?.productUrl ??
          state.validateProductAnswers.productUrl ??
          session?.answers?.productUrl ??
          undefined,
        categoryId,
        subcategory: resolveCmsSubcategoryId(
          resolvedCategory,
          rawSubCategory || 'Others'
        ),
        price: {
          amount: productPrice,
          currency: 'INR',
        },
        variants: [],
      })
    );

    const createResponse = await createProductCMSMutation.mutateAsync(formData);
    const createdProduct = (
      createResponse as { data?: Record<string, unknown> } | undefined
    )?.data;
    const productId = getStringValue(createdProduct?._id);

    if (!productId) {
      throw new Error(
        'Fashion product creation succeeded but no identifier was returned.'
      );
    }

    persistImmersivePipelineState({ productId });
    logImmersivePipeline('fashion-product-create-ready', {
      sessionId,
      productId,
      title: createdProduct?.productName ?? productName,
    });

    return {
      ...(createdProduct ?? {}),
      _id: productId,
      productName: getStringValue(createdProduct?.productName) ?? productName,
    };
  }, [
    categoriesListForCms,
    createProductCMSMutation,
    persistImmersivePipelineState,
    session?.answers?.category,
    session?.answers?.productUrl,
    session?.answers?.subCategory,
    session?.flow?.steps,
    session?.sessionId,
    state.validateProductAnswers.category,
    state.validateProductAnswers.productUrl,
    state.validateProductAnswers.subCategory,
    state.validatedProductDetails?.description,
    state.validatedProductDetails?.price,
    state.validatedProductDetails?.productImages,
    state.validatedProductDetails?.productName,
    state.validatedProductDetails?.productUrl,
    state.validatedProductDetails?.subCategory,
  ]);

  const buildImmersiveTryOnPayload = useCallback(async () => {
    const normalizedCategory = (
      state.validateProductAnswers.category ??
      session?.answers?.category ??
      ''
    )
      .trim()
      .toLowerCase();
    const rawSubCategory =
      state.validatedProductDetails?.subCategory ??
      state.validateProductAnswers.subCategory ??
      session?.answers?.subCategory ??
      DEFAULT_TRY_ON_SUB_CATEGORY;

    if (normalizedCategory === 'fashion') {
      const garmentType = inferGarmentType(rawSubCategory) ?? 'dress';
      const product = await ensureImmersiveFashionProduct();
      const productId = getStringValue(product?._id);
      const visibleIds = productId ? [productId] : [];

      return {
        type: 'fashion_tryon' as const,
        ...(productId ? { productId } : {}),
        title: state.validatedProductDetails?.productName?.trim()
          ? `${state.validatedProductDetails.productName.trim()} Fashion Try-on`
          : 'New Fashion Try-on',
        draftData: JSON.stringify({
          type: garmentType,
          compare: false,
          downloadable: true,
          photoUpload: false,
          buyNowEnabled: true,
          products: productId ? [product] : [],
          selectedProducts: productId ? [product] : [],
          modelPhotos: FASHION_DEFAULT_MODELS,
          cta: DEFAULT_FASHION_CTA_VALUES,
          activeCta: 'try-on',
          visibleIds,
        }),
      };
    }

    const resolvedSubCategory = resolveTryOnSubCategory(rawSubCategory);
    const beautyDefaults = getDefaultValues(resolvedSubCategory);

    return {
      type: 'beauty_tryon' as const,
      title: state.validatedProductDetails?.productName?.trim()
        ? `${state.validatedProductDetails.productName.trim()} Try-on`
        : `New ${resolvedSubCategory} Try-on`,
      draftData: JSON.stringify({
        type: beautyDefaults.type,
        compare: false,
        downloadable: true,
        photoUpload: false,
        patterns: null,
        variants: beautyDefaults.variants,
        subCategory: resolvedSubCategory,
      }),
    };
  }, [
    ensureImmersiveFashionProduct,
    session?.answers?.category,
    session?.answers?.subCategory,
    state.validateProductAnswers.category,
    state.validateProductAnswers.subCategory,
    state.validatedProductDetails?.productName,
    state.validatedProductDetails?.subCategory,
  ]);

  const createPublishedImmersiveExperience = useCallback(
    async ({
      type,
      stepId,
      stepLabel,
      slugSuffix,
      stateField,
    }: {
      type: ImmersivePublishedExperienceType;
      stepId: Extract<ImmersiveStepId, 'visualizer' | 'ar-experience'>;
      stepLabel: string;
      slugSuffix: 'viz' | 'ar';
      stateField: 'visualizerExperienceId' | 'arExperienceId';
    }) => {
      const sessionId = session?.sessionId;
      if (!sessionId) return;

      const existingState = readImmersivePipelineStorage(sessionId);
      if (existingState?.[stateField]) return;
      if (immersiveCreationLocksRef.current[stepId]) return;

      const assetId = existingState?.assetId;
      const modelUrl = existingState?.modelUrl;

      if (!assetId || !modelUrl) {
        throw new Error(
          'Generated 3D asset is not ready for immersive experience creation.'
        );
      }

      immersiveCreationLocksRef.current[stepId] = true;
      immersivePipeline.setStepLabel(stepId, stepLabel);
      immersivePipeline.startStep(stepId);

      try {
        const { siteId, brandSubdomain } = await ensureImmersiveSite();
        const productSlug =
          (existingState?.productSlug ??
            sanitizeSlugPart(
              state.validatedProductDetails?.productName ?? 'product',
              30
            )) ||
          'product';

        const productName = state.validatedProductDetails?.productName?.trim();
        const experienceTitle =
          type === 'ar_experience'
            ? productName
              ? `${productName} AR Experience`
              : 'New AR Experience'
            : productName
              ? `${productName} 3D Visualizer`
              : 'New 3D Visualizer Experience';
        const createPayload = {
          ...getDefaultPayload(modelUrl, '', assetId, type),
          title: experienceTitle,
        };

        const createResponse =
          await createExperienceMutation.mutateAsync(createPayload);
        const experienceId =
          getStringValue(
            (createResponse as { data?: { _id?: string } } | undefined)?.data
              ?._id
          ) ?? '';

        if (!experienceId) {
          throw new Error(
            'Experience creation succeeded but no identifier was returned.'
          );
        }

        await updateExperienceMutation.mutateAsync({
          id: experienceId,
          data: {
            siteInfo: {
              siteId,
              slug: `${productSlug}-${slugSuffix}`,
            },
          },
        });

        await publishExperienceMutation.mutateAsync({
          id: experienceId,
          status: 'published',
        });

        persistImmersivePipelineState({
          [stateField]: experienceId,
          productSlug,
          ...(type === 'ar_experience'
            ? {
                arExperienceLink: `https://${brandSubdomain}.${PUBLISH_BASE_URL}/${productSlug}-${slugSuffix}/ar-experience`,
              }
            : {}),
        });
        logImmersivePipeline(`${stepId}-ready`, {
          type,
          experienceId,
          siteId,
          productSlug,
          slug: `${productSlug}-${slugSuffix}`,
          ...(type === 'ar_experience'
            ? {
                publishedLink: `https://${brandSubdomain}.${PUBLISH_BASE_URL}/${productSlug}-${slugSuffix}/ar-experience`,
              }
            : {}),
        });
        void debugFetchImmersiveStatus(`${stepId}-ready`);

        await refetch();
      } finally {
        immersiveCreationLocksRef.current[stepId] = false;
      }
    },
    [
      createExperienceMutation,
      debugFetchImmersiveStatus,
      ensureImmersiveSite,
      immersivePipeline,
      persistImmersivePipelineState,
      publishExperienceMutation,
      refetch,
      session?.sessionId,
      state.validatedProductDetails?.productName,
      updateExperienceMutation,
    ]
  );

  const createImmersiveTryOnExperience = useCallback(async () => {
    const sessionId = session?.sessionId;
    if (!sessionId) return;

    const existingState = readImmersivePipelineStorage(sessionId);
    if (existingState?.tryOnExperienceId) return;
    if (immersiveCreationLocksRef.current['ar-tryon']) return;

    immersiveCreationLocksRef.current['ar-tryon'] = true;
    immersivePipeline.setStepLabel('ar-tryon', 'Creating AR try-on');
    immersivePipeline.startStep('ar-tryon');

    try {
      logImmersivePipeline('ar-tryon-create-started', {
        sessionId,
        category:
          state.validateProductAnswers.category ?? session?.answers?.category,
        subCategory:
          state.validatedProductDetails?.subCategory ??
          state.validateProductAnswers.subCategory ??
          session?.answers?.subCategory,
      });
      const tryOnPayload = await buildImmersiveTryOnPayload();
      const createResponse =
        await createExperienceMutation.mutateAsync(tryOnPayload);
      const experienceId =
        getStringValue(
          (createResponse as { data?: { _id?: string } } | undefined)?.data?._id
        ) ?? '';

      if (!experienceId) {
        throw new Error(
          'AR try-on creation succeeded but no identifier was returned.'
        );
      }

      persistImmersivePipelineState({
        tryOnExperienceId: experienceId,
        tryOnExperienceType: tryOnPayload.type,
      });
      logImmersivePipeline('ar-tryon-ready', {
        type: tryOnPayload.type,
        experienceId,
      });
      void debugFetchImmersiveStatus('ar-tryon-ready');

      await refetch();
    } catch (error) {
      logImmersivePipeline('ar-tryon-create-failed', {
        sessionId,
        message: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    } finally {
      immersiveCreationLocksRef.current['ar-tryon'] = false;
    }
  }, [
    buildImmersiveTryOnPayload,
    createExperienceMutation,
    debugFetchImmersiveStatus,
    immersivePipeline,
    persistImmersivePipelineState,
    refetch,
    session?.answers?.category,
    session?.answers?.subCategory,
    session?.sessionId,
    state.validateProductAnswers.category,
    state.validateProductAnswers.subCategory,
    state.validatedProductDetails?.subCategory,
  ]);

  const effectiveUserInfoAnswers = useMemo(
    () => ({
      name:
        state.userInfoAnswers.name ??
        session?.answers?.name ??
        session?.user?.name,
      location:
        state.userInfoAnswers.location ??
        session?.answers?.location ??
        session?.user?.location,
      profession:
        state.userInfoAnswers.profession ??
        session?.answers?.profession ??
        session?.user?.profession,
      referralSource:
        state.userInfoAnswers.referralSource ??
        session?.answers?.referralSource ??
        session?.user?.referralSource,
    }),
    [
      session?.answers?.location,
      session?.answers?.name,
      session?.answers?.profession,
      session?.answers?.referralSource,
      session?.user?.location,
      session?.user?.name,
      session?.user?.profession,
      session?.user?.referralSource,
      state.userInfoAnswers.location,
      state.userInfoAnswers.name,
      state.userInfoAnswers.profession,
      state.userInfoAnswers.referralSource,
    ]
  );

  const effectiveValidateProductAnswers = useMemo(
    () => ({
      productUrl:
        state.validateProductAnswers.productUrl ?? session?.answers?.productUrl,
      category:
        state.validateProductAnswers.category ?? session?.answers?.category,
      subCategory:
        state.validateProductAnswers.subCategory ??
        session?.answers?.subCategory,
    }),
    [
      session?.answers?.category,
      session?.answers?.productUrl,
      session?.answers?.subCategory,
      state.validateProductAnswers.category,
      state.validateProductAnswers.productUrl,
      state.validateProductAnswers.subCategory,
    ]
  );

  const displayQuestion = useMemo(
    () =>
      getDisplayQuestion({
        isCollectingUserInfo: isUserInfoIncomplete(effectiveUserInfoAnswers),
        userInfoAnswers: effectiveUserInfoAnswers,
        session,
        activeTab: state.activeTab,
        beautyAnswers: state.individualBeautyAnswers,
        productAnswers: effectiveValidateProductAnswers,
      }),
    [
      effectiveUserInfoAnswers,
      effectiveValidateProductAnswers,
      session,
      state.activeTab,
      state.individualBeautyAnswers,
    ]
  );

  const displayChips = useMemo(
    () =>
      getDisplayChips({
        userInfoAnswers: effectiveUserInfoAnswers,
        session,
        activeTab: state.activeTab,
        beautyAnswers: state.individualBeautyAnswers,
        productAnswers: effectiveValidateProductAnswers,
        allowBrandRetry:
          session?.signupType === 'brand' && Boolean(state.submitError),
      }),
    [
      effectiveUserInfoAnswers,
      effectiveValidateProductAnswers,
      session,
      state.activeTab,
      state.individualBeautyAnswers,
      state.submitError,
    ]
  );

  const sessionWithUi = useMemo<OnboardingSession | undefined>(() => {
    if (!session) return undefined;
    return {
      ...session,
      nextQuestion: displayQuestion,
      suggestedChips: displayChips,
    };
  }, [displayChips, displayQuestion, session]);

  const isCollectingUserInfo = isUserInfoIncomplete(effectiveUserInfoAnswers);
  const immersiveRequirements = useMemo(
    () =>
      getImmersivePipelineRequirements({
        category:
          effectiveValidateProductAnswers.category ??
          session?.answers?.category,
        subCategory:
          state.validatedProductDetails?.subCategory ??
          effectiveValidateProductAnswers.subCategory ??
          session?.answers?.subCategory,
      }),
    [
      effectiveValidateProductAnswers.category,
      effectiveValidateProductAnswers.subCategory,
      session?.answers?.category,
      session?.answers?.subCategory,
      state.validatedProductDetails?.subCategory,
    ]
  );
  const immersiveSubStepsOptions = useMemo(
    () => ({
      treatVtonRequirementAsSatisfied:
        immersiveRequirements.vtonCreated &&
        immersivePipeline.state.steps.find((s) => s.id === 'ar-tryon')
          ?.status === 'failed',
    }),
    [immersiveRequirements.vtonCreated, immersivePipeline.state.steps]
  );
  const queueOrResumeImmersiveAssetGeneration = useCallback(async () => {
    if (!immersiveRequirements.asset3dCreated) return;

    const sessionId = session?.sessionId;
    if (!sessionId) return;

    const startedKey = `onboarding:immersive3d_started:${sessionId}`;
    const storedPipelineState = readImmersivePipelineStorage(sessionId) ?? {};
    const existingStarted = sessionStorage.getItem(startedKey);
    const parsedExisting =
      existingStarted && existingStarted.trim()
        ? (() => {
            try {
              return JSON.parse(existingStarted) as {
                ts?: number;
                jobId?: string;
                assetId?: string;
              };
            } catch {
              return null;
            }
          })()
        : null;

    if (session.subSteps?.asset3dCreated) {
      sessionStorage.removeItem(startedKey);
      persistImmersivePipelineState({
        assetId:
          storedPipelineState.assetId ??
          (typeof parsedExisting?.assetId === 'string'
            ? parsedExisting.assetId
            : undefined),
        assetStatus:
          storedPipelineState.assetStatus === 'uploaded'
            ? 'uploaded'
            : 'finalizing',
      });
      immersivePipelineRef.current.setStepLabel(
        'asset-3d',
        'Finalizing 3D asset...'
      );
      immersivePipelineRef.current.startStep('asset-3d');
      return;
    }

    const existingAssetId =
      storedPipelineState.assetId ??
      (typeof parsedExisting?.assetId === 'string'
        ? parsedExisting.assetId
        : null);

    if (existingAssetId) {
      const assetStatus = storedPipelineState.assetStatus ?? 'processing';
      const modelUrl = storedPipelineState.modelUrl ?? null;
      const last = immersive3dUiRef.current;

      if (
        last.assetId !== existingAssetId ||
        last.assetStatus !== assetStatus
      ) {
        last.assetId = existingAssetId;
        last.assetStatus = assetStatus;
        logImmersivePipeline('asset-status-resume', {
          assetId: existingAssetId,
          assetStatus,
          modelUrl,
        });
      }

      immersivePipelineRef.current.setStepLabel(
        'asset-3d',
        assetStatus === 'failed'
          ? '3D asset generation failed'
          : assetStatus === 'finalizing'
            ? 'Finalizing 3D asset...'
            : 'Generating 3D asset from image...'
      );

      if (assetStatus === 'failed') {
        immersivePipelineRef.current.failStep(
          'asset-3d',
          '3D asset generation failed.'
        );
      } else {
        immersivePipelineRef.current.startStep('asset-3d');
      }
      return;
    }

    if (existingStarted) {
      try {
        const ts =
          typeof parsedExisting?.ts === 'number' ? parsedExisting.ts : 0;
        const ageMs = Date.now() - ts;
        if (ageMs > 0 && ageMs < 2 * 60_000) return;
      } catch {
        // Fall through and restart if stored data is invalid.
      }
      sessionStorage.removeItem(startedKey);
    }

    const marketingStepData = asRecord(
      session.flow?.steps.find((step) => step.stepKey === 'marketing_image')
        ?.data
    );
    const bgRemoved =
      (typeof marketingStepData?.bgRemovedImage === 'string' &&
        marketingStepData.bgRemovedImage) ||
      null;
    const bgRemovedImageKey =
      (typeof marketingStepData?.bgRemovedImageKey === 'string' &&
        marketingStepData.bgRemovedImageKey) ||
      null;
    const resultImageKey =
      (typeof marketingStepData?.adWithBrandMemoryKey === 'string' &&
        marketingStepData.adWithBrandMemoryKey) ||
      null;
    const sourceImage =
      bgRemoved ||
      (typeof marketingStepData?.adWithBrandMemory === 'string'
        ? marketingStepData.adWithBrandMemory
        : null);
    const sourceImageKey = bgRemovedImageKey || resultImageKey;

    if (!sourceImage && !sourceImageKey) return;

    try {
      const jobId = createVersaImageJobId();
      sessionStorage.setItem(
        startedKey,
        JSON.stringify({ ts: Date.now(), jobId })
      );
      persistImmersivePipelineState({
        jobId,
        assetStatus: 'processing',
      });
      logImmersivePipeline('asset-generation-started', {
        sessionId,
        jobId,
        sourceImage,
        sourceImageKey,
      });
      immersivePipelineRef.current.setStepLabel(
        'asset-3d',
        'Generating 3D asset from image...'
      );
      immersivePipelineRef.current.startStep('asset-3d');
      const formData = new FormData();
      // The live backend currently rejects `sourceImageKey`, so only send the
      // URL field here until the server contract is updated.
      if (sourceImage) {
        formData.append('sourceImageUrl', sourceImage);
      }
      formData.append('mode', 'fast');
      formData.append('remesh', 'true');
      formData.append('texture_size', '2048');
      formData.append('decimation_target', '100000');
      formData.append('sessionId', jobId);
      formData.append(
        'title',
        state.validatedProductDetails?.productName?.trim() || 'Product 3D Model'
      );

      const postRes = await generateImageTo3D(formData);
      const returnedAssetId = extractVersaAssetId(postRes);

      if (returnedAssetId) {
        sessionStorage.setItem(
          startedKey,
          JSON.stringify({ ts: Date.now(), jobId, assetId: returnedAssetId })
        );
        persistImmersivePipelineState({
          jobId,
          assetId: returnedAssetId,
          assetStatus: 'processing',
        });
        logImmersivePipeline('asset-generation-queued', {
          sessionId,
          jobId,
          assetId: returnedAssetId,
        });
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : '3D asset generation failed';
      logImmersivePipeline('asset-generation-failed-to-start', {
        sessionId,
        error: errorMessage,
      });
      sessionStorage.removeItem(startedKey);
      // Transition the pipeline step to failed so the runner exits on re-run
      // and does not immediately retry (which would cause an infinite loop).
      immersivePipelineRef.current.failStep(
        'asset-3d',
        '3D asset generation failed. Please try again.'
      );
    }
  }, [
    generateImageTo3D,
    immersiveRequirements.asset3dCreated,
    persistImmersivePipelineState,
    session,
    session?.sessionId,
    session?.subSteps?.asset3dCreated,
    state.validatedProductDetails?.productName,
  ]);
  const runAssetStep =
    useCallback(async (): Promise<ImmersiveRunnerOutcome> => {
      if (!immersiveRequirements.asset3dCreated) return 'done';
      if (!session?.sessionId) return 'waiting';

      const pipelineState = readImmersivePipelineStorage(session.sessionId);
      const startedKey = `onboarding:immersive3d_started:${session.sessionId}`;
      const startedState =
        typeof sessionStorage !== 'undefined'
          ? sessionStorage.getItem(startedKey)
          : null;
      const parsedStarted =
        startedState && startedState.trim()
          ? (() => {
              try {
                return JSON.parse(startedState) as {
                  assetId?: string;
                };
              } catch {
                return null;
              }
            })()
          : null;
      const resolvedAssetId =
        pipelineState?.assetId ??
        (typeof parsedStarted?.assetId === 'string'
          ? parsedStarted.assetId
          : null);

      if (session.subSteps?.asset3dCreated) {
        const needsFinalizedAsset =
          Boolean(resolvedAssetId) &&
          (pipelineState?.assetStatus !== 'uploaded' ||
            !pipelineState?.modelUrl);

        if (needsFinalizedAsset && resolvedAssetId) {
          await finalizeImmersiveAssetMedia(resolvedAssetId);
        } else if (resolvedAssetId && !pipelineState?.modelUrl) {
          await fetchAndStoreImmersiveAsset(resolvedAssetId);
        }

        const latestPipelineState = readImmersivePipelineStorage(
          session.sessionId
        );
        const isAssetReady =
          Boolean(latestPipelineState?.modelUrl) &&
          (latestPipelineState?.assetStatus === 'uploaded' ||
            !latestPipelineState?.assetStatus);

        return isAssetReady ? 'done' : 'waiting';
      }

      await queueOrResumeImmersiveAssetGeneration();
      return 'waiting';
    }, [
      fetchAndStoreImmersiveAsset,
      finalizeImmersiveAssetMedia,
      immersiveRequirements.asset3dCreated,
      queueOrResumeImmersiveAssetGeneration,
      session?.sessionId,
      session?.subSteps?.asset3dCreated,
    ]);
  const runVisualizerStep =
    useCallback(async (): Promise<ImmersiveRunnerOutcome> => {
      if (!immersiveRequirements.visualizerCreated) return 'done';
      if (session?.subSteps?.visualizerCreated) return 'done';
      if (!session?.subSteps?.asset3dCreated) return 'waiting';

      await createPublishedImmersiveExperience({
        type: '3d_visualizer',
        stepId: 'visualizer',
        stepLabel: 'Preparing 3D visualizer',
        slugSuffix: 'viz',
        stateField: 'visualizerExperienceId',
      });

      return 'waiting';
    }, [
      createPublishedImmersiveExperience,
      immersiveRequirements.visualizerCreated,
      session?.subSteps?.asset3dCreated,
      session?.subSteps?.visualizerCreated,
    ]);
  const runArExperienceStep =
    useCallback(async (): Promise<ImmersiveRunnerOutcome> => {
      if (!immersiveRequirements.arExperienceCreated) return 'done';
      if (session?.subSteps?.arExperienceCreated) return 'done';

      const prerequisitesReady = immersiveRequirements.visualizerCreated
        ? !!session?.subSteps?.visualizerCreated
        : !immersiveRequirements.asset3dCreated ||
          !!session?.subSteps?.asset3dCreated;

      if (!prerequisitesReady) return 'waiting';

      await createPublishedImmersiveExperience({
        type: 'ar_experience',
        stepId: 'ar-experience',
        stepLabel: 'Enabling AR experience',
        slugSuffix: 'ar',
        stateField: 'arExperienceId',
      });

      return 'waiting';
    }, [
      createPublishedImmersiveExperience,
      immersiveRequirements.arExperienceCreated,
      immersiveRequirements.asset3dCreated,
      immersiveRequirements.visualizerCreated,
      session?.subSteps?.arExperienceCreated,
      session?.subSteps?.asset3dCreated,
      session?.subSteps?.visualizerCreated,
    ]);
  const runTryOnStep =
    useCallback(async (): Promise<ImmersiveRunnerOutcome> => {
      if (!immersiveRequirements.vtonCreated) return 'done';
      if (session?.subSteps?.vtonCreated) return 'done';

      const prerequisitesReady = immersiveRequirements.arExperienceCreated
        ? !!session?.subSteps?.arExperienceCreated
        : true;

      if (!prerequisitesReady) return 'waiting';

      await createImmersiveTryOnExperience();
      return 'waiting';
    }, [
      createImmersiveTryOnExperience,
      immersiveRequirements.arExperienceCreated,
      immersiveRequirements.vtonCreated,
      session?.subSteps?.arExperienceCreated,
      session?.subSteps?.vtonCreated,
    ]);
  const isBrandImmersiveFlowActive =
    session?.signupType === 'brand' &&
    isImmersiveProductPageStep(session.flow?.currentStepKey);
  const immersivePipelineTemplate = useMemo(
    () => createImmersivePipeline(immersiveRequirements),
    [immersiveRequirements]
  );
  const finalImmersiveStepId =
    immersivePipeline.state.steps[immersivePipeline.state.steps.length - 1]
      ?.id ?? null;

  useSyncPipeline(
    immersivePipeline,
    session?.subSteps ?? null,
    state.showingPipeline && isBrandImmersiveFlowActive
  );

  useEffect(() => {
    if (
      session?.signupType !== 'brand' ||
      !isImmersiveProductPageStep(session.flow?.currentStepKey) ||
      !state.showingPipeline
    ) {
      return;
    }

    let cancelled = false;

    const runnerSteps: ImmersiveRunnerStep[] = [
      {
        id: 'asset-3d' as const,
        required: immersiveRequirements.asset3dCreated,
        run: runAssetStep,
        fail: (message: string) => {
          immersivePipeline.setStepLabel(
            'asset-3d',
            '3D asset generation failed'
          );
          immersivePipeline.failStep('asset-3d', message);
        },
      },
      {
        id: 'visualizer' as const,
        required: immersiveRequirements.visualizerCreated,
        run: runVisualizerStep,
        fail: (message: string) => {
          immersivePipeline.setStepLabel(
            'visualizer',
            '3D visualizer creation failed'
          );
          immersivePipeline.failStep('visualizer', message);
        },
      },
      {
        id: 'ar-experience' as const,
        required: immersiveRequirements.arExperienceCreated,
        run: runArExperienceStep,
        fail: (message: string) => {
          immersivePipeline.setStepLabel(
            'ar-experience',
            'AR experience creation failed'
          );
          immersivePipeline.failStep('ar-experience', message);
        },
      },
      {
        id: 'ar-tryon' as const,
        required: immersiveRequirements.vtonCreated,
        run: runTryOnStep,
        fail: (message: string) => {
          immersivePipeline.setStepLabel(
            'ar-tryon',
            'AR try-on creation failed'
          );
          immersivePipeline.failStep('ar-tryon', message);
        },
      },
    ];

    const runPipeline = async () => {
      for (const runnerStep of runnerSteps) {
        if (!runnerStep.required) continue;

        const stepStatus = immersivePipeline.state.steps.find(
          (step) => step.id === runnerStep.id
        )?.status;

        if (stepStatus === 'failed') return;

        try {
          const outcome = await runnerStep.run();
          if (cancelled || outcome === 'waiting') return;
        } catch (error) {
          const message =
            error instanceof Error
              ? error.message
              : 'Unable to continue immersive experience generation.';
          runnerStep.fail(message);
          return;
        }
      }
    };

    void runPipeline();

    return () => {
      cancelled = true;
    };
  }, [
    immersiveRequirements,
    immersivePipeline,
    runArExperienceStep,
    runAssetStep,
    runTryOnStep,
    runVisualizerStep,
    session?.flow?.currentStepKey,
    session?.signupType,
    state.showingPipeline,
    immersivePipeline.state.steps,
  ]);

  useEffect(() => {
    if (!session) return;

    if (state.messages.length === 0) {
      const hydrated = hydrateMessagesFromSession(session, appendQuestionKey);
      if (hydrated.length > 0) {
        dispatch({ type: 'SET_MESSAGES', payload: hydrated });
        const hasBrandDna = hydrated.some(
          (message) =>
            message.kind === 'card' && message.card.type === 'brand-dna-ready'
        );
        if (hasBrandDna) {
          dispatch({ type: 'SET_BRAND_DNA_APPENDED', payload: true });
        }
      }
    }

    if (!tabInitializedRef.current) {
      tabInitializedRef.current = true;
      const initialIndividualTab =
        session.flow?.currentStepKey === 'cloth_try_on'
          ? 'cloth-try-on'
          : session.flow?.currentStepKey === 'product_ad'
            ? 'product-ad'
            : 'beauty-try-on';

      dispatch({
        type: 'SET_ACTIVE_TAB',
        payload:
          session.signupType === 'individual'
            ? initialIndividualTab
            : isImmersiveProductPageStep(session.flow?.currentStepKey)
              ? 'immersive-product-page'
              : 'brand-memory',
      });
    }

    if (session.signupType === 'individual') {
      const flowStep = session.flow?.currentStepKey ?? null;
      const desiredTab =
        flowStep === 'product_ad'
          ? 'product-ad'
          : flowStep === 'cloth_try_on'
            ? 'cloth-try-on'
            : flowStep === 'beauty_try_on'
              ? 'beauty-try-on'
              : null;

      if (
        desiredTab &&
        state.activeTab !== desiredTab &&
        ((state.activeTab === 'beauty-try-on' &&
          (desiredTab === 'cloth-try-on' || desiredTab === 'product-ad')) ||
          (state.activeTab === 'cloth-try-on' && desiredTab === 'product-ad'))
      ) {
        dispatch({ type: 'SET_ACTIVE_TAB', payload: desiredTab });
      }
    }

    if (
      session.signupType === 'brand' &&
      isImmersiveProductPageStep(session.flow?.currentStepKey)
    ) {
      const nextStepIds = immersivePipelineTemplate.steps
        .map((step) => step.id)
        .join(',');
      const currentStepIds = immersivePipeline.state.steps
        .map((step) => step.id)
        .join(',');

      if (!state.showingPipeline) {
        dispatch({ type: 'SET_SHOWING_PIPELINE', payload: true });
        dispatch({ type: 'SET_PIPELINE_COMPLETE', payload: false });
        immersivePipeline.reset(immersivePipelineTemplate);
      } else if (currentStepIds !== nextStepIds) {
        immersivePipeline.reset(immersivePipelineTemplate);
      }

      const marketingStepData = asRecord(
        session.flow?.steps.find((step) => step.stepKey === 'marketing_image')
          ?.data
      );
      if (
        marketingStepData &&
        typeof marketingStepData.adWithBrandMemory === 'string' &&
        marketingStepData.adWithBrandMemory
      ) {
        const nextBrandAdvertisementData = {
          originalImageUrl:
            (typeof marketingStepData.adWithoutBrandMemory === 'string' &&
              marketingStepData.adWithoutBrandMemory) ||
            '',
          resultUrl: marketingStepData.adWithBrandMemory,
          bgRemovedImage:
            (typeof marketingStepData.bgRemovedImage === 'string' &&
              marketingStepData.bgRemovedImage) ||
            null,
          originalImageKey:
            (typeof marketingStepData.adWithoutBrandMemoryKey === 'string' &&
              marketingStepData.adWithoutBrandMemoryKey) ||
            null,
          resultImageKey:
            (typeof marketingStepData.adWithBrandMemoryKey === 'string' &&
              marketingStepData.adWithBrandMemoryKey) ||
            null,
          bgRemovedImageKey:
            (typeof marketingStepData.bgRemovedImageKey === 'string' &&
              marketingStepData.bgRemovedImageKey) ||
            null,
        };

        if (
          !areBrandAdvertisementDataEqual(
            state.brandAdvertisementData,
            nextBrandAdvertisementData
          )
        ) {
          dispatch({
            type: 'SET_BRAND_ADVERTISEMENT_DATA',
            payload: nextBrandAdvertisementData,
          });
        }
      }

      const productStepData = asRecord(
        session.flow?.steps.find((step) => step.stepKey === 'product_link')
          ?.data
      );
      if (productStepData) {
        const productColors = asStringArray(productStepData.productColors);
        const productShadeColors = asProductShadeHexArray(
          productStepData.product_shades
        );
        const nextValidatedProductDetails = {
          productName:
            (typeof productStepData.productName === 'string' &&
              productStepData.productName) ||
            (typeof productStepData.product_name === 'string' &&
              productStepData.product_name) ||
            null,
          description:
            (typeof productStepData.description === 'string' &&
              productStepData.description) ||
            null,
          price:
            (typeof productStepData.price === 'string' &&
              productStepData.price) ||
            (typeof productStepData.price === 'number'
              ? String(productStepData.price)
              : null),
          productUrl:
            (typeof productStepData.productUrl === 'string' &&
              productStepData.productUrl) ||
            (typeof productStepData.product_url === 'string' &&
              productStepData.product_url) ||
            null,
          productImages:
            asStringArray(productStepData.productImages).length > 0
              ? asStringArray(productStepData.productImages)
              : asStringArray(productStepData.product_images),
          productColors:
            productColors.length > 0 ? productColors : productShadeColors,
          subCategory:
            (typeof productStepData.subCategory === 'string' &&
              productStepData.subCategory) ||
            (typeof productStepData.sub_category === 'string' &&
              productStepData.sub_category) ||
            null,
        };

        if (
          !areValidatedProductDetailsEqual(
            state.validatedProductDetails,
            nextValidatedProductDetails
          )
        ) {
          dispatch({
            type: 'SET_VALIDATED_PRODUCT_DETAILS',
            payload: nextValidatedProductDetails,
          });
        }
      }

      if (!state.isImmersivePDPOpen) {
        dispatch({ type: 'SET_IMMERSIVE_PDP_OPEN', payload: true });
      }
    }

    if (
      session.signupType === 'brand' &&
      session.currentStep === 'validate-product'
    ) {
      if (!state.brandAnalysisCompleted) {
        dispatch({ type: 'SET_BRAND_ANALYSIS_COMPLETED', payload: true });
      }

      // Hydrate brand kit state on refresh (once): keep modal open and restore data from session
      // Only reopen if user has NOT yet confirmed (check sessionStorage + productUrl from backend)
      if (!state.brandKitHydrated) {
        dispatch({ type: 'SET_BRAND_KIT_HYDRATED', payload: true });
        const raw = session.rawData as Record<string, unknown> | undefined;
        const hasProductUrl =
          session.answers?.productUrl ||
          (raw?.answers &&
            typeof raw.answers === 'object' &&
            (raw.answers as Record<string, unknown>)?.productUrl) ||
          (raw?.user &&
            typeof raw.user === 'object' &&
            (raw.user as Record<string, unknown>)?.productUrl);
        const brandKitConfirmedInStorage =
          typeof sessionStorage !== 'undefined' &&
          sessionStorage.getItem(BRAND_KIT_CONFIRMED_KEY) === session.sessionId;
        const hasBrandData =
          (session.rawData && Object.keys(session.rawData).length > 0) ||
          (session.brand?.logos?.length ?? 0) > 0 ||
          (session.brand?.colors?.primary?.length ?? 0) > 0;
        const shouldReopenBrandKit =
          session.flow?.currentStepKey === 'brand_analysis' &&
          hasBrandData &&
          !hasProductUrl &&
          !brandKitConfirmedInStorage;

        if (shouldReopenBrandKit) {
          dispatch({ type: 'SET_BRAND_KIT_OPEN', payload: true });
          dispatch({
            type: 'SET_CONFIRMED_BRAND_KIT_DATA',
            payload: buildBrandKitData(
              session,
              session.rawData as Record<string, unknown>
            ),
          });
          dispatch({
            type: 'SET_PENDING_BRAND_KIT_RAW_DATA',
            payload: (session.rawData as BrandKitRawData | undefined) ?? null,
          });
        }
      }
    }

    if (state.pendingStep && session.currentStep === state.pendingStep) {
      dispatch({ type: 'SET_PENDING_STEP', payload: null });
    }

    const completionHoldKey = getIndividualCompletionHoldKey(session.sessionId);
    const shouldHoldIndividualCompletion =
      session.signupType === 'individual' &&
      Boolean(completionHoldKey) &&
      sessionStorage.getItem(completionHoldKey as string) === '1';

    if (
      session.status === 'completed' &&
      !state.showingPipeline &&
      !shouldHoldIndividualCompletion
    ) {
      void navigate('/dashboard');
    }
  }, [
    dispatch,
    immersivePipeline,
    immersivePipelineTemplate,
    navigate,
    session,
    state.brandKitHydrated,
    state.brandAdvertisementData,
    state.brandAnalysisCompleted,
    state.isImmersivePDPOpen,
    state.messages.length,
    state.pendingStep,
    state.showingPipeline,
    state.validatedProductDetails,
  ]);

  useEffect(() => {
    if (isLoading || !sessionWithUi) return;
    // message hydration
    if (state.messages.length === 0) {
      const hydratedMessages = hydrateMessagesFromSession(
        sessionWithUi,
        () => undefined
      );
      if (hydratedMessages.length > 0) {
        return;
      }
    }

    if (
      shouldWaitForBrandDnaBeforeQuestion(sessionWithUi) &&
      !hasBrandDnaReadyMessage(state.messages, state.brandDnaAppended)
    ) {
      return;
    }

    const rawQuestion = sessionWithUi.nextQuestion?.trim();
    const question = getQuestionForCurrentStep(
      rawQuestion,
      effectiveUserInfoAnswers,
      state.isBrandKitOpen
    );

    if (!question) return;

    const resolvedStep = state.pendingStep ?? sessionWithUi.currentStep;
    if (
      sessionWithUi.signupType === 'individual' &&
      resolvedStep === 'complete'
    ) {
      return;
    }

    const key = buildQuestionKey(
      isCollectingUserInfo ? 'user-info' : resolvedStep,
      question
    );
    const normalizedQuestion = question.trim();
    const alreadyRenderedQuestion = state.messages.some(
      (message) =>
        message.from === 'ai' &&
        message.kind === 'text' &&
        message.text.trim() === normalizedQuestion
    );

    if (questionKeysRef.current.has(key) || alreadyRenderedQuestion) {
      appendQuestionKey(key);
      return;
    }
    appendQuestionKey(key);
    appendText(question, 'ai');
  }, [
    appendText,
    isCollectingUserInfo,
    isLoading,
    sessionWithUi,
    state.isBrandKitOpen,
    state.messages,
    state.pendingStep,
    effectiveUserInfoAnswers,
  ]);

  useEffect(() => {
    if (!state.showingPipeline || state.pipelineComplete) return;
    if (
      !allSubStepsDone(
        session?.subSteps ?? null,
        immersiveRequirements,
        immersiveSubStepsOptions
      )
    )
      return;
    if (state.deploymentSuccessAppended) return;

    dispatch({ type: 'SET_DEPLOYMENT_SUCCESS_APPENDED', payload: true });
    if (finalImmersiveStepId) {
      const finalStep = immersivePipeline.state.steps.find(
        (s) => s.id === finalImmersiveStepId
      );
      if (finalStep?.status !== 'failed') {
        immersivePipeline.completeStep(finalImmersiveStepId);
      }
    }
    dispatch({ type: 'SET_PIPELINE_COMPLETE', payload: true });

    // Persist completion so reloads advance beyond immersive step.
    if (
      session?.signupType === 'brand' &&
      isImmersiveProductPageStep(session.flow?.currentStepKey)
    ) {
      void completeOnboardingStepMutation
        .mutateAsync({ stepKey: 'immersive_product_page' })
        .catch(() => undefined);
      logImmersivePipeline('immersive-step-complete-requested', {
        sessionId: session.sessionId,
      });
      void debugFetchImmersiveStatus('immersive-step-complete-requested');
    }
  }, [
    debugFetchImmersiveStatus,
    dispatch,
    finalImmersiveStepId,
    immersiveRequirements,
    immersivePipeline,
    session?.experienceUrl,
    session?.subSteps,
    session?.signupType,
    session?.flow?.currentStepKey,
    state.deploymentSuccessAppended,
    state.pipelineComplete,
    state.showingPipeline,
    completeOnboardingStepMutation,
    immersiveSubStepsOptions,
  ]);

  useEffect(() => {
    if (
      hasNavigatedToSuccessRef.current ||
      session?.signupType !== 'brand' ||
      !allSubStepsDone(
        session?.subSteps ?? null,
        immersiveRequirements,
        immersiveSubStepsOptions
      )
    ) {
      return;
    }

    try {
      const immersiveState = readImmersivePipelineStorage(session.sessionId);
      const fallbackProductName =
        state.validatedProductDetails?.productName ??
        cosmeticTryOnModalData?.productTitle ??
        null;
      const fallbackProductUrl =
        state.validatedProductDetails?.productUrl ??
        cosmeticTryOnModalData?.productLink ??
        session.answers?.productUrl ??
        null;
      const fallbackProductColors = state.validatedProductDetails?.productColors
        ?.length
        ? state.validatedProductDetails.productColors
        : cosmeticTryOnModalData?.variants?.length
          ? cosmeticTryOnModalData.variants
          : null;
      const fallbackSubCategory =
        state.validatedProductDetails?.subCategory ??
        cosmeticTryOnModalData?.subCategory ??
        session.answers?.subCategory ??
        'Lipstick';
      const payload = {
        sessionId: session.sessionId,
        immersivePdpProps: {
          profilePhoto: session.brand?.profilePhoto ?? null,
          vibeDescription: session.brand?.vibe?.description ?? null,
          productUrl: fallbackProductUrl,
          productImages: state.brandAdvertisementData?.resultUrl
            ? [state.brandAdvertisementData.resultUrl]
            : (state.validatedProductDetails?.productImages ?? null),
          productName: fallbackProductName,
          productDescription:
            state.validatedProductDetails?.description ?? null,
          productColors: fallbackProductColors,
          category:
            state.validateProductAnswers.category ??
            session.answers?.category ??
            null,
          subCategory: fallbackSubCategory,
          generatedModelUrl: immersiveState?.modelUrl ?? null,
          generatedThumbnailUrl: immersiveState?.thumbnailUrl ?? null,
          publishedLink: immersiveState?.arExperienceLink ?? null,
        },
        isImmersivePdpVisible: true,
        isImmersivePDPOpen: state.isImmersivePDPOpen,
        shouldAutoGenerate3D: false,
      };

      if (typeof sessionStorage !== 'undefined') {
        sessionStorage.setItem(
          onboardingSuccessStorageKey,
          JSON.stringify(payload)
        );
      }
    } catch {
      // Ignore storage errors; fallback to in-flow UI.
    }

    hasNavigatedToSuccessRef.current = true;
    navigate('/onboarding/success', { replace: true });
  }, [
    immersiveRequirements,
    immersiveSubStepsOptions,
    navigate,
    onboardingSuccessStorageKey,
    session?.sessionId,
    session?.answers?.category,
    session?.answers?.productUrl,
    session?.answers?.subCategory,
    session?.brand?.profilePhoto,
    session?.brand?.vibe?.description,
    session?.signupType,
    session?.subSteps,
    cosmeticTryOnModalData?.productLink,
    cosmeticTryOnModalData?.productTitle,
    cosmeticTryOnModalData?.subCategory,
    cosmeticTryOnModalData?.variants,
    state.brandAdvertisementData?.resultUrl,
    state.isImmersivePDPOpen,
    state.validateProductAnswers.category,
    state.validatedProductDetails?.description,
    state.validatedProductDetails?.productColors,
    state.validatedProductDetails?.productImages,
    state.validatedProductDetails?.productName,
    state.validatedProductDetails?.productUrl,
    state.validatedProductDetails?.subCategory,
  ]);

  useEffect(() => {
    const questionKeys = questionKeysRef.current;
    return () => {
      questionKeys.clear();
    };
  }, []);

  const isSubmitting =
    saveUserInfoMutation.isPending ||
    validateProductMutation.isPending ||
    extractPdpMutation.isPending ||
    checkVtonHealthMutation.isPending ||
    generateFashionVtonMutation.isPending ||
    brandAdvertisementMutation.isPending ||
    state.status === 'analyzing' ||
    completeOnboardingStepMutation.isPending ||
    completeOnboardingMutation.isPending ||
    isSubmitLocked;

  const handleUserMessage = (text: string) => {
    appendText(text, 'user');
  };

  const handleUserAttachmentsMessage = (attachments: MediaAttachment[]) => {
    appendMessage({
      from: 'user',
      kind: 'card',
      card: { type: 'user-attachments', attachments },
    });
  };

  const handleGoToDashboard = () => {
    void navigate('/dashboard');
  };

  const handleCompleteIndividualOnboarding = () => {
    void (async () => {
      try {
        dispatch({ type: 'SET_SUBMIT_ERROR', payload: null });
        await completeOnboardingMutation.mutateAsync(undefined);
        const completionHoldKey = getIndividualCompletionHoldKey(
          session?.sessionId
        );
        if (completionHoldKey) {
          sessionStorage.removeItem(completionHoldKey);
        }
        await navigate('/dashboard');
      } catch (error) {
        dispatch({
          type: 'SET_SUBMIT_ERROR',
          payload:
            error instanceof Error
              ? error.message
              : 'Unable to complete onboarding. Please try again.',
        });
      }
    })();
  };

  const handleSkipOnboarding = () => {
    void (async () => {
      try {
        dispatch({ type: 'SET_SUBMIT_ERROR', payload: null });
        await completeOnboardingMutation.mutateAsync({
          skipPendingRequiredSteps: true,
        });
        if (session?.signupType === 'individual') {
          const completionHoldKey = getIndividualCompletionHoldKey(
            session?.sessionId
          );
          if (completionHoldKey) {
            sessionStorage.removeItem(completionHoldKey);
          }
        }
        await navigate('/dashboard');
      } catch (error) {
        dispatch({
          type: 'SET_SUBMIT_ERROR',
          payload:
            error instanceof Error
              ? error.message
              : 'Unable to complete onboarding. Please try again.',
        });
      }
    })();
  };

  const handleCloseCosmeticTryOnModal = () => setCosmeticTryOnModalData(null);

  const handleCompleteBeautyTryOn = useCallback(() => {
    if (session?.signupType !== 'individual') {
      setCosmeticTryOnModalData(null);
      return;
    }

    void (async () => {
      try {
        dispatch({ type: 'SET_SUBMIT_ERROR', payload: null });

        const latestSession = await getOnboardingSession();
        const currentFlowStepKey = latestSession.flow?.currentStepKey;
        if (currentFlowStepKey === 'beauty_try_on') {
          await completeOnboardingStepMutation.mutateAsync({
            stepKey: 'beauty_try_on',
            data: {
              beautySubCategory:
                state.individualBeautyAnswers.beautySubCategory ??
                beautyTryOnModalSnapshot.subCategory ??
                null,
              beautyProductUrl:
                state.individualBeautyAnswers.beautyProductUrl ??
                beautyTryOnModalSnapshot.productLink ??
                null,
              variants: beautyTryOnModalSnapshot.variants,
            },
          });
        }

        setCosmeticTryOnModalData(null);
        dispatch({ type: 'SET_ACTIVE_TAB', payload: 'cloth-try-on' });
      } catch (error) {
        dispatch({
          type: 'SET_SUBMIT_ERROR',
          payload:
            error instanceof Error
              ? error.message
              : 'Unable to save beauty try-on progress. Please try again.',
        });
      }
    })();
  }, [
    beautyTryOnModalSnapshot,
    completeOnboardingStepMutation,
    dispatch,
    session?.signupType,
    state.individualBeautyAnswers.beautyProductUrl,
    state.individualBeautyAnswers.beautySubCategory,
  ]);

  const handleBrandKitProceed = async (data: OnboardingBrandKitData) => {
    if (session?.sessionId) {
      sessionStorage.setItem(BRAND_KIT_CONFIRMED_KEY, session.sessionId);
    }

    const formData = new FormData();
    const brandName = data.vibe.archetype.trim();
    const primaryLogo = data.profilePhoto ?? data.logos?.[0] ?? null;
    const profilePayload: Record<string, unknown> = {};

    if (primaryLogo) {
      formData.append('profilePhoto', primaryLogo);
      profilePayload.profilePhoto = primaryLogo;
    }

    if (brandName) {
      profilePayload.name = brandName;
    }

    if (Object.keys(profilePayload).length > 0) {
      formData.append('profile', JSON.stringify(profilePayload));
    }

    formData.append(
      'kit',
      JSON.stringify({
        profilePhoto: primaryLogo,
        colors: data.colors,
        fonts: data.fonts,
        vibe: data.vibe,
        logos: data.logos,
      })
    );

    try {
      await updateBrandMutation.mutateAsync(formData);
    } catch {
      // Brand kit update is best-effort; onboarding continues without blocking
    }

    dispatch({ type: 'SET_CONFIRMED_BRAND_KIT_DATA', payload: data });
    dispatch({ type: 'SET_BRAND_KIT_OPEN', payload: false });
    dispatch({ type: 'SET_ACTIVE_TAB', payload: 'brand-memory' });

    const baseRaw =
      state.pendingBrandKitRawData ??
      (session?.rawData as Record<string, unknown> | undefined) ??
      {};
    const baseBrand =
      typeof baseRaw.brand === 'object' && baseRaw.brand
        ? (baseRaw.brand as Record<string, unknown>)
        : {};
    const existingProfilePhoto =
      (baseRaw.profilePhoto as string) ?? (baseBrand.profilePhoto as string);

    const rawDataWithUserSelection: BrandKitRawData = {
      ...baseRaw,
      profilePhoto: primaryLogo ?? existingProfilePhoto,
      primaryColors: data.colors.primary,
      secondaryColors: data.colors.secondary,
      others: data.colors.others ?? [],
      typography: {
        heading: data.fonts[0],
        body: data.fonts[1],
        description: data.vibe.description,
      },
      vibeKeywords: data.vibe.preferredTerms,
      brandName: data.vibe.archetype,
      vibe: data.vibe.description,
      brand: {
        ...baseBrand,
        profilePhoto: primaryLogo ?? baseBrand.profilePhoto,
        colors: {
          primary: data.colors.primary,
          secondary: data.colors.secondary,
          others: data.colors.others ?? [],
        },
        fonts: data.fonts,
        vibe: data.vibe,
      },
    } as BrandKitRawData;

    if (!state.brandDnaAppended) {
      appendText(ONBOARDING_QUESTION_BRAND_DNA_READY, 'ai');
      appendCard({
        type: 'brand-dna-ready',
        rawData: rawDataWithUserSelection,
      });
      dispatch({ type: 'SET_BRAND_DNA_APPENDED', payload: true });
    }

    dispatch({ type: 'SET_PENDING_BRAND_KIT_RAW_DATA', payload: null });

    // If we have a product URL from analysis, auto-trigger extraction
    const productUrl =
      session?.answers?.productUrl ||
      (baseRaw.answers as Record<string, unknown>)?.productUrl ||
      (baseRaw.user as Record<string, unknown>)?.productUrl ||
      (baseRaw.productUrl as string);

    if (productUrl && session?.signupType === 'individual') {
      try {
        const result = await extractPdpMutation.mutateAsync({
          url: productUrl as string,
        });
        if ((result.productImages?.length ?? 0) > 0) {
          appendCard({
            type: 'product-selection',
            images: result.productImages ?? [],
            productName: result.productName ?? 'Your Product',
            description: result.description ?? '',
            price: result.price ?? '',
          });
        }
      } catch (error) {
        console.error('Auto-extraction failed:', error);
      }
    }
  };

  const {
    handleAnalyzeBrand,
    handleValidateProductStep,
    handleUserInfoAnswer,
    handleIndividualBeautyAnswer,
  } = useOnboardingHandlers({
    session,
    sessionWithUi,
    state,
    effectiveUserInfoAnswers,
    effectiveValidateProductAnswers,
    isCollectingUserInfo,
    dispatch,
    appendText,
    appendCard,
    setCosmeticTryOnModalData,
    refetch,
    saveUserInfoMutation,
    completeOnboardingStepMutation,
    extractPdpMutation,
    validateProductMutation,
    creativeStudioPhotoshootMutation,
    checkVtonHealthMutation,
    generateFashionVtonMutation,
    waitForGeneratedMediaCompletion,
    fetchGeneratedMediaResultUrlWithRetry,
    getQueueDescription,
    isOtherSelection,
    resolveTryOnSubCategory,
  });

  const handleStepAnswer = useCallback(
    async (
      effectiveStep: OnboardingStepId | undefined,
      answer: string,
      attachments: MediaAttachment[]
    ): Promise<boolean> => {
      if (effectiveStep === 'analyze-brand') {
        await handleAnalyzeBrand(answer);
        return true;
      }

      if (effectiveStep === 'validate-product') {
        await handleValidateProductStep(answer, attachments);
        return true;
      }

      return false;
    },
    [handleAnalyzeBrand, handleValidateProductStep]
  );

  const handleSubmitError = useCallback(
    (error: unknown) => {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Something went wrong. Please try again.';

      if (session?.signupType === 'brand') {
        marketingPipeline.failStep('marketing-image', errorMessage);
      }
      if (state.showingPipeline && !state.pipelineComplete) {
        dispatch({ type: 'SET_SHOWING_PIPELINE', payload: false });
        immersivePipeline.failStep('ar-tryon', errorMessage);
      }

      dispatch({ type: 'SET_SUBMIT_ERROR', payload: errorMessage });
    },
    [
      dispatch,
      immersivePipeline,
      marketingPipeline,
      session?.signupType,
      state.pipelineComplete,
      state.showingPipeline,
    ]
  );

  const finalizeSubmitStatus = useCallback(
    (nextUserInfoAnswers?: Partial<OnboardingUserInfo>) => {
      if (!state.showingPipeline) {
        const answersForStatus =
          nextUserInfoAnswers ?? effectiveUserInfoAnswers;
        dispatch({
          type: 'SET_STATUS',
          payload: isUserInfoIncomplete(answersForStatus)
            ? 'collecting'
            : 'idle',
        });
      }
    },
    [dispatch, effectiveUserInfoAnswers, state.showingPipeline]
  );

  const brandOnboardingConfig = useMemo(
    () => ({
      session,
      state,
      brandAnalysisCompleted: state.brandAnalysisCompleted,
      isSubmitLocked,
      setIsSubmitLocked,
      handleUserInfoAnswer,
      handleStepAnswer,
      handleSubmitError,
      finalizeSubmitStatus,
      clearSubmitError: () =>
        dispatch({ type: 'SET_SUBMIT_ERROR', payload: null }),
    }),
    [
      session,
      state,
      isSubmitLocked,
      setIsSubmitLocked,
      handleUserInfoAnswer,
      handleStepAnswer,
      handleSubmitError,
      finalizeSubmitStatus,
      dispatch,
    ]
  );

  const individualOnboardingConfig = useMemo(
    () => ({
      session,
      state,
      isSubmitLocked,
      setIsSubmitLocked,
      handleUserInfoAnswer,
      handleIndividualBeautyAnswer,
      handleStepAnswer,
      handleSubmitError,
      finalizeSubmitStatus,
      clearSubmitError: () =>
        dispatch({ type: 'SET_SUBMIT_ERROR', payload: null }),
    }),
    [
      session,
      state,
      isSubmitLocked,
      setIsSubmitLocked,
      handleUserInfoAnswer,
      handleIndividualBeautyAnswer,
      handleStepAnswer,
      handleSubmitError,
      finalizeSubmitStatus,
      dispatch,
    ]
  );

  const brandOnboarding = useBrandOnboarding(brandOnboardingConfig);

  const individualOnboarding = useIndividualOnboarding(
    individualOnboardingConfig
  );

  const activeOnboarding =
    session?.signupType === 'individual'
      ? individualOnboarding
      : brandOnboarding;

  const handleSubmitAnswer = activeOnboarding.handleSubmitAnswer;

  const productImageSelectionConfig = useMemo(
    () => ({
      session,
      state,
      dispatch,
      refetch,

      marketingPipeline,
      immersivePipeline,

      appendText,
      appendCard,

      effectiveValidateProductAnswers,

      extractPdpMutation,
      brandAdvertisementMutation,
      completeOnboardingMutation,

      isOtherSelection,
    }),
    [
      session,
      state,
      dispatch,
      refetch,
      marketingPipeline,
      immersivePipeline,
      appendText,
      appendCard,
      effectiveValidateProductAnswers,
      extractPdpMutation,
      brandAdvertisementMutation,
      completeOnboardingMutation,
    ]
  );

  const { handleProductImageSelected } = useProductImageSelection(
    productImageSelectionConfig
  );

  useSocket({
    enabled: session?.signupType === 'brand',
    onNotification: (notification: NotificationPayload) => {
      if (notification.entityType !== 'asset_library') return;
      if (!notification.entityId) return;

      const sessionId = session?.sessionId;
      if (!sessionId) return;
      const startedKey = `onboarding:immersive3d_started:${sessionId}`;
      const raw = sessionStorage.getItem(startedKey);
      if (!raw) return;

      let parsed: { assetId?: string; jobId?: string } | null = null;
      try {
        parsed = JSON.parse(raw) as { assetId?: string; jobId?: string };
      } catch {
        return;
      }

      const expectedAssetId =
        typeof parsed?.assetId === 'string' ? parsed.assetId : null;
      if (expectedAssetId && notification.entityId !== expectedAssetId) return;

      if (
        !expectedAssetId &&
        notification.type === VERSA_3D_GENERATION_COMPLETED
      ) {
        sessionStorage.setItem(
          startedKey,
          JSON.stringify({
            ts: Date.now(),
            jobId: parsed?.jobId,
            assetId: notification.entityId,
          })
        );
        persistImmersivePipelineState({
          jobId: parsed?.jobId,
          assetId: notification.entityId,
          assetStatus: 'finalizing',
        });
        logImmersivePipeline('asset-socket-completed', {
          sessionId,
          jobId: parsed?.jobId,
          assetId: notification.entityId,
        });
      }

      if (notification.type === VERSA_3D_GENERATION_COMPLETED) {
        void (async () => {
          try {
            const resolvedAssetId = expectedAssetId || notification.entityId;
            if (!resolvedAssetId) return;
            await refetch();
            await debugFetchImmersiveStatus('asset-socket-completed');
            await finalizeImmersiveAssetMedia(resolvedAssetId);
            immersivePipeline.setStepLabel(
              'asset-3d',
              'Generated 3D asset from image'
            );
            immersivePipeline.completeStep('asset-3d');
          } catch {
            // Session refetch + recovery effect will retry from stored assetId.
          }
        })();
        return;
      }

      if (notification.type === VERSA_3D_GENERATION_FAILED) {
        persistImmersivePipelineState({
          jobId: parsed?.jobId,
          assetId: expectedAssetId ?? undefined,
          assetStatus: 'failed',
        });
        logImmersivePipeline('asset-socket-failed', {
          sessionId,
          jobId: parsed?.jobId,
          assetId: expectedAssetId ?? notification.entityId,
          message: notification.message,
        });
        immersivePipeline.setStepLabel(
          'asset-3d',
          '3D asset generation failed'
        );
        immersivePipeline.failStep('asset-3d', notification.message);
        void (async () => {
          await refetch();
          await debugFetchImmersiveStatus('asset-socket-failed');
        })();
      }
    },
  });

  return {
    session,
    sessionWithUi,
    isLoading,
    isError,
    errorMessage,
    refetch,
    isSubmitting,
    isBrandKitProceeding: updateBrandMutation.isPending,
    marketingPipeline,
    immersivePipeline,
    state,
    dispatch,
    handleSubmitAnswer,
    handleUserMessage,
    handleUserAttachmentsMessage,
    handleGoToDashboard,
    handleCompleteIndividualOnboarding,
    handleSkipOnboarding,
    cosmeticTryOnModalData,
    handleCloseCosmeticTryOnModal,
    handleCompleteBeautyTryOn,
    handleBrandKitProceed,
    handleProductImageSelected,
    validateProductMutation,
    extractPdpMutation,
  };
}
