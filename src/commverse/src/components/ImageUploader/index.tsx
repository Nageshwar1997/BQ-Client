import { Icon } from '@iconify/react';
import {
  useState,
  useRef,
  useCallback,
  useEffect,
  type DragEvent,
  type ChangeEvent,
  type Dispatch,
  type SetStateAction,
} from 'react';
import Button from '../../components/Button';
import { AddIcon } from '../../icons';
import { Tab } from '../Tab';
import ModelUploadZone from '../../components/ModelUploadZone';
import type { VisualizerProps } from '../../types';
import {
  defaultSettings,
  IMAGE_FILE_TYPES,
  MODEL_MAX_SIZE,
} from '../../constants';
import Canvas3D from '../../3d/Components/Canvas3D';
import { type ValidationError } from '../../lib/store/modelStore';
import ToastCard from '../AlertCards/ToastCard';
import { validateModel } from '../../3d/Utils';
import { formatMB, getFileExtension } from '../../lib/utils';
import { useSpriteWorker } from '../../webWorker/useSpriteWorker';

type AssetMode = 'images' | 'video' | 'model';

interface ModeConfig {
  maxFiles: number;
  maxSize: number;
  accepted: string[];
  extensions: string[];
  acceptAttr: string;
  dropLabel: string;
  sizeLabel: string;
  overAllSizeLabel: number;
}

const MODE_CONFIG: Record<AssetMode, ModeConfig> = {
  images: {
    maxFiles: 10,
    maxSize: 5 * 1024 * 1024,
    accepted: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
    extensions: IMAGE_FILE_TYPES,
    acceptAttr: IMAGE_FILE_TYPES.join(','),
    dropLabel: 'Drop your product photos here',
    sizeLabel: 'JPG/PNG/WebP up to',
    overAllSizeLabel: 50 * 1024 * 1024,
  },
  video: {
    maxFiles: 5,
    maxSize: 20 * 1024 * 1024,
    accepted: ['video/mp4', 'video/webm', 'video/quicktime'],
    extensions: ['.mp4', '.webm', '.mov'],
    acceptAttr: '.mp4,.webm,.mov',
    dropLabel: 'Drop your product videos here',
    sizeLabel: 'MP4/WebM/MOV up to',
    overAllSizeLabel: 100 * 1024 * 1024,
  },
  model: {
    maxFiles: 10,
    maxSize: MODEL_MAX_SIZE,
    accepted: [],
    extensions: ['.glb', '.gltf'],
    acceptAttr: '.glb,.gltf',
    dropLabel: 'Drop your 3D models here',
    sizeLabel: 'GLB/GLTF up to',
    overAllSizeLabel: 250 * 1024 * 1024,
  },
};

const TABS = [
  { id: 'images', title: 'Images', value: 'images', count: 5 },
  { id: 'video', title: 'Video', value: 'video', count: 5 },
  { id: 'model', title: 'Model', value: 'model', count: 5 },
] as const;

export interface AssetItem {
  file: File;
  url: string;
  name: string;
  type: 'image' | 'video' | 'model';
  sizeBytes?: number;
  key?: string;
  assetId?: string;
  thumbnailUrl?: string;
  spriteFile?: File;
  thumbnailFile?: File;
}

export interface Media {
  images: AssetItem[];
  videos: AssetItem[];
  models: AssetItem[];
}

export type AllAssets = Media;

interface AssetUploaderProps {
  media: Media;
  onMediaChange: (media: Media) => void;
  onError?: (error: ValidationError) => void;
  onModeChange?: (mode: AssetMode) => void;
  modelSettings?: VisualizerProps;
  onModelSettingChange?: Dispatch<SetStateAction<VisualizerProps>>;
  error?: string;
}

type TValidationReport = {
  isValid: boolean;
  message: { title: string; description: string };
};

