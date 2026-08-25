import {
  useState,
  useRef,
  useCallback,
  type DragEvent,
  type ChangeEvent,
  useEffect,
  useMemo,
} from 'react';
import {
  MULTIVIEW_PROMPT_SUGGESTIONS,
  SINGLE_PROMPT_SUGGESTIONS,
} from '../../data';
import { useForm, useWatch } from 'react-hook-form';
import type {
  FormValues,
  ImageItem,
  InputTo3DMode,
  IResult,
  ModeValue,
  TabData,
  ToastCardProps,
  VersaAiLocationState,
  VersaJobType,
} from '../../types';
import {
  createVersaImageJobId,
  useAttach3DAssetMedia,
  useGenerateImageTo3D,
  useGet3DAssetByIdVersa,
  useQueueVersaImageGeneration,
  useVersaImageGenerationResult,
} from '../../services/versa-ai';
import useOutsideClick from '../../hooks/useOutsideClick';
import ToastCard from '../../components/AlertCards/ToastCard';
import { useLocation, useNavigate } from 'react-router';
import { getUser, getImageUrl } from '../../lib/utils';
import { privateApiClient, publicApiClient } from '../../services/api';
import { useSocket } from '../../hooks/useSocket';
import { useSpriteWorker } from '../../webWorker/useSpriteWorker';
import {
  type NotificationPayload,
  VERSA_IMAGE_GENERATION_COMPLETED,
  VERSA_IMAGE_GENERATION_FAILED,
  VERSA_3D_GENERATION_COMPLETED,
  VERSA_3D_GENERATION_FAILED,
} from '../../services/socket-services';
import { VersaCanvas } from './components/VersaCanvas';
import { VersaExportOptionsCard } from './components/VersaExportOptionsCard';
import { VersaSidebar } from './components/VersaSidebar';

