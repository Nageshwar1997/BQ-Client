import { Icon } from '@iconify/react';
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
} from 'react';
import { BrandMemoryToggle } from './BrandMemoryToggle';
import FilterDropdown from '../../../components/FilterDropdown';
import Button from '../../../components/Button';
import type { SelectedOption } from '../../../types';
import {
  getCreativeStudioPromptCharacterLimit,
  getCreativeStudioImageFileSizeError,
  getCreativeStudioPromptLengthError,
} from '../../../services/ai-creative-studio/validation';
import { useProceedHandler } from '../hooks/useProceedHandler';
import { useBrandMemorySelection } from '../hooks/useBrandMemorySelection';

export type VideoProceedPayload = {
  startFrameFile: File | null;
  endFrameFile: File | null;
  instructions: string;
  aspectRatio: string;
  resolution: string;
  duration: string;
  useBrandMemory: boolean;
  brandId?: string;
};

type VideoUploadMessageProps = {
  sentAt?: Date | string | number;
  time?: string;
  showTime?: boolean;
  onProceed?: (
    payload: VideoProceedPayload
  ) => Promise<boolean | void> | boolean | void;
  isProceeding?: boolean;
  initialStartFrameFile?: File | null;
  initialEndFrameFile?: File | null;
  initialStartFrameUrl?: string | null;
  initialEndFrameUrl?: string | null;
  initialInstructions?: string;
  className?: string;
};

type FrameType = 'start' | 'end';