const handleModelValidation = async (
  file: File,
  currentTotalSize: number,
  overAllSizeLimit: number,
  perFileMaxSize: number
): Promise<TValidationReport> => {
  let report: TValidationReport = {
    isValid: false,
    message: { title: '', description: '' },
  };

  const ext = getFileExtension(file);
  const validExtensions = MODE_CONFIG.model.extensions;
  if (!validExtensions.includes(ext)) {
    report.message = {
      title: 'Unsupported Format',
      description: `${file.name}: only ${validExtensions.join(', ').toUpperCase()} files are supported.`,
    };
    return report;
  }

  if (file.size > perFileMaxSize) {
    report.message = {
      title: 'File size Exceeds Limit',
      description: `${file.name}: exceeds ${formatMB(perFileMaxSize)}MB limit.`,
    };
    return report;
  }

  const fileUrl = URL.createObjectURL(file);

  try {
    const validationReport = await validateModel(fileUrl);

    const reportedModelSize =
      typeof validationReport?.modelSize === 'number' &&
      validationReport.modelSize > 0
        ? validationReport.modelSize
        : file.size;

    if (reportedModelSize > MODEL_MAX_SIZE) {
      report.message = {
        title: 'File size Exceeds Limit',
        description: `Please upload a model smaller than ${Math.round(MODEL_MAX_SIZE / (1024 * 1024))}MB.`,
      };
      return report;
    }

    if (
      validationReport?.extensionsRequired?.includes(
        'KHR_materials_pbrSpecularGlossiness'
      )
    ) {
      report.message = {
        title: 'Model Validation Failed',
        description:
          'Model uses unsupported KHR_materials_pbrSpecularGlossiness extension',
      };
      return report;
    }
  } catch (e) {
    console.error('validateModel error:', e);
    report.message = {
      title: 'Validation Error',
      description: 'Unable to validate model. Please try again.',
    };
    return report;
  } finally {
    URL.revokeObjectURL(fileUrl);
  }

  if (currentTotalSize + file.size > overAllSizeLimit) {
    report.message = {
      title: 'Total Size Limit Exceeded',
      description: `${file.name}: adding this model would exceed the total limit of ${formatMB(overAllSizeLimit)}MB.`,
    };
    return report;
  }

  report.isValid = true;
  return report;
};