const MAX_MULTIVIEW_IMAGES = 3;
const MAX_SIZE = 5 * 1024 * 1024;
const DEFAULT_VERSION_THUMBNAIL = '/assets/images/thumbnail.webp';
const MODEL_FILE_REGEX = /\.(glb|gltf)(?:$|[?#])/i;
const ACCEPTED = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/bmp',
];

const DATA_URL_REGEX = /^data:image\/[a-zA-Z0-9.+-]+;base64,/;

const IMAGE_MIME_BY_EXTENSION: Record<string, string> = {
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
  bmp: 'image/bmp',
  gif: 'image/gif',
  svg: 'image/svg+xml',
};
const PLAN_LIMIT_EXCEEDED_MESSAGE =
  'Usage limit exceeded for your current plan.';

const getErrorMessage = (caughtError: unknown, fallback: string) => {
  if (caughtError instanceof Error && caughtError.message.trim()) {
    return caughtError.message.trim();
  }

  return fallback;
};

const isModelLikeFile = (value: string) => MODEL_FILE_REGEX.test(value);

const DEFAULT_VALUES = {
  images: [],
  promptText: '',
  // removeBackground: true,
  modelType: 'fast',
  meshOptimization: true,
  textureSize: '2048',
  triTargets: '100000',
};

export default function VersaAI() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [selectedSuggestionIdx, setSelectedSuggestionIdx] = useState(-1);
  const [inputTo3DMode, setInputTo3DMode] = useState<InputTo3DMode>('single');
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState('');
  const [showExportOptions, setShowExportOptions] = useState(false);
  const [copied, setCopied] = useState(false);
  const [selectedResultIdx, setSelectedResultIdx] = useState<number>(0);
  const [resultFiles, setResultFiles] = useState<IResult[]>([]);
  const [exportFormat, setExportFormat] = useState<string>('glb');
  const [generationStartedAt, setGenerationStartedAt] = useState<number | null>(
    null
  );
  const [isAwaitingVersaSocket, setIsAwaitingVersaSocket] = useState(false);
  const [isGenerationFlowActive, setIsGenerationFlowActive] = useState(false);
  const [isFinalizingGeneration, setIsFinalizingGeneration] = useState(false);
  const [isAttachingVersionMedia, setIsAttachingVersionMedia] = useState(false);
  const [activeVersaJobType, setActiveVersaJobType] =
    useState<VersaJobType>(null);
  const [toastCardProps, setToastCardProps] = useState<ToastCardProps>();
  const [toastIndex, setToastIndex] = useState(0);

  const formattedOptions = useMemo(() => {
    return (
      resultFiles[selectedResultIdx]?.data
        ?.map((o) => o.name?.split('.')?.pop() || '')
        ?.filter(Boolean) ?? []
    );
  }, [resultFiles, selectedResultIdx]);
  const outsideClickRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const thumbInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const pendingSocketAssetIdRef = useRef<string | null>(null);
  const [activeVersaImageJobId, setActiveVersaImageJobId] = useState<
    string | null
  >(null);
  const [hasGeneratedVersaImage, setHasGeneratedVersaImage] = useState(false);
  const modelGenerationSessionIdRef = useRef<string | null>(null);
  const isViewerModelLoadedRef = useRef(false);
  const generatedPreviewUrlsRef = useRef<Set<string>>(new Set());
  const modeImagesRef = useRef<Record<InputTo3DMode, ImageItem[]>>({
    single: [],
    multiview: [],
  });
  const generateQuery = useGenerateImageTo3D();
  const { mutateAsync: attachAssetMedia } = useAttach3DAssetMedia();
  const { mutateAsync: get3DAssetByIdVersa } = useGet3DAssetByIdVersa();
  const queueVersaImageQuery = useQueueVersaImageGeneration();
  const { refetch: refetchVersaImageResult } = useVersaImageGenerationResult(
    activeVersaImageJobId ?? undefined,
    false
  );
  const { generate: generateSpriteAndThumbnail } = useSpriteWorker();
  const navigate = useNavigate();
  const location = useLocation();
  const {
    handleSubmit,
    control,
    setValue,
    getValues,
    reset: resetForm,
  } = useForm<FormValues>({
    defaultValues: DEFAULT_VALUES,
  });

  const images = useWatch({ control, name: 'images' });
  const promptText = useWatch({ control, name: 'promptText' });
  const meshOptimization = useWatch({ control, name: 'meshOptimization' });
  const modelType = useWatch({ control, name: 'modelType' }) as ModeValue;
  const promptLength = promptText?.trim().length ?? 0;
  const isSingleMode = inputTo3DMode === 'single';
  const maxImages = isSingleMode ? 1 : MAX_MULTIVIEW_IMAGES;
  const activePromptSuggestions = isSingleMode
    ? SINGLE_PROMPT_SUGGESTIONS
    : MULTIVIEW_PROMPT_SUGGESTIONS.map((item) => item.prompt);
  const isVersaImageGenerating =
    queueVersaImageQuery.isPending || activeVersaImageJobId !== null;
  const isGenerateImageButtonDisabled =
    promptLength > 200 || promptLength <= 0 || isVersaImageGenerating;

  const ensureModelGenerationSessionId = useCallback(() => {
    if (modelGenerationSessionIdRef.current) {
      return modelGenerationSessionIdRef.current;
    }
    const sessionId = createVersaImageJobId();
    modelGenerationSessionIdRef.current = sessionId;
    return sessionId;
  }, []);

  const setImages = useCallback(
    (updater: ImageItem[] | ((prev: ImageItem[]) => ImageItem[])) => {
      const currentImages = getValues('images') ?? [];
      const newVal =
        typeof updater === 'function' ? updater(currentImages) : updater;
      setValue('images', newVal, { shouldDirty: true });
    },
    [getValues, setValue]
  );

  const registerGeneratedPreviewUrl = useCallback((url?: string) => {
    if (!url?.startsWith('blob:')) return;
    generatedPreviewUrlsRef.current.add(url);
  }, []);

  const revokeGeneratedPreviewUrls = useCallback(() => {
    generatedPreviewUrlsRef.current.forEach((url) => {
      URL.revokeObjectURL(url);
    });
    generatedPreviewUrlsRef.current.clear();
  }, []);

  const persistImagesForMode = useCallback(
    (mode: InputTo3DMode, modeImages: ImageItem[]) => {
      if (mode === 'single') {
        modeImagesRef.current.single = modeImages.slice(0, 1);
        return;
      }

      modeImagesRef.current.multiview = modeImages.slice(
        0,
        MAX_MULTIVIEW_IMAGES
      );
    },
    []
  );

  const getImagesForMode = useCallback((mode: InputTo3DMode) => {
    if (mode === 'single') {
      return modeImagesRef.current.single.slice(0, 1);
    }

    return modeImagesRef.current.multiview.slice(0, MAX_MULTIVIEW_IMAGES);
  }, []);

  const revokeBlobImageUrls = useCallback((modeImages: ImageItem[]) => {
    const revokedUrls = new Set<string>();

    modeImages.forEach((image) => {
      const imageUrl = image?.url;
      if (!imageUrl || !imageUrl.startsWith('blob:')) return;
      if (revokedUrls.has(imageUrl)) return;

      URL.revokeObjectURL(imageUrl);
      revokedUrls.add(imageUrl);
    });
  }, []);

  const trackSocketAssetId = useCallback(
    (assetId?: string, jobType: VersaJobType = null) => {
      if (!assetId) return;
      pendingSocketAssetIdRef.current = assetId;
      setIsAwaitingVersaSocket(true);
      setActiveVersaJobType(jobType);
    },
    []
  );

  const normalizeAssetResponseToResult = useCallback(
    (asset: any, fallbackAssetId: string): IResult | null => {
      if (!asset || typeof asset !== 'object') return null;

      const assetId = String(asset?._id ?? asset?.id ?? fallbackAssetId);
      const productTitle = String(
        asset?.title ?? asset?.productTitle ?? 'Generated 3D Model'
      );
      const thumbnail = String(
        asset?.thumbnailUrl ??
          asset?.thumbnail ??
          asset?.spriteUrl ??
          asset?.image ??
          ''
      );
      const spriteUrl = String(asset?.spriteUrl ?? '').trim() || undefined;

      const candidateFiles = (
        Array.isArray(asset?.data)
          ? asset.data
          : Array.isArray(asset?.files)
            ? asset.files
            : Array.isArray(asset?.downloads)
              ? asset.downloads
              : []
      ) as Array<Record<string, unknown>>;

      const data = candidateFiles
        .map((file) => {
          const rawName = String(file?.name ?? file?.fileName ?? '').trim();
          const url = String(file?.url ?? file?.signedUrl ?? '').trim();
          if (!url) return null;

          const name =
            rawName ||
            decodeURIComponent(
              url.split('?')[0].split('#')[0].split('/').pop() || ''
            );

          if (!name) return null;
          return { name, url };
        })
        .filter((item): item is { name: string; url: string } => Boolean(item));

      const hasViewerModel = data.some(
        (file) => isModelLikeFile(file.name) || isModelLikeFile(file.url)
      );
      const safeModelUrl =
        typeof asset?.modelUrl === 'string' ? asset.modelUrl.trim() : '';

      if (
        !hasViewerModel &&
        safeModelUrl.length > 0 &&
        isModelLikeFile(safeModelUrl)
      ) {
        const safeNameFromUrl = decodeURIComponent(
          safeModelUrl.split('?')[0].split('#')[0].split('/').pop() || ''
        );
        const safeName =
          safeNameFromUrl ||
          `${productTitle.toLowerCase().trim().replace(/\s+/g, '-') || 'generated-3d-model'}.glb`;
        data.push({
          name: safeName,
          url: safeModelUrl,
        });
      }

      if (data.length === 0) return null;

      return {
        thumbnail,
        assetId,
        productTitle,
        data,
        spriteUrl,
      };
    },
    []
  );

  const generateResultPreviewFromModel = useCallback(
    async (
      result: IResult
    ): Promise<
      (Partial<IResult> & { spriteFile: File; thumbnailFile: File }) | null
    > => {
      const modelEntry = result.data.find(
        (file) => isModelLikeFile(file.name) || isModelLikeFile(file.url)
      );
      if (!modelEntry?.url) return null;

      try {
        const modelResponse = await fetch(modelEntry.url);
        if (!modelResponse.ok) return null;
        const modelBlob = await modelResponse.blob();
        if (modelBlob.size === 0) return null;

        const resolvedName =
          modelEntry.name?.trim() ||
          decodeURIComponent(
            modelEntry.url.split('?')[0].split('#')[0].split('/').pop() ||
              `${result.assetId}.glb`
          );

        const modelFile = new File([modelBlob], resolvedName, {
          type: modelBlob.type || 'model/gltf-binary',
        });
        const { spriteFile, thumbnailFile } = await generateSpriteAndThumbnail(
          modelFile,
          '/assets/hdri/studio.jpg'
        );

        const spriteUrl = URL.createObjectURL(spriteFile);
        const thumbnail = URL.createObjectURL(thumbnailFile);
        registerGeneratedPreviewUrl(spriteUrl);
        registerGeneratedPreviewUrl(thumbnail);

        return {
          spriteFile,
          thumbnailFile,
          spriteUrl,
          thumbnail,
        };
      } catch {
        return null;
      }
    },
    [generateSpriteAndThumbnail, registerGeneratedPreviewUrl]
  );

  const showToast = useCallback((toastProps: NonNullable<ToastCardProps>) => {
    setToastCardProps(toastProps);
    setToastIndex((prev) => prev + 1);
  }, []);

  const showGenerationErrorToast = useCallback(
    (caughtError: unknown, fallback: string) => {
      const description = getErrorMessage(caughtError, fallback);

      setError('');
      showToast({
        type: 'error',
        title:
          description === PLAN_LIMIT_EXCEEDED_MESSAGE
            ? 'Usage Limit Exceeded'
            : 'Generation Failed',
        description,
      });
    },
    [showToast]
  );

  const generateAndAttachMediaForResult = useCallback(
    async (result: IResult) => {
      const generatedPreview = await generateResultPreviewFromModel(result);
      if (!generatedPreview) return;

      setResultFiles((prev) =>
        prev.map((item) =>
          item.assetId === result.assetId
            ? {
                ...item,
                thumbnail:
                  generatedPreview.thumbnail ||
                  item.thumbnail ||
                  DEFAULT_VERSION_THUMBNAIL,
                spriteUrl: generatedPreview.spriteUrl || item.spriteUrl,
              }
            : item
        )
      );

      try {
        const mediaFormData = new FormData();
        mediaFormData.append('spriteFile', generatedPreview.spriteFile);
        mediaFormData.append('thumbnailFile', generatedPreview.thumbnailFile);

        await attachAssetMedia({
          assetId: result.assetId,
          data: mediaFormData,
        });

        const refreshedAssetResponse = await get3DAssetByIdVersa(
          result.assetId
        );
        const normalizedRefreshedResult = normalizeAssetResponseToResult(
          refreshedAssetResponse?.data,
          result.assetId
        );
        if (!normalizedRefreshedResult) return;

        setResultFiles((prev) =>
          prev.map((item) =>
            item.assetId === result.assetId
              ? {
                  ...item,
                  ...normalizedRefreshedResult,
                  data: item.data,
                }
              : item
          )
        );
      } catch (caughtError) {
        showGenerationErrorToast(
          caughtError,
          'Unable to attach generated preview media.'
        );
      }
    },
    [
      attachAssetMedia,
      generateResultPreviewFromModel,
      get3DAssetByIdVersa,
      normalizeAssetResponseToResult,
      showGenerationErrorToast,
    ]
  );

  const applyGeneratedVersionResult = useCallback(
    async (normalizedResult: IResult) => {
      setIsGenerationFlowActive(true);
      setIsAwaitingVersaSocket(true);
      isViewerModelLoadedRef.current = false;
      setIsFinalizingGeneration(true);
      setIsAttachingVersionMedia(true);

      setResultFiles((prev) => {
        const existingIdx = prev.findIndex(
          (item) => item.assetId === normalizedResult.assetId
        );
        if (existingIdx >= 0) {
          const next = [...prev];
          next[existingIdx] = {
            ...next[existingIdx],
            ...normalizedResult,
            versionId:
              next[existingIdx].versionId ||
              `${normalizedResult.assetId}-${Date.now()}`,
          };
          setSelectedResultIdx(existingIdx);
          return next;
        }

        const next = [
          ...prev,
          {
            ...normalizedResult,
            versionId: `${normalizedResult.assetId}-${Date.now()}`,
          },
        ];
        setSelectedResultIdx(next.length - 1);
        return next;
      });

      await generateAndAttachMediaForResult(normalizedResult);
      setIsAttachingVersionMedia(false);
    },
    [generateAndAttachMediaForResult]
  );

  const completeGenerationFlow = useCallback(() => {
    setIsGenerationFlowActive(false);
    setIsFinalizingGeneration(false);
    setIsAwaitingVersaSocket(false);
    setActiveVersaJobType(null);
  }, []);

  const handleModelViewerLoaded = useCallback(() => {
    isViewerModelLoadedRef.current = true;
    if (!isFinalizingGeneration) return;
    if (isAttachingVersionMedia) return;
    completeGenerationFlow();
  }, [completeGenerationFlow, isAttachingVersionMedia, isFinalizingGeneration]);

  useEffect(() => {
    if (!isFinalizingGeneration) return;
    if (isAttachingVersionMedia) return;
    if (!isViewerModelLoadedRef.current) return;
    completeGenerationFlow();
  }, [completeGenerationFlow, isAttachingVersionMedia, isFinalizingGeneration]);

  useEffect(() => {
    if (!isFinalizingGeneration) return;

    const timeout = window.setTimeout(() => {
      setIsGenerationFlowActive(false);
      setIsFinalizingGeneration(false);
      setIsAttachingVersionMedia(false);
      isViewerModelLoadedRef.current = false;
      setIsAwaitingVersaSocket(false);
      setActiveVersaJobType(null);
    }, 30000);

    return () => window.clearTimeout(timeout);
  }, [isFinalizingGeneration]);

  const syncCompletedAssetById = useCallback(
    async (assetId: string) => {
      try {
        const assetResponse = await get3DAssetByIdVersa(assetId);
        const normalizedResult = normalizeAssetResponseToResult(
          assetResponse?.data,
          assetId
        );

        if (!normalizedResult) {
          setIsGenerationFlowActive(false);
          setIsFinalizingGeneration(false);
          setIsAttachingVersionMedia(false);
          isViewerModelLoadedRef.current = false;
          setIsAwaitingVersaSocket(false);
          setActiveVersaJobType(null);
          return;
        }
        await applyGeneratedVersionResult(normalizedResult);
      } catch (fetchError) {
        console.error(fetchError);
        setIsGenerationFlowActive(false);
        setIsFinalizingGeneration(false);
        setIsAttachingVersionMedia(false);
        isViewerModelLoadedRef.current = false;
        setIsAwaitingVersaSocket(false);
        setActiveVersaJobType(null);
        showGenerationErrorToast(
          fetchError,
          'Unable to fetch generated model result.'
        );
      }
    },
    [
      applyGeneratedVersionResult,
      get3DAssetByIdVersa,
      normalizeAssetResponseToResult,
      showGenerationErrorToast,
    ]
  );

  const handleSocketNotification = useCallback(
    (notification: NotificationPayload) => {
      const pendingVersaImageJobId = activeVersaImageJobId;
      if (
        pendingVersaImageJobId &&
        notification.entityType === 'versa_image' &&
        notification.entityId === pendingVersaImageJobId
      ) {
        if (notification.type === VERSA_IMAGE_GENERATION_COMPLETED) {
          void refetchVersaImageResult().then((response) => {
            const payload = response.data;

            if (!payload?.success) {
              setError(
                payload?.error?.message ||
                  'Unable to fetch generated Versa image result.'
              );
              setActiveVersaImageJobId(null);
              return;
            }

            const resultData = payload.data;
            if (!resultData || 'ready' in resultData) {
              setError(
                'Image is still processing. Please wait a moment and try again.'
              );
              setActiveVersaImageJobId(null);
              return;
            }

            const generatedImageDataUrl =
              resultData.images?.[0]?.data_url || resultData.data_url;
            if (!generatedImageDataUrl) {
              setError('Generated image is missing in response.');
              setActiveVersaImageJobId(null);
              return;
            }

            setImages([
              {
                file: null,
                url: generatedImageDataUrl,
                remoteUrl: generatedImageDataUrl,
                name: `versa-generated-${pendingVersaImageJobId}.png`,
              },
            ]);
            setActiveIdx(0);
            setSelectedSuggestionIdx(-1);
            setActiveVersaImageJobId(null);
            setHasGeneratedVersaImage(true);
          });
          return;
        }

        if (notification.type === VERSA_IMAGE_GENERATION_FAILED) {
          void refetchVersaImageResult()
            .then((response) => {
              const payload = response.data;
              const resultData = payload?.data;

              if (payload?.success && resultData && !('ready' in resultData)) {
                const generatedImageDataUrl =
                  resultData.images?.[0]?.data_url || resultData.data_url;

                if (generatedImageDataUrl) {
                  setImages([
                    {
                      file: null,
                      url: generatedImageDataUrl,
                      remoteUrl: generatedImageDataUrl,
                      name: `versa-generated-${pendingVersaImageJobId}.png`,
                    },
                  ]);
                  setActiveIdx(0);
                  setSelectedSuggestionIdx(-1);
                  setActiveVersaImageJobId(null);
                  setHasGeneratedVersaImage(true);
                  return;
                }
              }

              if (payload?.success && resultData && 'ready' in resultData) {
                return;
              }

              setError(
                payload?.error?.message ||
                  notification.message ||
                  'Your Versa product image failed to generate.'
              );
              setActiveVersaImageJobId(null);
            })
            .catch(() => {
              setError(
                notification.message ||
                  'Your Versa product image failed to generate.'
              );
              setActiveVersaImageJobId(null);
            });
          return;
        }
      }

      const pendingAssetId = pendingSocketAssetIdRef.current;
      if (!pendingAssetId) return;
      if (notification.entityType !== 'asset_library') return;
      if (!notification.entityId) return;
      if (notification.entityId !== pendingAssetId) return;

      if (notification.type === VERSA_3D_GENERATION_COMPLETED) {
        pendingSocketAssetIdRef.current = null;
        void syncCompletedAssetById(notification.entityId);
        console.log(notification);
        return;
      }

      if (notification.type === VERSA_3D_GENERATION_FAILED) {
        pendingSocketAssetIdRef.current = null;
        setIsGenerationFlowActive(false);
        setIsAwaitingVersaSocket(false);
        setIsFinalizingGeneration(false);
        setIsAttachingVersionMedia(false);
        isViewerModelLoadedRef.current = false;
        setActiveVersaJobType(null);
        console.error(notification);
        showGenerationErrorToast(
          new Error(notification.message || '3D generation failed.'),
          '3D generation failed.'
        );
      }
    },
    [
      activeVersaImageJobId,
      refetchVersaImageResult,
      setImages,
      showGenerationErrorToast,
      syncCompletedAssetById,
    ]
  );

  const handleSocketError = useCallback(
    (socketError: Error) => {
      setIsGenerationFlowActive(false);
      setIsAwaitingVersaSocket(false);
      setIsFinalizingGeneration(false);
      setIsAttachingVersionMedia(false);
      isViewerModelLoadedRef.current = false;
      setActiveVersaJobType(null);
      if (isVersaImageGenerating) {
        setError(
          'Live status connection failed. Please retry or check generated image status.'
        );
        setActiveVersaImageJobId(null);
      }
      console.error(socketError);
    },
    [isVersaImageGenerating]
  );

  useSocket({
    onNotification: handleSocketNotification,
    onError: handleSocketError,
  });

  const resolveRemoteImageToFile = useCallback(
    async (item: ImageItem): Promise<File | null> => {
      if (item.file && item.file.size > 0) return item.file;
      if (!item.remoteUrl) return null;
      if (item.remoteUrl.startsWith('/')) {
        try {
          const absoluteUrl = `${window.location.origin}${item.remoteUrl}`;
          const localResponse = await fetch(absoluteUrl);
          if (localResponse.ok) {
            const localBlob = await localResponse.blob();
            if (localBlob.size > 0 && localBlob.type.startsWith('image/')) {
              const mimeType = localBlob.type;
              const extension =
                mimeType.split('/')[1]?.replace('svg+xml', 'svg') || 'png';
              const baseName = (item.name || 'preset-image')
                .trim()
                .toLowerCase()
                .replace(/\s+/g, '-');

              return new File([localBlob], `${baseName}.${extension}`, {
                type: mimeType,
              });
            }
          }
        } catch {
          // Fall through to generic URL resolution
        }
      }
      if (DATA_URL_REGEX.test(item.remoteUrl)) {
        try {
          const base64Payload = item.remoteUrl.split(',')[1] ?? '';
          if (!base64Payload) return null;

          const mimeMatch = item.remoteUrl.match(
            /^data:(image\/[a-zA-Z0-9.+-]+);base64,/
          );
          const mimeType = mimeMatch?.[1] || 'image/png';
          const extension =
            mimeType.split('/')[1]?.replace('svg+xml', 'svg') || 'png';
          const decoded = atob(base64Payload);
          const bytes = new Uint8Array(decoded.length);

          for (let i = 0; i < decoded.length; i += 1) {
            bytes[i] = decoded.charCodeAt(i);
          }

          const baseName = (item.name || 'ai-generated-image')
            .trim()
            .toLowerCase()
            .replace(/\s+/g, '-');

          return new File([bytes], `${baseName}.${extension}`, {
            type: mimeType,
          });
        } catch {
          // Fall back to regular URL resolving
        }
      }

      const normalizedUrl =
        getImageUrl(item.remoteUrl, item.remoteUrl) ?? item.remoteUrl;
      const normalizedFallbackUrl = item.fallbackUrl
        ? (getImageUrl(item.fallbackUrl, item.fallbackUrl) ?? item.fallbackUrl)
        : '';
      const encodedUrl = encodeURI(normalizedUrl);
      const encodedFallbackUrl = normalizedFallbackUrl
        ? encodeURI(normalizedFallbackUrl)
        : '';
      const candidateUrls = Array.from(
        new Set([
          normalizedUrl,
          encodedUrl,
          normalizedFallbackUrl,
          encodedFallbackUrl,
        ])
      ).filter(Boolean);
      const token = getUser()?.token;

      const requestVariants: RequestInit[] = [
        {},
        { credentials: 'include' },
        ...(token
          ? [
              { headers: { Authorization: `Bearer ${token}` } },
              {
                credentials: 'include' as RequestCredentials,
                headers: { Authorization: `Bearer ${token}` },
              },
            ]
          : []),
      ];

      let blob: Blob | null = null;
      let resolvedSourceUrl = normalizedUrl;

      for (const url of candidateUrls) {
        for (const requestInit of requestVariants) {
          try {
            const response = await fetch(url, requestInit);
            if (!response.ok) continue;
            blob = await response.blob();
            if (blob && blob.size > 0) {
              resolvedSourceUrl = url;
              break;
            }
          } catch {
            // Try next variant
          }
        }

        if (!blob) {
          try {
            const response = await privateApiClient.get(url, {
              responseType: 'blob',
            });
            if (response.data && response.data.size > 0) {
              blob = response.data;
              resolvedSourceUrl = url;
            }
          } catch {
            // Try public client next
          }
        }

        if (!blob) {
          try {
            const response = await publicApiClient.get(url, {
              responseType: 'blob',
            });
            if (response.data && response.data.size > 0) {
              blob = response.data;
              resolvedSourceUrl = url;
            }
          } catch (err) {
            console.error(err);
          }
        }

        if (blob && blob.size > 0) break;
      }

      if (!blob || blob.size === 0) return null;
      if (blob.type.startsWith('video/')) return null;

      const cleanUrl = resolvedSourceUrl.split('?')[0].split('#')[0];
      const extensionFromUrl =
        cleanUrl.split('.').pop()?.toLowerCase() ?? 'png';
      const inferredMimeType =
        IMAGE_MIME_BY_EXTENSION[extensionFromUrl] || 'image/png';
      const mimeType = blob.type.startsWith('image/')
        ? blob.type
        : inferredMimeType;
      const extension =
        mimeType.split('/')[1]?.replace('svg+xml', 'svg') || 'png';
      const baseName = (item.name || 'product-image')
        .trim()
        .toLowerCase()
        .replace(/\s+/g, '-');

      return new File([blob], `${baseName}.${extension}`, {
        type: mimeType,
      });
    },
    []
  );

  const onGenerate = async (data: FormValues) => {
    setGenerationStartedAt(Date.now());
    setIsGenerationFlowActive(true);
    pendingSocketAssetIdRef.current = null;
    setIsAwaitingVersaSocket(false);
    setIsFinalizingGeneration(false);
    setIsAttachingVersionMedia(false);
    isViewerModelLoadedRef.current = false;
    setActiveVersaJobType(null);

    const formData = new FormData();

    const unresolvedImages: string[] = [];
    const selectedImages = isSingleMode
      ? (data.images ?? []).slice(0, 1)
      : (data.images ?? []);

    for (const image of selectedImages) {
      const resolvedFile = await resolveRemoteImageToFile(image);

      if (resolvedFile) {
        formData.append('images', resolvedFile);
        continue;
      }

      unresolvedImages.push(image.name || image.remoteUrl || 'image');
    }

    const imageEntries = formData.getAll('images');
    if (imageEntries.length === 0) {
      setIsGenerationFlowActive(false);
      setError(
        isSingleMode
          ? 'Please upload an image to generate a 3D model.'
          : 'Please upload at least one image to generate a 3D model.'
      );
      return;
    }

    if (imageEntries.some((entry) => !(entry instanceof File))) {
      setIsGenerationFlowActive(false);
      setError('Invalid image payload. Please re-upload images and try again.');
      return;
    }

    if (unresolvedImages.length > 0) {
      setIsGenerationFlowActive(false);
      setError(
        `Unable to process image(s): ${unresolvedImages.join(', ')}. Please re-upload and try again.`
      );
      return;
    }

    const totalImageInputs = imageEntries.length;
    if (!isSingleMode && totalImageInputs < 2) {
      setIsGenerationFlowActive(false);
      setError('Please provide at least 2 images for multiview generation.');
      return;
    }

    formData.append('mode', String(data.modelType));
    formData.append('remesh', String(data.meshOptimization));
    formData.append('texture_size', String(data.textureSize));
    formData.append('decimation_target', String(data.triTargets));
    const generationSessionId = ensureModelGenerationSessionId();
    formData.append('sessionId', generationSessionId);
    try {
      const nextJobType: VersaJobType =
        resultFiles.length > 0 ? 'regenerate' : 'generate';
      setActiveVersaJobType(nextJobType);

      await generateQuery.mutateAsync(formData, {
        onSuccess: async (response) => {
          const responseAssetId = response?.data?.assetId;
          const normalizedImmediateResult = normalizeAssetResponseToResult(
            response?.data,
            responseAssetId || ''
          );

          if (normalizedImmediateResult) {
            await applyGeneratedVersionResult(normalizedImmediateResult);
            pendingSocketAssetIdRef.current = null;
            return;
          }

          trackSocketAssetId(responseAssetId, nextJobType);
        },
      });
    } catch (caughtError) {
      setIsGenerationFlowActive(false);
      setIsFinalizingGeneration(false);
      setIsAttachingVersionMedia(false);
      isViewerModelLoadedRef.current = false;
      setIsAwaitingVersaSocket(false);
      setActiveVersaJobType(null);
      showGenerationErrorToast(
        caughtError,
        'Unable to process the image. Please try again.'
      );
    }
  };

  const validate = (files: FileList) => {
    const errs = [];
    const valid = [];
    for (const f of files) {
      if (!ACCEPTED.includes(f.type)) {
        errs.push(`${f.name}: unsupported format`);
      } else if (f.size > MAX_SIZE) {
        errs.push(`${f.name}: exceeds 5MB`);
      } else {
        valid.push(f);
      }
    }
    if (errs.length) setError(errs.join(', '));
    else setError('');
    return valid;
  };

  const addImages = useCallback(
    (files: FileList) => {
      const valid = validate(files);
      if (!valid.length) return;

      if (isSingleMode) {
        const [file] = valid;
        if (!file) return;

        if (valid.length > 1) {
          setError('Single mode allows 1 image. Extra files ignored.');
        }

        const newImage = {
          file,
          url: URL.createObjectURL(file),
          name: file.name,
        };

        setImages((prev) => {
          prev.forEach((image) => {
            if (image.url.startsWith('blob:')) {
              URL.revokeObjectURL(image.url);
            }
          });

          return [newImage];
        });
        setActiveIdx(0);
        return;
      }

      const remaining = maxImages - images.length;
      if (remaining <= 0) {
        setError(`Max ${maxImages} image(s) allowed.`);
        return;
      }

      const toAdd = valid.slice(0, remaining);
      if (valid.length > remaining) {
        setError(`Max ${maxImages} image(s) allowed. Extra files ignored.`);
      }

      const newImgs = toAdd.map((f) => ({
        file: f,
        url: URL.createObjectURL(f),
        name: f.name,
      }));
      setImages((prev) => {
        const updated = [...prev, ...newImgs];
        if (prev.length === 0 && newImgs.length > 0) setActiveIdx(0);
        return updated;
      });
    },
    [images.length, isSingleMode, maxImages]
  );

  const removeImage = (idx: number) => {
    setImages((prev) => {
      const imageToRemove = prev[idx];
      if (imageToRemove?.url?.startsWith('blob:')) {
        URL.revokeObjectURL(imageToRemove.url);
      }

      const updated = prev.filter((_, i) => i !== idx);
      setActiveIdx((currentIdx) => {
        if (!updated.length) return 0;
        if (currentIdx > idx) return currentIdx - 1;
        if (currentIdx >= updated.length) return updated.length - 1;
        return currentIdx;
      });

      return updated;
    });
    setError('');
  };

  const onDrop = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
      const files = e.dataTransfer.files;
      addImages(files);
    },
    [addImages]
  );

  const onDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const onDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const onBrowse = () => fileInputRef.current?.click();

  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;
    addImages(files);
    e.target.value = '';
  };

  const onThumbAdd = (idx: number) => {
    if (images[idx]) {
      setActiveIdx(idx);
    } else {
      thumbInputRefs.current[idx]?.click();
    }
  };

  const onThumbFile = (e: ChangeEvent<HTMLInputElement>, slotIdx: number) => {
    const files = e.target.files;
    if (!files?.length) return;
    const valid = validate(files);
    if (!valid.length) return;
    const f = valid[0];
    const newImg = { file: f, url: URL.createObjectURL(f), name: f.name };
    setImages((prev) => {
      if (slotIdx < prev.length) {
        const previousImage = prev[slotIdx];
        if (previousImage?.url?.startsWith('blob:')) {
          URL.revokeObjectURL(previousImage.url);
        }
        const updated = [...prev];
        updated[slotIdx] = newImg;
        return updated;
      }
      return [...prev, newImg];
    });
    setActiveIdx(slotIdx < images.length ? slotIdx : images.length);
    e.target.value = '';
  };

  const onThumbDrop = useCallback(
    (idx: number, files: FileList) => {
      const valid = validate(files);
      if (!valid.length) return;
      const f = valid[0];
      const newImg = {
        file: f,
        url: URL.createObjectURL(f),
        name: f.name,
      };

      setImages((prev) => {
        if (idx < prev.length) {
          const previousImage = prev[idx];
          if (previousImage?.url?.startsWith('blob:')) {
            URL.revokeObjectURL(previousImage.url);
          }
          const updated = [...prev];
          updated[idx] = newImg;
          return updated;
        }

        const updated: (ImageItem | null)[] = [...prev];
        while (updated.length < idx) {
          updated.push(null);
        }
        updated[idx] = newImg;
        return updated.filter(Boolean) as ImageItem[];
      });

      setActiveIdx(idx < images.length ? idx : Math.min(idx, images.length));
    },
    [images.length, setImages]
  );

  const handleInputModeChange = useCallback(
    (nextMode: InputTo3DMode) => {
      const isCurrentlyGenerating =
        isGenerationFlowActive ||
        generateQuery.isPending ||
        isAwaitingVersaSocket ||
        isFinalizingGeneration ||
        isAttachingVersionMedia;

      if (isCurrentlyGenerating) return;
      if (nextMode === inputTo3DMode) return;

      persistImagesForMode(inputTo3DMode, getValues('images') ?? []);
      setInputTo3DMode(nextMode);
    },
    [
      generateQuery.isPending,
      getValues,
      inputTo3DMode,
      isAttachingVersionMedia,
      isAwaitingVersaSocket,
      isFinalizingGeneration,
      isGenerationFlowActive,
      persistImagesForMode,
    ]
  );

  const handlePromptChange = useCallback((nextPrompt: string) => {
    void nextPrompt;
    setSelectedSuggestionIdx(-1);
  }, []);

  const handlePromptSuggestionSelect = useCallback(
    (idx: number, prompt: string) => {
      setSelectedSuggestionIdx(idx);
      setValue('promptText', prompt, { shouldDirty: true });

      if (!isSingleMode) {
        const presetImages = MULTIVIEW_PROMPT_SUGGESTIONS[idx]?.images ?? [];
        setImages(
          presetImages.map((imageUrl, imageIdx) => ({
            file: null,
            url: imageUrl,
            remoteUrl: imageUrl,
            name: `preset-${idx + 1}-${imageIdx + 1}`,
          }))
        );
        setError('');
      }
    },
    [isSingleMode, setImages, setValue]
  );

  const handleModelTypeChange = useCallback(
    (modelTypeId: TabData['id']) => {
      setValue('modelType', modelTypeId, { shouldDirty: true });
      setValue('textureSize', DEFAULT_VALUES.textureSize, {
        shouldDirty: true,
      });
      setValue('triTargets', DEFAULT_VALUES.triTargets, {
        shouldDirty: true,
      });
    },
    [setValue]
  );

  const reset = () => {
    revokeBlobImageUrls([
      ...images,
      ...modeImagesRef.current.single,
      ...modeImagesRef.current.multiview,
    ]);
    modeImagesRef.current.single = [];
    modeImagesRef.current.multiview = [];
    revokeGeneratedPreviewUrls();
    resetForm();
    setActiveIdx(0);
    setSelectedSuggestionIdx(-1);
    setError('');
    setActiveVersaImageJobId(null);
    setHasGeneratedVersaImage(false);
    modelGenerationSessionIdRef.current = null;
    queueVersaImageQuery.reset();
    generateQuery.reset();
    setResultFiles([]);
    setIsGenerationFlowActive(false);
    setIsFinalizingGeneration(false);
    setIsAttachingVersionMedia(false);
    isViewerModelLoadedRef.current = false;
    setCopied(false);
    setExportFormat('glb');
    setIsAwaitingVersaSocket(false);
    setActiveVersaJobType(null);
    setToastCardProps(undefined);
  };

  const handleDownload = (fileType: string) => {
    const file = resultFiles[selectedResultIdx]?.data?.find((file) =>
      file.name.endsWith(fileType)
    );
    if (file) {
      setToastCardProps(undefined);
      const link = document.createElement('a');
      link.href = file.url;
      link.download = file.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      showToast({
        type: 'error',
        title: 'Wrong File Format',
        description: 'We support only GLB format currently',
        buttonProps: {
          content: 'Try Again',
          onClick: () => handleDownload(exportFormat),
        },
      });
    }
  };

  const copyUrl = resultFiles[selectedResultIdx]?.data?.find((f) =>
    f.name.endsWith(exportFormat)
  )?.url;
  const glbUrl = resultFiles[selectedResultIdx]?.data?.find(
    (file) =>
      /\.(glb|gltf)(?:$|[?#])/i.test(file.name) ||
      /\.(glb|gltf)(?:$|[?#])/i.test(file.url)
  )?.url;

  const handleCopy = () => {
    navigator.clipboard.writeText(copyUrl ?? '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleQueueVersaImageGeneration = async () => {
    if (!isSingleMode) return;

    const trimmedPrompt = promptText.trim();
    if (!trimmedPrompt || trimmedPrompt.length > 200) {
      setError('Prompt must be between 1 and 200 characters.');
      return;
    }

    setError('');

    try {
      const response = await queueVersaImageQuery.mutateAsync({
        prompt: trimmedPrompt,
      });
      const queuedJobId = response?.data?.jobId;
      if (!queuedJobId) {
        setError('Unable to queue image generation job.');
        setActiveVersaImageJobId(null);
        return;
      }

      setActiveVersaImageJobId(queuedJobId);
    } catch {
      setError('Unable to queue image generation. Please try again.');
      setActiveVersaImageJobId(null);
    }
  };

  useEffect(() => {
    return () => {
      generateQuery.reset();
      revokeGeneratedPreviewUrls();
      revokeBlobImageUrls([
        ...images,
        ...modeImagesRef.current.single,
        ...modeImagesRef.current.multiview,
      ]);
      modeImagesRef.current.single = [];
      modeImagesRef.current.multiview = [];
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (images.length > 0) return;

    const state = (location.state ?? null) as VersaAiLocationState | null;
    const prefillImageUrl = state?.prefillImageUrl;
    const prefillImageFallbackUrl = state?.prefillImageFallbackUrl;

    if (!prefillImageUrl) return;

    setImages([
      {
        file: null,
        url: prefillImageUrl,
        name: state?.prefillImageName || 'selected-image',
        remoteUrl: prefillImageUrl,
        fallbackUrl: prefillImageFallbackUrl,
      },
    ]);
    setActiveIdx(0);
    setError('');

    return () => {
      revokeGeneratedPreviewUrls();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [images.length, location.state]);

  useEffect(() => {
    setSelectedSuggestionIdx(-1);
    setError('');
    const currentPrompt = (getValues('promptText') ?? '').trim();
    const isMultiviewPresetPrompt = MULTIVIEW_PROMPT_SUGGESTIONS.some(
      (item) => item.prompt === currentPrompt
    );

    if (inputTo3DMode === 'single' && isMultiviewPresetPrompt) {
      setValue('promptText', '', { shouldDirty: true });
    }

    const nextModeImages = getImagesForMode(inputTo3DMode);
    setValue('images', nextModeImages, { shouldDirty: true });
    setActiveIdx(0);
  }, [getImagesForMode, getValues, inputTo3DMode, setValue]);

  useEffect(() => {
    if (isSingleMode) return;
    if (selectedSuggestionIdx < 0) return;

    const selectedPresetImages =
      MULTIVIEW_PROMPT_SUGGESTIONS[selectedSuggestionIdx]?.images ?? [];
    if (!selectedPresetImages.length) return;

    const currentImageUrls = new Set(
      (images ?? []).flatMap((image) => [image.url, image.remoteUrl ?? ''])
    );
    const hasAnySelectedPresetImage = selectedPresetImages.some((url) =>
      currentImageUrls.has(url)
    );

    if (!hasAnySelectedPresetImage) {
      setSelectedSuggestionIdx(-1);
    }
  }, [images, isSingleMode, selectedSuggestionIdx]);

  useOutsideClick({
    ref: outsideClickRef,
    handler: () => setShowExportOptions(false),
    enabled: showExportOptions,
  });

  useEffect(() => {
    if (
      formattedOptions.length > 0 &&
      typeof formattedOptions[0] === 'string'
    ) {
      setExportFormat(formattedOptions[0]);
    }
  }, [formattedOptions]);

  const hasImages = images.length > 0;
  const isMutationPending = generateQuery.isPending;
  const isGenerating =
    isGenerationFlowActive ||
    isMutationPending ||
    isAwaitingVersaSocket ||
    isFinalizingGeneration ||
    isAttachingVersionMedia;
  const isRegenerating = isGenerating && activeVersaJobType === 'regenerate';
  const isInitialGenerating = isGenerating && !isRegenerating;
  const hasGeneratedResult = generateQuery.isSuccess;
  const isPromptInputDisabled = isSingleMode
    ? hasImages || isVersaImageGenerating || isGenerating
    : isGenerating;

  useEffect(() => {
    if (!isGenerating && generationStartedAt !== null) {
      setGenerationStartedAt(null);
    }
  }, [generationStartedAt, isGenerating]);

  useEffect(() => {
    if (!isGenerating) return;
    if (!showExportOptions) return;
    setShowExportOptions(false);
  }, [isGenerating, showExportOptions]);

  const inputTo3DTabs: TabData[] = useMemo(
    () => [
      {
        id: 'single',
        title: 'Single',
        disabled: isGenerating && inputTo3DMode !== 'single',
      },
      {
        id: 'multiview',
        title: 'Multi-View',
        disabled: isGenerating && inputTo3DMode !== 'multiview',
      },
    ],
    [inputTo3DMode, isGenerating]
  );

  return (
    <div className="flex h-screen overflow-hidden">
      <VersaSidebar
        onNavigateDashboard={() => navigate('/dashboard')}
        onReset={reset}
        inputTo3DTabs={inputTo3DTabs}
        inputTo3DMode={inputTo3DMode}
        onInputModeChange={handleInputModeChange}
        isDragging={isDragging}
        hasImages={hasImages}
        images={images}
        activeIdx={activeIdx}
        isSingleMode={isSingleMode}
        maxImages={maxImages}
        acceptedTypes={ACCEPTED}
        fileInputRef={fileInputRef}
        thumbInputRefs={thumbInputRefs}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onBrowse={onBrowse}
        onFileChange={onFileChange}
        onRemoveImage={removeImage}
        onThumbAdd={onThumbAdd}
        onThumbDrop={onThumbDrop}
        onThumbFile={onThumbFile}
        control={control}
        promptLength={promptLength}
        selectedSuggestionIdx={selectedSuggestionIdx}
        activePromptSuggestions={activePromptSuggestions}
        multiviewSuggestionImages={MULTIVIEW_PROMPT_SUGGESTIONS.map(
          (item) => item.images
        )}
        onPromptChange={handlePromptChange}
        onSelectSuggestion={handlePromptSuggestionSelect}
        isPromptInputDisabled={isPromptInputDisabled}
        isVersaImageGenerating={isVersaImageGenerating}
        hasGeneratedVersaImage={hasGeneratedVersaImage}
        isGenerateImageButtonDisabled={isGenerateImageButtonDisabled}
        isGenerating={isGenerating}
        onGenerateImage={handleQueueVersaImageGeneration}
        modelType={modelType}
        meshOptimization={meshOptimization}
        onModelTypeChange={handleModelTypeChange}
        hasGeneratedResult={hasGeneratedResult}
        isInitialGenerating={isInitialGenerating}
        isRegenerating={isRegenerating}
        onGenerateModel={handleSubmit(onGenerate)}
      />
      <VersaCanvas
        resultFiles={resultFiles}
        glbUrl={glbUrl}
        isGenerating={isGenerating}
        isRegenerating={isRegenerating}
        generationStartedAt={generationStartedAt}
        selectedResultIdx={selectedResultIdx}
        onResultSelect={(idx) => {
          setSelectedResultIdx(idx);
          isViewerModelLoadedRef.current = false;
        }}
        onModelLoaded={handleModelViewerLoaded}
        onClose={() => navigate('/dashboard')}
        showExportOptions={showExportOptions}
        onToggleExportOptions={() => setShowExportOptions((prev) => !prev)}
        exportOptionsContent={
          <VersaExportOptionsCard
            outsideClickRef={outsideClickRef}
            exportFormat={exportFormat}
            formattedOptions={formattedOptions}
            onExportFormatChange={setExportFormat}
            onDownload={() => exportFormat && handleDownload(exportFormat)}
            copyUrl={copyUrl}
            copied={copied}
            onCopy={handleCopy}
          />
        }
      />
      {toastCardProps && (
        <ToastCard
          key={toastIndex}
          className="fixed right-8 bottom-8 w-133"
          {...toastCardProps}
        />
      )}
      {error && !isAwaitingVersaSocket && (
        <ToastCard
          key={error}
          className="fixed right-8 bottom-8 w-133"
          type="error"
          title="Something went wrong"
          description={error}
        />
      )}
    </div>
  );
}