const formatUserLocalTime = (date: Date) =>
  new Intl.DateTimeFormat(undefined, {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(date);

const aspectRatioOptions = [
  { id: '16-9', value: '16:9', label: '16:9 Landscape' },
  { id: '9-16', value: '9:16', label: '9:16 Portrait' },
];

const resolutionOptions = [
  { id: '720p', value: '720p', label: '720p' },
  { id: '1080p', value: '1080p', label: '1080p' },
  { id: '4k', value: '4k', label: '4k' },
];

const durationOptions = [
  { id: '4', value: '4', label: '4 seconds' },
  { id: '6', value: '6', label: '6 seconds' },
  { id: '8', value: '8', label: '8 seconds' },
];

const dropdownClassName =
  'w-full [&>button]:w-full [&>button]:min-w-0 [&>button]:bg-white [&>button]:rounded-lg [&>button]:border-0 [&>button]:px-[clamp(8px,0.625vw,8px)] [&>button]:py-[clamp(8px,0.625vw,8px)] [&>button]:text-xs [&>button]:leading-[15px] [&>button]:font-medium [&>button]:gap-[clamp(6px,0.625vw,8px)] [&>button]:h-[clamp(36px,3.125vw,40px)] [&>button]:hover:bg-white [&>button]:focus-visible:ring-0 [&>button]:data-[state=open]:bg-white';

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
  const extension = file.name.split('.').pop()?.toLowerCase();
  return extension ? acceptedImageExtensions.has(extension) : false;
};

export default function VideoUploadMessage({
  sentAt,
  time,
  showTime = true,
  onProceed,
  isProceeding,
  initialStartFrameFile = null,
  initialEndFrameFile = null,
  initialStartFrameUrl = null,
  initialEndFrameUrl = null,
  initialInstructions = '',
  className = '',
}: VideoUploadMessageProps) {
  const startFrameInputRef = useRef<HTMLInputElement | null>(null);
  const endFrameInputRef = useRef<HTMLInputElement | null>(null);
  const instructionsRef = useRef<HTMLTextAreaElement | null>(null);
  const ownedBlobUrlsRef = useRef<Set<string>>(new Set());

  const [instructions, setInstructions] = useState(initialInstructions);
  const [startFramePreview, setStartFramePreview] = useState<string | null>(
    initialStartFrameUrl
  );
  const [endFramePreview, setEndFramePreview] = useState<string | null>(
    initialEndFrameUrl
  );
  const [startFrameFile, setStartFrameFile] = useState<File | null>(
    initialStartFrameFile
  );
  const [endFrameFile, setEndFrameFile] = useState<File | null>(
    initialEndFrameFile
  );
  const [aspectRatio, setAspectRatio] = useState('16-9');
  const [resolution, setResolution] = useState('1080p');
  const [duration, setDuration] = useState('4');
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [frameFieldError, setFrameFieldError] = useState<string | null>(null);
  const [instructionsFieldError, setInstructionsFieldError] = useState<
    string | null
  >(null);
  const [useBrandMemory, setUseBrandMemory] = useState(false);
  const { handleProceedClick, isDisabled } =
    useProceedHandler<VideoProceedPayload>({
      isProceeding,
      onProceed,
    });
  const {
    brandOptions,
    selectedBrandId,
    setSelectedBrandId,
    isBrandMemoryLoading,
  } = useBrandMemorySelection();
  const promptCharacterLimit = getCreativeStudioPromptCharacterLimit('video');
  const promptLengthError = getCreativeStudioPromptLengthError(
    instructions,
    'video'
  );
  const isProceedButtonDisabled = isDisabled || Boolean(promptLengthError);

  const resolvedTime = useMemo(() => {
    return time ?? formatUserLocalTime(sentAt ? new Date(sentAt) : new Date());
  }, [sentAt, time]);

  // ── Frame helpers ─────────────────────────────────────────────────────────

  const setFramePreview = useCallback(
    (frame: FrameType, nextPreview: string | null, ownsBlobUrl = false) => {
      const setter =
        frame === 'start' ? setStartFramePreview : setEndFramePreview;
      setter((prev) => {
        if (prev && ownedBlobUrlsRef.current.has(prev)) {
          URL.revokeObjectURL(prev);
          ownedBlobUrlsRef.current.delete(prev);
        }
        if (nextPreview && ownsBlobUrl) {
          ownedBlobUrlsRef.current.add(nextPreview);
        }
        return nextPreview;
      });
    },
    []
  );

  const openImageSelector = (frame: FrameType) => {
    if (isDisabled) return;
    (frame === 'start'
      ? startFrameInputRef
      : endFrameInputRef
    ).current?.click();
  };

  const handleImageSelect = (
    event: ChangeEvent<HTMLInputElement>,
    frame: FrameType
  ) => {
    if (isDisabled) return;
    const file = event.target.files?.[0];
    if (!file || !isValidImageFile(file)) {
      setUploadError(
        'Only image/jpeg, image/jpg, image/png, and image/webp are allowed.'
      );
      event.target.value = '';
      return;
    }

    const fileSizeError = getCreativeStudioImageFileSizeError(file);
    if (fileSizeError) {
      setUploadError(fileSizeError);
      event.target.value = '';
      return;
    }
    const nextStartFrameFile = frame === 'start' ? file : startFrameFile;
    const nextEndFrameFile = frame === 'end' ? file : endFrameFile;

    if (frame === 'start') setStartFrameFile(file);
    if (frame === 'end') setEndFrameFile(file);
    setUploadError(null);
    if (nextStartFrameFile && nextEndFrameFile) {
      setFrameFieldError(null);
    }
    setFramePreview(frame, URL.createObjectURL(file), true);
  };

  const removeUploadedImage = (frame: FrameType) => {
    if (isDisabled) return;
    if (frame === 'start') setStartFrameFile(null);
    if (frame === 'end') setEndFrameFile(null);
    setUploadError(null);
    setFrameFieldError(null);
    setFramePreview(frame, null);
    const ref = frame === 'start' ? startFrameInputRef : endFrameInputRef;
    if (ref.current) ref.current.value = '';
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
    setStartFrameFile(initialStartFrameFile ?? null);

    if (initialStartFrameFile) {
      setFramePreview(
        'start',
        URL.createObjectURL(initialStartFrameFile),
        true
      );
      return;
    }

    if (initialStartFrameUrl) {
      setFramePreview('start', initialStartFrameUrl, false);
      return;
    }

    setFramePreview('start', null);
  }, [initialStartFrameFile, initialStartFrameUrl, setFramePreview]);

  useEffect(() => {
    setEndFrameFile(initialEndFrameFile ?? null);

    if (initialEndFrameFile) {
      setFramePreview('end', URL.createObjectURL(initialEndFrameFile), true);
      return;
    }

    if (initialEndFrameUrl) {
      setFramePreview('end', initialEndFrameUrl, false);
      return;
    }

    setFramePreview('end', null);
  }, [initialEndFrameFile, initialEndFrameUrl, setFramePreview]);

  // ── Instructions auto-resize ──────────────────────────────────────────────

  const resizeInstructions = (textarea: HTMLTextAreaElement) => {
    const s = window.getComputedStyle(textarea);
    const lh = parseFloat(s.lineHeight) || 18;
    const pt = parseFloat(s.paddingTop) || 0;
    const pb = parseFloat(s.paddingBottom) || 0;
    const max = lh * MAX_INSTRUCTION_LINES + pt + pb;
    textarea.style.height = 'auto';
    textarea.style.height = `${Math.min(textarea.scrollHeight, max)}px`;
    textarea.style.overflowY = textarea.scrollHeight > max ? 'auto' : 'hidden';
  };

  const handleInstructionsChange = (
    event: ChangeEvent<HTMLTextAreaElement>
  ) => {
    setInstructions(event.target.value);
    if (event.target.value.trim()) {
      setInstructionsFieldError(null);
    }
    resizeInstructions(event.target);
  };

  useEffect(() => {
    if (instructionsRef.current) resizeInstructions(instructionsRef.current);
  }, [instructions]);

  // ── Proceed ───────────────────────────────────────────────────────────────

  const handleProceed = async () => {
    if (isProceedButtonDisabled) return;

    let hasValidationError = false;

    if (!startFrameFile || !endFrameFile) {
      setFrameFieldError('Start and end frames are required.');
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

    const payload: VideoProceedPayload = {
      startFrameFile,
      endFrameFile,
      instructions: instructions.trim(),
      aspectRatio,
      resolution,
      duration,
      useBrandMemory: useBrandMemory && Boolean(selectedBrandId),
      brandId: useBrandMemory ? (selectedBrandId ?? undefined) : undefined,
    };
    await handleProceedClick(payload);
  };

  // ── Frame upload slot ─────────────────────────────────────────────────────

  const renderFrameUpload = (
    frame: FrameType,
    label: string,
    previewSrc: string | null
  ) => {
    const hasFrameError =
      Boolean(frameFieldError) &&
      ((frame === 'start' && !startFrameFile) ||
        (frame === 'end' && !endFrameFile));

    return (
      <div className="flex min-w-0 flex-1 flex-col gap-[clamp(6px,0.625vw,8px)]">
        <div className="text-[13px] leading-[16.25px] font-semibold text-[#18181a]">
          {label}
        </div>

        {previewSrc ? (
          <div
            className={`relative h-[clamp(96px,9.375vw,120px)] w-full overflow-hidden rounded-[clamp(10px,0.9375vw,12px)] border bg-white ${
              hasFrameError ? 'border-[#c81e1e]' : 'border-[#d0d1d9]'
            }`}
          >
            <button
              type="button"
              onClick={() => openImageSelector(frame)}
              disabled={isDisabled}
              className="flex h-full w-full cursor-pointer items-center justify-center"
              aria-label={`Replace ${frame} frame image`}
            >
              <img
                src={previewSrc}
                alt={`${frame} frame`}
                className="h-full w-auto max-w-full object-contain"
              />
            </button>
            <button
              type="button"
              onClick={() => removeUploadedImage(frame)}
              disabled={isDisabled}
              aria-label={`Remove ${frame} frame image`}
              className="absolute top-[clamp(6px,0.625vw,8px)] right-[clamp(6px,0.625vw,8px)] inline-flex size-[clamp(16px,1.25vw,20px)] items-center justify-center rounded bg-white/80 text-[#18181a] transition-colors hover:bg-white"
            >
              <Icon
                icon="lucide:x"
                className="size-[clamp(14px,1.25vw,16px)]"
              />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => openImageSelector(frame)}
            disabled={isDisabled}
            className="relative inline-flex h-[clamp(96px,9.375vw,120px)] w-full cursor-pointer items-start justify-start gap-[clamp(6px,0.625vw,8px)] rounded-[clamp(16px,1.5625vw,20px)] bg-[#f7f8fa] p-[clamp(16px,1.5625vw,20px)] transition-colors hover:bg-[#f0f1f7]"
          >
            <svg
              viewBox="0 0 272 120"
              preserveAspectRatio="none"
              className="pointer-events-none absolute inset-0 size-full"
              aria-hidden="true"
            >
              <rect
                x="1"
                y="1"
                width="270"
                height="118"
                rx="20"
                ry="20"
                fill="none"
                stroke={hasFrameError ? '#c81e1e' : '#B6B7BF'}
                strokeWidth="2"
                strokeDasharray="8 8"
              />
            </svg>
            <div className="flex flex-1 flex-col items-center justify-center gap-3 self-stretch">
              <Icon
                icon="solar:gallery-send-linear"
                className="size-[clamp(24px,2.5vw,32px)] text-[#18181a]"
              />
              <span className="text-xs leading-[18px] font-medium text-[#18181a]">
                Upload
              </span>
            </div>
          </button>
        )}
      </div>
    );
  };

  const visibleUploadError = uploadError ?? frameFieldError;

  // ─────────────────────────────────────────────────────────────────────────

  return (
    <div
      className={`flex w-full flex-col items-start ${className}`}
      data-name="Chat Messages"
    >
      <div className="flex flex-col items-start gap-2 px-[clamp(18px,2.1875vw,28px)]">
        <div className="relative w-[clamp(320px,46.875vw,600px)] max-w-full rounded-[clamp(14px,1.5625vw,20px)] border border-[#f0f1f7] bg-[#f7f8fa] px-[clamp(16px,1.875vw,24px)] py-[clamp(14px,1.5625vw,20px)]">
          <div
            className={`flex flex-col gap-[clamp(6px,0.625vw,8px)] transition-opacity ${
              isDisabled ? 'pointer-events-none opacity-55' : 'opacity-100'
            }`}
            // aria-busy={isSubmitting}
          >
            {/* ── Frame uploads ── */}
            {visibleUploadError ? (
              <p className="text-[12px] text-[#c81e1e]">{visibleUploadError}</p>
            ) : null}
            <div className="flex w-full gap-[clamp(6px,0.625vw,8px)]">
              {renderFrameUpload('start', 'Start Frame', startFramePreview)}
              {renderFrameUpload('end', 'End Frame', endFramePreview)}
            </div>

            {/* Hidden file inputs */}
            <input
              ref={startFrameInputRef}
              type="file"
              accept={imageAccept}
              disabled={isDisabled}
              className="hidden"
              onChange={(e) => handleImageSelect(e, 'start')}
            />
            <input
              ref={endFrameInputRef}
              type="file"
              accept={imageAccept}
              disabled={isDisabled}
              className="hidden"
              onChange={(e) => handleImageSelect(e, 'end')}
            />

            <div className="h-px w-full bg-[#eaebf1]" />

            {/* ── Instructions ── */}
            <div className="text-[13px] leading-[16.25px] font-semibold text-[#18181a]">
              Instructions
            </div>
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
              className={`min-h-[clamp(36px,3.125vw,40px)] w-full resize-none overflow-y-hidden rounded-lg border bg-white px-3 py-2 text-xs leading-[18px] font-normal text-[#18181a] outline-none [scrollbar-color:rgba(24,24,26,0.1)_transparent] [scrollbar-width:thin] placeholder:text-[#797a80] ${
                instructionsFieldError || promptLengthError
                  ? 'border-[#c81e1e]'
                  : 'border-[#d0d1d9]'
              }`}
            />
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

            <div className="h-px w-full bg-[#eaebf1]" />

            {/* ── Additional Details ── */}
            <div className="text-[13px] leading-[16.25px] font-semibold text-[#18181a]">
              Additional Details
            </div>
            <div className="flex w-full flex-wrap gap-3">
              <div className="min-w-[clamp(104px,9.375vw,120px)] flex-1">
                <FilterDropdown
                  className={dropdownClassName}
                  innerLabel="16:9 Landscape"
                  leftIcon={
                    <Icon
                      icon="solar:full-screen-linear"
                      className="size-4 text-[#18181a]"
                    />
                  }
                  options={aspectRatioOptions}
                  value={aspectRatio}
                  onChange={(selected) => {
                    const option = selected as SelectedOption | null;
                    if (option?.id) setAspectRatio(option.id);
                  }}
                />
              </div>
              <div className="min-w-[clamp(104px,9.375vw,120px)] flex-1">
                <FilterDropdown
                  className={dropdownClassName}
                  innerLabel="1080p"
                  leftIcon={
                    <Icon
                      icon="solar:file-linear"
                      className="size-4 text-[#18181a]"
                    />
                  }
                  options={resolutionOptions}
                  value={resolution}
                  onChange={(selected) => {
                    const option = selected as SelectedOption | null;
                    if (option?.id) setResolution(option.id);
                  }}
                />
              </div>
              <div className="min-w-[clamp(104px,9.375vw,120px)] flex-1">
                <FilterDropdown
                  className={dropdownClassName}
                  innerLabel="4 seconds"
                  leftIcon={
                    <Icon
                      icon="solar:clock-circle-linear"
                      className="size-5 text-[#18181a]"
                    />
                  }
                  options={durationOptions}
                  value={duration}
                  onChange={(selected) => {
                    const option = selected as SelectedOption | null;
                    if (option?.id) setDuration(option.id);
                  }}
                />
              </div>
            </div>

            <div className="h-px w-full bg-[#eaebf1]" />

            <BrandMemoryToggle
              disabled={isDisabled || isBrandMemoryLoading}
              isOn={useBrandMemory}
              options={brandOptions}
              selectedBrandId={selectedBrandId}
              onToggle={setUseBrandMemory}
              onBrandSelect={setSelectedBrandId}
            />

            <div className="h-px w-full bg-[#eaebf1]" />

            {/* ── Footer ── */}
            <div className="flex w-full items-center justify-end gap-[clamp(8px,0.9375vw,12px)]">
              {/* TODO: Re-enable Versa AI model selection once model switching is supported for this flow. */}
              {/* <VersaAiModelSelector disabled={isDisabled} /> */}
              <Button
                variant="tertiary"
                size="sm"
                content="Proceed"
                disabled={isProceedButtonDisabled}
                // isLoading={isSubmitting}
                onClick={handleProceed}
                rightIcon={
                  <Icon
                    icon="solar:round-arrow-right-linear"
                    className="size-5"
                  />
                }
                className="w-fit!"
              />
            </div>
          </div>

          {/* Loading overlay */}
          {isDisabled && (
            <div
              className="pointer-events-none absolute inset-0 rounded-[clamp(14px,1.5625vw,20px)] bg-[#f7f8fa]/35"
              aria-hidden="true"
            />
          )}
        </div>

        {showTime && (
          <p className="text-[10px] leading-[13.5px] font-normal text-[#797a80]">
            {resolvedTime}
          </p>
        )}
      </div>
    </div>
  );
}