export function AssetUploader({
  media,
  onMediaChange,
  onError,
  onModeChange,
  modelSettings,
  onModelSettingChange,
  error,
}: AssetUploaderProps) {
  const formatSizeLabel = (bytes: number): string => {
    if (!Number.isFinite(bytes) || bytes <= 0) return '0 B';
    if (bytes < 1024) return `${Math.round(bytes)} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    if (bytes < 1024 * 1024 * 1024)
      return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
  };

  const getAssetSize = (asset: AssetItem): number =>
    typeof asset.sizeBytes === 'number' && Number.isFinite(asset.sizeBytes)
      ? asset.sizeBytes
      : asset.file.size;

  const modeToMediaKey = (currentMode: AssetMode): keyof Media =>
    currentMode === 'video'
      ? 'videos'
      : currentMode === 'model'
        ? 'models'
        : 'images';

  const [mode, setMode] = useState<AssetMode>('images');
  const [activeIdx, setActiveIdx] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [assetError, setAssetError] = useState<ValidationError | null>(null);
  const [resetCounter, setResetCounter] = useState(0);
  const { generate } = useSpriteWorker();

  const activeIdxCacheRef = useRef<Record<AssetMode, number>>({
    images: 0,
    video: 0,
    model: 0,
  });
  const mediaRef = useRef<Media>(media);

  const assets = media[modeToMediaKey(mode)];
  const totalSize = assets.reduce((sum, a) => sum + getAssetSize(a), 0);
  const cfg = MODE_CONFIG[mode];
  const remainingTotalSize = Math.max(0, cfg.overAllSizeLabel - totalSize);
  const hasAssets = assets.length > 0;

  const handleChange = useCallback(
    (updatedAssets: AssetItem[]) => {
      onMediaChange({
        ...media,
        [modeToMediaKey(mode)]: updatedAssets,
      });
    },
    [onMediaChange, media, mode]
  );

  useEffect(() => {
    mediaRef.current = media;
  }, [media]);

  useEffect(() => {
    activeIdxCacheRef.current[mode] = activeIdx;
  }, [activeIdx, mode]);

  const handleModeChange = (newMode: AssetMode) => {
    if (newMode === mode) return;

    activeIdxCacheRef.current[mode] = activeIdx;
    const cachedIdx = activeIdxCacheRef.current[newMode];

    setMode(newMode);
    setAssetError(null);
    setActiveIdx(cachedIdx);
    onModeChange?.(newMode);
  };

  const tabs = TABS.map((t) => ({
    ...t,
    count: media[modeToMediaKey(t.value)].length,
  }));

  // ── Cleanup blob URLs on unmount ───────────────────────────────────────────

  useEffect(() => {
    return () => {
      const currentMedia = mediaRef.current;
      for (const key of Object.keys(currentMedia) as (keyof Media)[]) {
        currentMedia[key].forEach((a) => {
          URL.revokeObjectURL(a.url);
          if (a.thumbnailUrl) URL.revokeObjectURL(a.thumbnailUrl);
        });
      }
    };
  }, []);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const modelInputRef = useRef<HTMLInputElement | null>(null);
  const thumbInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const modelUrl =
    mode === 'model' && assets[activeIdx]?.url ? assets[activeIdx].url : null;

  const reportError = (title: string, description: string) => {
    setAssetError(null);
    setTimeout(() => {
      setAssetError({ title, description });
      setResetCounter((c) => c + 1);
      onError?.({ title, description });
    }, 0);
  };

  const getExt = (f: File) => {
    const parts = f.name.split('.');
    return parts.length > 1 ? `.${parts.pop()!.toLowerCase()}` : '';
  };

  const validate = (
    files: FileList | File[],
    overrideMode?: AssetMode
  ): File[] => {
    const activeMode = overrideMode ?? mode;
    const activeCfg = MODE_CONFIG[activeMode];
    const useExtension = activeMode === 'model';
    const errs: string[] = [];
    const valid: File[] = [];

    for (const f of files) {
      const formatOk = useExtension
        ? activeCfg.extensions.includes(getExt(f))
        : activeCfg.accepted.includes(f.type);

      if (!formatOk) errs.push(`${f.name}: unsupported format`);
      else if (f.size > activeCfg.maxSize)
        errs.push(`${f.name}: exceeds ${formatMB(activeCfg.maxSize)}MB`);
      else valid.push(f);
    }

    if (activeMode !== 'model' && errs.length)
      reportError('Upload Error', errs.join(', '));
    else if (errs.length === 0) setAssetError(null);

    return valid;
  };

  const validateTotalSize = (
    files: File[],
    currentTotal: number,
    m: AssetMode
  ): { valid: File[]; rejected: string[] } => {
    if (m === 'model') return { valid: files, rejected: [] };

    const modeCfg = MODE_CONFIG[m];
    const valid: File[] = [];
    const rejected: string[] = [];
    let projected = currentTotal;

    for (const f of files) {
      if (projected + f.size <= modeCfg.overAllSizeLabel) {
        valid.push(f);
        projected += f.size;
      } else {
        rejected.push(
          `${f.name}: would exceed total limit of ${formatMB(modeCfg.overAllSizeLabel)}MB`
        );
      }
    }

    return { valid, rejected };
  };

  const toAssetItem = (f: File, assetMode = mode): AssetItem => ({
    file: f,
    url: URL.createObjectURL(f),
    name: f.name,
    sizeBytes: f.size,
    type:
      assetMode === 'images'
        ? 'image'
        : assetMode === 'video'
          ? 'video'
          : 'model',
  });

  const createModelAssetItem = useCallback(
    async (file: File): Promise<AssetItem> => {
      const modelUrl = URL.createObjectURL(file);
      try {
        const { spriteFile, thumbnailFile } = await generate(
          file,
          '/assets/hdri/studio.jpg'
        );
        return {
          file,
          url: modelUrl,
          name: file.name,
          sizeBytes: file.size,
          type: 'model',
          thumbnailUrl: URL.createObjectURL(thumbnailFile),
          spriteFile,
          thumbnailFile,
        };
      } catch (error) {
        URL.revokeObjectURL(modelUrl);
        throw error;
      }
    },
    [generate]
  );

  const replaceAssetItem = (idx: number, item: AssetItem) => {
    const updated = [...assets];
    if (idx < updated.length) {
      URL.revokeObjectURL(updated[idx].url);
      if (updated[idx].thumbnailUrl)
        URL.revokeObjectURL(updated[idx].thumbnailUrl);
      updated[idx] = item;
    } else {
      updated.push(item);
    }
    handleChange(updated);
    setActiveIdx(idx < assets.length ? idx : assets.length);
  };

  const addAssets = useCallback(
    (files: FileList | File[]) => {
      const validFormat = validate(files);
      if (!validFormat.length) return;

      const { valid: validSize, rejected } = validateTotalSize(
        validFormat,
        totalSize,
        mode
      );
      if (rejected.length)
        reportError('Size Limit Exceeded', rejected.join(', '));
      if (!validSize.length) return;

      const remainingSlots = cfg.maxFiles - assets.length;
      const toAdd = validSize.slice(0, remainingSlots);

      if (validSize.length > remainingSlots) {
        reportError(
          'Too many files',
          `Max ${cfg.maxFiles} file(s) allowed. Extra files ignored.`
        );
      }

      const newItems = toAdd.map((f) => toAssetItem(f));
      if (assets.length === 0 && newItems.length > 0) setActiveIdx(0);
      handleChange([...assets, ...newItems]);
    },
    [assets, cfg, mode, totalSize, handleChange]
  );

  const removeAsset = (idx: number) => {
    URL.revokeObjectURL(assets[idx].url);
    if (assets[idx].thumbnailUrl) URL.revokeObjectURL(assets[idx].thumbnailUrl);
    const updated = assets.filter((_, i) => i !== idx);
    if (activeIdx >= updated.length)
      setActiveIdx(Math.max(0, updated.length - 1));
    handleChange(updated);
    setAssetError(null);
  };

  const replaceAsset = (idx: number, file: File) => {
    const [validated] = validate([file]);
    if (!validated) return;

    const oldSize = assets[idx] ? getAssetSize(assets[idx]) : 0;
    const newSizeDiff = file.size - oldSize;
    if (totalSize + newSizeDiff > cfg.overAllSizeLabel) {
      reportError(
        'Size Limit Exceeded',
        `${file.name}: would exceed total limit of ${formatMB(cfg.overAllSizeLabel)}MB`
      );
      return;
    }

    const newItem = toAssetItem(file);
    const updated = [...assets];
    if (idx < updated.length) {
      URL.revokeObjectURL(updated[idx].url);
      if (updated[idx].thumbnailUrl)
        URL.revokeObjectURL(updated[idx].thumbnailUrl);
      updated[idx] = newItem;
    } else {
      updated.push(newItem);
    }
    handleChange(updated);
    setActiveIdx(idx < assets.length ? idx : assets.length);
  };

  const resetInputs = () => setResetCounter((c) => c + 1);

  const addModelFiles = useCallback(
    async (files: FileList | File[]) => {
      setAssetError(null);
      const fileArray = Array.from(files);
      if (!fileArray.length) return;

      const remainingSlots = MODE_CONFIG.model.maxFiles - assets.length;
      if (remainingSlots <= 0) {
        reportError(
          'Too many files',
          `Max ${MODE_CONFIG.model.maxFiles} model(s) allowed.`
        );
        return;
      }

      const toAdd = fileArray.slice(0, remainingSlots);
      if (fileArray.length > remainingSlots) {
        reportError(
          'Too many files',
          `Max ${MODE_CONFIG.model.maxFiles} model(s) allowed. Extra files ignored.`
        );
      }
      if (!toAdd.length) return;

      const firstFile = toAdd[0];
      const validationReport = await handleModelValidation(
        firstFile,
        totalSize,
        MODE_CONFIG.model.overAllSizeLabel,
        MODE_CONFIG.model.maxSize
      );

      if (!validationReport.isValid) {
        reportError(
          validationReport.message.title,
          validationReport.message.description
        );
        return;
      }

      const newItems: AssetItem[] = [];
      try {
        for (const file of toAdd) {
          newItems.push(await createModelAssetItem(file));
        }
      } catch {
        reportError(
          'Model Processing Failed',
          'Unable to generate sprite/thumbnail for the selected model.'
        );
        return;
      }
      const updated = [...assets, ...newItems];

      if (assets.length === 0) setActiveIdx(0);
      handleChange(updated);
      onModelSettingChange?.((prev) => ({ ...prev, modelFile: firstFile }));
    },
    [
      assets,
      totalSize,
      handleChange,
      onModelSettingChange,
      createModelAssetItem,
    ]
  );

  const handleModelUpload = (file: File) => addModelFiles([file]);

  const onModelFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    setAssetError(null);
    if (e.target.files?.length) addModelFiles(e.target.files);
    e.target.value = '';
    resetInputs();
  };

  const onDrop = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
      if (mode === 'model') addModelFiles(e.dataTransfer.files);
      else addAssets(e.dataTransfer.files);
    },
    [addAssets, addModelFiles, mode]
  );

  const onDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const onBrowse = () => {
    if (fileInputRef.current) fileInputRef.current.value = '';
    fileInputRef.current?.click();
  };

  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    setAssetError(null);
    if (!e.target.files?.length) return;
    addAssets(e.target.files);
    e.target.value = '';
    resetInputs();
  };

  const onThumbAdd = (idx: number) => {
    if (assets[idx]) setActiveIdx(idx);
    else if (assets.length < cfg.maxFiles && remainingTotalSize > 0) {
      const input = thumbInputRefs.current[idx];
      if (input) input.value = '';
      input?.click();
    }
  };

  const onThumbFile = async (
    e: ChangeEvent<HTMLInputElement>,
    slotIdx: number
  ) => {
    setAssetError(null);
    if (!e.target.files?.length) return;

    if (mode === 'model') {
      const [file] = e.target.files;
      const oldSize = assets[slotIdx] ? getAssetSize(assets[slotIdx]) : 0;
      const report = await handleModelValidation(
        file,
        totalSize - oldSize,
        MODE_CONFIG.model.overAllSizeLabel,
        MODE_CONFIG.model.maxSize
      );

      if (!report.isValid) {
        reportError(report.message.title, report.message.description);
        e.target.value = '';
        resetInputs();
        return;
      }
      try {
        const modelItem = await createModelAssetItem(file);
        replaceAssetItem(slotIdx, modelItem);
      } catch {
        reportError(
          'Model Processing Failed',
          'Unable to generate sprite/thumbnail for the selected model.'
        );
      }
    } else {
      const [validated] = validate(e.target.files);
      if (validated) {
        const oldSize = assets[slotIdx]?.file.size ?? 0;
        if (totalSize - oldSize + validated.size <= cfg.overAllSizeLabel) {
          replaceAsset(slotIdx, validated);
        } else {
          reportError(
            'Size Limit Exceeded',
            `${validated.name}: would exceed total limit`
          );
        }
      }
    }
    e.target.value = '';
    resetInputs();
  };

  const onThumbDrop = async (e: DragEvent<HTMLDivElement>, idx: number) => {
    e.preventDefault();
    e.stopPropagation();
    const overrideMode = mode === 'model' ? 'model' : undefined;
    const [validated] = validate(e.dataTransfer.files, overrideMode);
    if (validated) {
      const oldSize = assets[idx] ? getAssetSize(assets[idx]) : 0;
      if (totalSize - oldSize + validated.size <= cfg.overAllSizeLabel) {
        if (mode === 'model') {
          const report = await handleModelValidation(
            validated,
            totalSize - oldSize,
            MODE_CONFIG.model.overAllSizeLabel,
            MODE_CONFIG.model.maxSize
          );
          if (!report.isValid) {
            reportError(report.message.title, report.message.description);
            return;
          }
          try {
            const modelItem = await createModelAssetItem(validated);
            replaceAssetItem(idx, modelItem);
          } catch {
            reportError(
              'Model Processing Failed',
              'Unable to generate sprite/thumbnail for the selected model.'
            );
          }
        } else {
          replaceAsset(idx, validated);
        }
      } else {
        reportError(
          'Size Limit Exceeded',
          `${validated.name}: would exceed total limit`
        );
      }
    }
  };

  const activeAsset = assets[activeIdx];
  const canAddMoreThumbs =
    assets.length < cfg.maxFiles && remainingTotalSize > 0;
  const visibleThumbCount =
    assets.length === 0 ? 0 : assets.length + (canAddMoreThumbs ? 1 : 0);

  const renderPreview = () => {
    if (!activeAsset) return null;
    if (activeAsset.type === 'video') {
      return (
        <div className="flex size-full items-center justify-center overflow-hidden p-2">
          <video
            src={activeAsset.url}
            controls={false}
            muted
            autoPlay
            loop
            playsInline
            className="size-full object-contain"
          />
        </div>
      );
    }
    return (
      <div className="flex size-full items-center justify-center overflow-hidden p-2">
        <img
          src={activeAsset.url}
          alt={activeAsset.name}
          className="size-full object-contain"
        />
      </div>
    );
  };

  const resolvedSettings: VisualizerProps = {
    ...defaultSettings,
    ...(modelSettings ?? {}),
  };

  const renderModelMode = () => (
    <div className="mt-3 h-full">
      {!modelUrl ? (
        <ModelUploadZone
          onModelUpload={handleModelUpload}
          validationText="We support GLB and GLTF formats"
        >
          {({ openFileDialog }) => (
            <div className="flex flex-col items-center gap-3">
              <div className="flex flex-col items-center gap-1 text-center">
                <span className="text-neutral-gray-900 font-metropolis text-sm font-semibold">
                  {cfg.dropLabel}
                </span>
                <span className="text-neutral-gray-700 font-metropolis text-xs">
                  {cfg.sizeLabel} {formatMB(cfg.maxSize)} MB each
                </span>
              </div>
              <Button
                variant="tertiary"
                content="Upload"
                className="w-fit! leading-none!"
                leftIcon={<Icon icon="solar:upload-minimalistic-linear" />}
                size="sm"
                onClick={openFileDialog}
                disabled={
                  remainingTotalSize <= 0 || assets.length >= cfg.maxFiles
                }
              />
            </div>
          )}
        </ModelUploadZone>
      ) : (
        <div className="relative h-full w-full">
          <Canvas3D
            settings={resolvedSettings}
            modelUrl={modelUrl}
            viewer={true}
          />
        </div>
      )}
    </div>
  );

  const renderGenericZone = () => (
    <div
      onDrop={onDrop}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onClick={
        !hasAssets && remainingTotalSize > 0 && assets.length < cfg.maxFiles
          ? onBrowse
          : undefined
      }
      className={`mt-3 h-full w-full overflow-hidden rounded-3xl border-2 ${
        isDragging
          ? 'border-brand/90 bg-brand/10 cursor-default border-dashed'
          : hasAssets
            ? 'border-neutral-gray-300 bg-neutral-gray-150 cursor-default border-solid'
            : 'cursor-pointer border-dashed border-gray-400 bg-gray-50'
      } relative transition-all duration-200 ease-in-out`}
    >
      {hasAssets ? (
        <>{renderPreview()}</>
      ) : (
        <div className="flex h-full flex-col items-center justify-center gap-3 p-4">
          <div className="flex flex-col items-center gap-1">
            <span className="text-neutral-gray-900 font-metropolis text-sm font-semibold">
              {cfg.dropLabel}
            </span>
            <span className="text-neutral-gray-700 font-metropolis text-xs">
              {cfg.sizeLabel} {formatMB(cfg.maxSize)} MB each
            </span>
          </div>
          <Button
            variant="tertiary"
            content="Upload"
            className="w-fit! leading-none!"
            leftIcon={<Icon icon="solar:upload-minimalistic-linear" />}
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onBrowse();
            }}
            disabled={remainingTotalSize <= 0 || assets.length >= cfg.maxFiles}
          />
        </div>
      )}
    </div>
  );

  const renderThumbContent = (asset: AssetItem) => {
    if (asset.type === 'video') {
      return (
        <Icon
          icon="solar:video-library-linear"
          className="text-neutral-gray-600 size-6"
        />
      );
    }
    if (asset.type === 'model') {
      if (asset.thumbnailUrl) {
        return (
          <img
            src={asset.thumbnailUrl}
            alt={asset.name}
            className="size-full object-cover"
          />
        );
      }
      return (
        <Icon
          icon="solar:box-minimalistic-linear"
          className="text-neutral-gray-600 size-6"
        />
      );
    }
    return (
      <img
        src={asset.url}
        alt={asset.name}
        className="size-full object-cover"
      />
    );
  };

  return (
    <>
      <Tab
        defaultActiveId="images"
        data={tabs}
        variant="toggle"
        onClick={(item) => handleModeChange(item.value as AssetMode)}
      />

      <div className="mt-3 flex h-full min-h-112.5 flex-col gap-3">
        {mode === 'model' ? renderModelMode() : renderGenericZone()}

        {mode !== 'model' && (
          <input
            key={resetCounter}
            ref={fileInputRef}
            type="file"
            accept={cfg.acceptAttr}
            multiple={cfg.maxFiles > 1}
            onChange={onFileChange}
            className="hidden"
          />
        )}
        <input
          key={`model-${resetCounter}`}
          ref={modelInputRef}
          type="file"
          accept=".glb,.gltf"
          multiple
          onChange={onModelFileChange}
          className="hidden"
        />

        <div className="flex flex-wrap justify-center gap-2">
          {Array.from({ length: visibleThumbCount }).map((_, idx) => {
            const asset = assets[idx];
            const isActive = hasAssets && idx === activeIdx;
            const isDisabled =
              (!asset && assets.length >= cfg.maxFiles) ||
              (!asset && remainingTotalSize <= 0);

            return (
              <div className="group relative" key={idx}>
                <div
                  onClick={() => !isDisabled && onThumbAdd(idx)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => onThumbDrop(e, idx)}
                  className={`bg-neutral-gray-300 relative flex size-11 items-center justify-center overflow-hidden rounded-lg border-[1.5px] ${
                    isActive
                      ? 'border-neutral-gray-900'
                      : 'border-neutral-gray-400'
                  } ${isDisabled ? 'cursor-not-allowed opacity-40' : 'cursor-pointer'}`}
                  title={
                    isDisabled && !asset
                      ? `Total size limit reached (${formatMB(cfg.overAllSizeLabel)}MB)`
                      : undefined
                  }
                >
                  {asset ? (
                    renderThumbContent(asset)
                  ) : (
                    <AddIcon className="stroke-neutral-gray-600 size-6" />
                  )}
                </div>
                <input
                  key={`${resetCounter}-${idx}`}
                  ref={(el) => {
                    thumbInputRefs.current[idx] = el;
                  }}
                  type="file"
                  accept={cfg.acceptAttr}
                  onChange={(e) => onThumbFile(e, idx)}
                  className="hidden"
                />
                {asset && (
                  <Icon
                    icon="lucide:x"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeAsset(idx);
                    }}
                    className="absolute -top-1 -right-1 z-10 flex size-3.5 cursor-pointer items-center justify-center rounded-full bg-black p-0.5 text-white opacity-0 transition-opacity duration-150 group-hover:opacity-100"
                  />
                )}
              </div>
            );
          })}
        </div>

        <p className="text-neutral-gray-600 font-metropolis mt-2 text-center text-xs font-normal">
          <span>{formatSizeLabel(totalSize)}</span> of{' '}
          {formatSizeLabel(cfg.overAllSizeLabel)} used •{' '}
          <strong>
            {remainingTotalSize > 0 &&
              `${formatSizeLabel(remainingTotalSize)} remaining`}
          </strong>
        </p>

        {error && (
          <span className="font-metropolis text-ui-error text-center text-xs font-normal">
            {error}
          </span>
        )}
        {assetError && (
          <ToastCard
            key={`toast-${resetCounter}`}
            type="error"
            title={assetError.title}
            description={assetError.description}
          />
        )}
      </div>
    </>
  );
}
