import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
} from 'react';
import FilterDropdown from '../../../components/FilterDropdown';
import { BrandMemoryToggle } from './BrandMemoryToggle';
import Button from '../../../components/Button';
import { Icon } from '@iconify/react';
import type { SelectedOption } from '../../../types';
import {
  getCreativeStudioPromptCharacterLimit,
  getCreativeStudioImageFileSizeError,
  getCreativeStudioPromptLengthError,
} from '../../../services/ai-creative-studio/validation';
import { useProceedHandler } from '../hooks/useProceedHandler';
import { useBrandMemorySelection } from '../hooks/useBrandMemorySelection';

// ─── Types ────────────────────────────────────────────────────────────────────

export type ImageProceedPayload = {
  imageFile: File | null;
  instructions: string;
  quantity: number;
  aspectRatio: string;
  format: string;
  useBrandMemory: boolean;
  brandId?: string;
};

type ImageUploadMessageProps = {
  sentAt?: Date | string | number;
  time?: string;
  showTime?: boolean;
  onProceed?: (
    payload: ImageProceedPayload
  ) => Promise<boolean | void> | boolean | void;
  isProceeding?: boolean;
  initialImageFile?: File | null;
  initialImageUrl?: string | null;
  initialInstructions?: string;
  className?: string;
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatUserLocalTime = (date: Date) =>
  new Intl.DateTimeFormat(undefined, {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(date);

const acceptedImageTypes = new Set([
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/webp',
]);
const acceptedImageExtensions = new Set(['png', 'jpg', 'jpeg', 'webp']);
const imageAccept = Array.from(acceptedImageTypes).join(',');
const MAX_INSTRUCTION_LINES = 5;

const isValidImageFile = (file: File) => {
  if (acceptedImageTypes.has(file.type.toLowerCase())) return true;
  const ext = file.name.split('.').pop()?.toLowerCase();
  return ext ? acceptedImageExtensions.has(ext) : false;
};

// ─── Options ──────────────────────────────────────────────────────────────────

const aspectRatioOptions = [
  { id: '1-1', value: '1:1', label: '1:1 Square' },
  { id: '16-9', value: '16:9', label: '16:9 Landscape' },
  { id: '9-16', value: '9:16', label: '9:16 Portrait' },
  { id: '3-4', value: '3:4', label: '3:4 Instagram' },
  { id: '4-3', value: '4:3', label: '4:3 iPad' },
];
// TODO: Re-enable output format selection once non-PNG image exports are supported end-to-end.
// const formatOptions = [
//   { id: 'image/png', value: 'image/png', label: 'PNG' },
//   { id: 'image/jpeg', value: 'image/jpeg', label: 'JPG' },
//   { id: 'image/webp', value: 'image/webp', label: 'WEBP' },
// ];

// ─── Dropdown className (Figma-matched) ───────────────────────────────────────

const ddCls =
  'w-full [&>button]:w-full [&>button]:min-w-0 [&>button]:bg-white [&>button]:rounded-[8px] [&>button]:border-0 [&>button]:p-2 [&>button>span]:text-neutral-gray-900 text-[12px] [&>button]:leading-[15px] [&>button]:font-medium [&>button]:gap-2 [&>button]:h-auto [&>button]:hover:bg-white [&>button]:focus-visible:ring-0';
/** Figma divider line */
function Divider() {
  return (
    <div className="flex h-[16px] w-full shrink-0 items-center justify-center">
      <div className="relative h-0 min-h-px min-w-px flex-1">
        <div className="absolute inset-[-1px_0_0_0]">
          <svg
            className="block size-full"
            fill="none"
            preserveAspectRatio="none"
            viewBox="0 0 552 1"
          >
            <line stroke="#EAEBF1" x2="552" y1="0.5" y2="0.5" />
          </svg>
        </div>
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function ImageUploadMessage({
  sentAt,
  time,
  showTime = true,
  onProceed,
  isProceeding,
  initialImageFile = null,
  initialImageUrl = null,
  initialInstructions = '',
  className = '',
}: ImageUploadMessageProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const instructionsRef = useRef<HTMLTextAreaElement | null>(null);

  const [quantity, setQuantity] = useState(1);
  const ownedBlobUrlsRef = useRef<Set<string>>(new Set());

  const [instructions, setInstructions] = useState(initialInstructions);
  const [uploadedImagePreview, setUploadedImagePreview] = useState<
    string | null
  >(initialImageUrl);
  const [uploadedImageFile, setUploadedImageFile] = useState<File | null>(
    initialImageFile
  );
  const [aspectRatio, setAspectRatio] = useState('1-1');
  const [format] = useState('image/png');
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [imageFieldError, setImageFieldError] = useState<string | null>(null);
  const [instructionsFieldError, setInstructionsFieldError] = useState<
    string | null
  >(null);
  const [useBrandMemory, setUseBrandMemory] = useState(false);
  const { handleProceedClick, isDisabled } =
    useProceedHandler<ImageProceedPayload>({
      isProceeding,
      onProceed,
    });
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const {
    brandOptions,
    selectedBrandId,
    setSelectedBrandId,
    isBrandMemoryLoading,
  } = useBrandMemorySelection();
  const promptCharacterLimit = getCreativeStudioPromptCharacterLimit('image');
  const promptLengthError = getCreativeStudioPromptLengthError(
    instructions,
    'image'
  );
  const isProceedButtonDisabled = isDisabled || Boolean(promptLengthError);
  const isQuantityDecreaseDisabled = isDisabled || quantity <= 1;
  const isQuantityIncreaseDisabled = isDisabled || quantity >= 4;

  const resolvedTime = useMemo(() => {
    return time ?? formatUserLocalTime(sentAt ? new Date(sentAt) : new Date());
  }, [sentAt, time]);

  // ── Image handling ────────────────────────────────────────────────────────

  const updateImagePreview = useCallback(
    (next: string | null, ownsBlobUrl = false) => {
      setUploadedImagePreview((prev) => {
        if (prev && ownedBlobUrlsRef.current.has(prev)) {
          URL.revokeObjectURL(prev);
          ownedBlobUrlsRef.current.delete(prev);
        }
        if (next && ownsBlobUrl) {
          ownedBlobUrlsRef.current.add(next);
        }
        return next;
      });
    },
    []
  );

  const processFile = (file: File) => {
    if (!isValidImageFile(file)) {
      setUploadError(
        'Only image/jpeg, image/jpg, image/png, and image/webp are allowed.'
      );
      return;
    }

    const fileSizeError = getCreativeStudioImageFileSizeError(file);
    if (fileSizeError) {
      setUploadError(fileSizeError);
      return;
    }

    setUploadedImageFile(file);
    setUploadError(null);
    setImageFieldError(null);
    updateImagePreview(URL.createObjectURL(file), true);
  };

  const openFileSelector = () => {
    if (isDisabled) return;
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (isDisabled) return;
    const file = e.target.files?.[0];
    if (file) processFile(file);
    e.target.value = '';
  };

  const removeImage = () => {
    if (isDisabled) return;
    setUploadedImageFile(null);
    setUploadError(null);
    setImageFieldError(null);
    updateImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDragOver = (e: React.DragEvent) => {
    if (isDisabled) return;
    e.preventDefault();
    setIsDraggingOver(true);
  };
  const handleDragLeave = () => setIsDraggingOver(false);
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(false);
    if (isDisabled) return;
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  useEffect(() => {
    const ownedBlobUrls = ownedBlobUrlsRef.current;
    return () => {
      ownedBlobUrls.forEach((url) => URL.revokeObjectURL(url));
      ownedBlobUrls.clear();
    };
  }, []);

  useEffect(() => {
    setInstructions(initialInstructions);
  }, [initialInstructions]);

  useEffect(() => {
    setUploadedImageFile(initialImageFile ?? null);

    if (initialImageFile) {
      updateImagePreview(URL.createObjectURL(initialImageFile), true);
      return;
    }

    if (initialImageUrl) {
      updateImagePreview(initialImageUrl, false);
      return;
    }

    updateImagePreview(null);
  }, [initialImageFile, initialImageUrl, updateImagePreview]);

  // ── Instructions auto-resize ──────────────────────────────────────────────

  const resizeTextarea = (el: HTMLTextAreaElement) => {
    const styles = window.getComputedStyle(el);
    const lh = parseFloat(styles.lineHeight) || 18;
    const pt = parseFloat(styles.paddingTop) || 0;
    const pb = parseFloat(styles.paddingBottom) || 0;
    const maxH = lh * MAX_INSTRUCTION_LINES + pt + pb;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, maxH)}px`;
    el.style.overflowY = el.scrollHeight > maxH ? 'auto' : 'hidden';
  };

  const handleInstructionsChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setInstructions(e.target.value);
    if (e.target.value.trim()) {
      setInstructionsFieldError(null);
    }
    resizeTextarea(e.target);
  };

  useEffect(() => {
    if (instructionsRef.current) resizeTextarea(instructionsRef.current);
  }, [instructions]);

  const handleProceed = async () => {
    if (isProceedButtonDisabled) return;

    let hasValidationError = false;

    if (!uploadedImageFile) {
      setImageFieldError('Upload at least one image before proceeding.');
      hasValidationError = true;
    }

    if (!instructions.trim()) {
      setInstructionsFieldError('Prompt is required.');
      hasValidationError = true;
    }

    if (promptLengthError) {
      setInstructionsFieldError(promptLengthError);
      hasValidationError = true;
    }

    if (hasValidationError) {
      return;
    }

    const payload: ImageProceedPayload = {
      imageFile: uploadedImageFile,
      instructions: instructions.trim(),
      quantity,
      aspectRatio,
      format,
      useBrandMemory: useBrandMemory && Boolean(selectedBrandId),
      brandId: useBrandMemory ? (selectedBrandId ?? undefined) : undefined,
    };
    await handleProceedClick(payload);
  };

  const visibleUploadError = uploadError ?? imageFieldError;

  return (
    <div className={`flex w-full flex-col items-start ${className}`}>
      <div className="flex flex-col items-start gap-2 px-[clamp(18px,2.1875vw,28px)]">
        {/* ── Card (matches Figma InputBox exactly) ── */}
        <div
          className={`bg-neutral-gray-150 relative flex w-[clamp(320px,46.875vw,600px)] max-w-full flex-col items-start gap-1 rounded-[20px] border border-[#f0f1f7] px-6 py-5 transition-opacity ${
            isDisabled ? 'pointer-events-none opacity-55' : 'opacity-100'
          }`}
        >
          {/* ── Section: Uploaded Product Image ─────────────── */}
          <div className="flex w-full shrink-0 flex-col items-start gap-2">
            <div className="flex h-6 w-full shrink-0 items-center">
              <p className="shrink-0 text-[13px] leading-tight font-semibold whitespace-nowrap text-[#18181a]">
                Uploaded Product Image
              </p>
            </div>
            {visibleUploadError ? (
              <p className="text-[12px] text-[#c81e1e]">{visibleUploadError}</p>
            ) : null}

            <div className="flex h-[120px] w-full shrink-0 flex-wrap items-start gap-y-2">
              {uploadedImagePreview ? (
                /* Preview state */
                <div
                  className={`relative h-[120px] min-h-px min-w-px flex-1 overflow-clip rounded-[20px] border bg-white ${
                    imageFieldError ? 'border-[#c81e1e]' : 'border-[#b6b7bf]'
                  }`}
                >
                  <button
                    type="button"
                    onClick={openFileSelector}
                    disabled={isDisabled}
                    className="flex h-full w-full cursor-pointer items-center justify-center"
                    aria-label="Replace uploaded image"
                  >
                    <img
                      src={uploadedImagePreview}
                      alt="Uploaded product"
                      className="h-full w-auto max-w-full object-contain"
                    />
                  </button>
                  <button
                    type="button"
                    onClick={removeImage}
                    disabled={isDisabled}
                    aria-label="Remove uploaded image"
                    className="rounded-ful absolute top-2 right-2 inline-flex size-5 cursor-pointer items-center justify-center"
                  >
                    <Icon icon="lucide:x" />
                  </button>
                </div>
              ) : (
                /* Upload dropzone */
                <div
                  className={`bg-neutral-gray-150 relative h-[120px] min-h-px min-w-px flex-1 rounded-[20px] ${
                    isDraggingOver ? 'bg-[#eef0ff]' : ''
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <button
                    type="button"
                    onClick={openFileSelector}
                    disabled={isDisabled}
                    aria-label="Upload product image"
                    className="block size-full cursor-pointer overflow-clip rounded-[inherit]"
                  >
                    <div className="flex size-full items-start p-5">
                      <div className="flex h-full min-h-px min-w-px flex-1 flex-col items-center justify-center gap-3">
                        <Icon
                          icon="solar:gallery-send-linear"
                          className="size-7"
                        />

                        <div className="flex w-full shrink-0 flex-col items-center gap-1">
                          <p className="w-full text-center text-[12px] leading-normal font-medium text-[#18181a]">
                            Upload
                          </p>
                        </div>
                      </div>
                    </div>
                  </button>
                  {/* Figma dashed border overlay */}
                  <div
                    aria-hidden="true"
                    className={`pointer-events-none absolute -inset-px rounded-[21px] border-2 border-dashed transition-colors ${
                      imageFieldError
                        ? 'border-[#c81e1e]'
                        : isDraggingOver
                          ? 'border-[#002DFF]'
                          : 'border-[#b6b7bf]'
                    }`}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept={imageAccept}
            disabled={isDisabled}
            className="hidden"
            onChange={handleFileChange}
          />

          <Divider />

          {/* ── Section: Instructions ────────────────────────── */}
          <div className="flex w-full shrink-0 flex-col items-start gap-2">
            <div className="flex h-6 w-full shrink-0 items-center">
              <p className="shrink-0 text-[13px] leading-tight font-semibold whitespace-nowrap text-[#18181a]">
                Instructions
              </p>
            </div>
            <div className="flex w-full min-w-[135px]">
              <textarea
                ref={instructionsRef}
                rows={1}
                value={instructions}
                onChange={handleInstructionsChange}
                placeholder="Describe your vision"
                disabled={isDisabled}
                aria-invalid={Boolean(
                  instructionsFieldError || promptLengthError
                )}
                className={`h-full w-full resize-none overflow-y-hidden rounded-[8px] border bg-white px-3 py-2 text-[12px] leading-[18px] font-normal text-[#18181a] outline-none [scrollbar-color:rgba(24,24,26,0.1)_transparent] [scrollbar-width:thin] placeholder:text-[#b6b7bf] ${
                  instructionsFieldError || promptLengthError
                    ? 'border-[#c81e1e]'
                    : 'border-[#d0d1d9]'
                }`}
              />
            </div>
            <div className="flex w-full items-center justify-between gap-3 text-[12px]">
              <div className="min-h-[18px] flex-1">
                {instructionsFieldError ? (
                  <p className="text-[#c81e1e]">{instructionsFieldError}</p>
                ) : null}
              </div>
              <p
                className={
                  instructionsFieldError || promptLengthError
                    ? 'text-[#c81e1e]'
                    : 'text-[#797a80]'
                }
              >
                {instructions.trim().length}/{promptCharacterLimit}
              </p>
            </div>
          </div>

          <Divider />

          {/* ── Section: Additional Details ──────────────────── */}
          <div className="flex w-full shrink-0 flex-col items-start gap-2">
            <div className="flex h-6 w-full shrink-0 items-center">
              <p className="shrink-0 text-[13px] leading-tight font-semibold whitespace-nowrap text-[#18181a]">
                Additional Details
              </p>
            </div>
            <div className="flex w-full shrink-0 items-start gap-3">
              {/* Aspect Ratio */}
              <div className="min-w-33.75 flex-1">
                <FilterDropdown
                  className={ddCls}
                  innerLabel="1:1 Square"
                  leftIcon={
                    <Icon icon="solar:full-screen-linear" className="size-4" />
                  }
                  options={aspectRatioOptions}
                  value={aspectRatio}
                  onChange={(selected) => {
                    const option = selected as SelectedOption | null;
                    if (option?.id) setAspectRatio(option.id);
                  }}
                />
              </div>
              {/* Format */}
              <div className="min-w-33.75 flex-1">
                {/* TODO: Re-enable output format selection once non-PNG image exports are supported end-to-end. */}
                {/* <FilterDropdown
                  className={ddCls}
                  innerLabel="PNG"
                  leftIcon={
                    <Icon icon="solar:file-linear" className="size-4" />
                  }
                  options={formatOptions}
                  value={format}
                  onChange={(selected) => {
                    const option = selected as SelectedOption | null;
                    if (option?.value) setFormat(option.value);
                  }}
                /> */}
                <div className="flex h-full w-full cursor-not-allowed items-center gap-2 rounded-[8px] bg-white px-2 py-2 text-[12px] leading-[15px] font-medium text-[#18181a]">
                  <Icon icon="solar:file-linear" className="size-4" />
                  <span>PNG</span>
                </div>
              </div>
              {/* Quantity stepper */}
              <div className="relative min-h-px min-w-[135px] flex-1 rounded-[8px] bg-white">
                <div className="flex size-full min-w-[inherit] flex-row items-center">
                  <div className="flex w-full min-w-[inherit] items-center gap-2 p-2">
                    <button
                      type="button"
                      aria-label="Decrease quantity"
                      onClick={() =>
                        !isDisabled && setQuantity((q) => Math.max(1, q - 1))
                      }
                      disabled={isQuantityDecreaseDisabled}
                      className="relative flex size-4 shrink-0 items-center justify-center overflow-clip disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <svg
                        className="block size-4"
                        fill="none"
                        viewBox="0 0 16 16"
                      >
                        <path
                          d="M3.33 8H12.67"
                          stroke="#18181A"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                    <div className="flex flex-1 flex-row items-center justify-center self-stretch">
                      <p className="w-full text-center text-[12px] leading-tight font-medium text-[#18181a]">
                        {quantity}
                      </p>
                    </div>
                    <button
                      type="button"
                      aria-label="Increase quantity"
                      onClick={() =>
                        !isDisabled && setQuantity((q) => Math.min(4, q + 1))
                      }
                      disabled={isQuantityIncreaseDisabled}
                      className="relative flex size-4 shrink-0 items-center justify-center overflow-clip disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <svg
                        className="block size-4"
                        fill="none"
                        viewBox="0 0 16 16"
                      >
                        <path
                          d="M3.33 8H12.67M8 3.33V12.67"
                          stroke="#18181A"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <Divider />

          <BrandMemoryToggle
            disabled={isDisabled || isBrandMemoryLoading}
            isOn={useBrandMemory}
            options={brandOptions}
            selectedBrandId={selectedBrandId}
            onToggle={setUseBrandMemory}
            onBrandSelect={setSelectedBrandId}
          />

          <Divider />
          <div className="flex w-full shrink-0 items-center justify-end">
            {/* TODO: Re-enable Versa AI model selection once model switching is supported for this flow. */}
            {/* <VersaAiModelSelector disabled={isDisabled} /> */}
            <Button
              variant="tertiary"
              size="sm"
              content="Proceed"
              disabled={isProceedButtonDisabled}
              onClick={handleProceed}
              rightIcon={
                <Icon
                  icon="solar:round-arrow-right-linear"
                  className="size-5"
                />
              }
              className="w-fit! rounded-lg! px-2! py-1.5!"
            />
          </div>
        </div>

        {/* Timestamp */}
        {showTime && (
          <p className="text-[10px] leading-[13.5px] font-normal text-[#797a80]">
            {resolvedTime}
          </p>
        )}
      </div>
    </div>
  );
}
