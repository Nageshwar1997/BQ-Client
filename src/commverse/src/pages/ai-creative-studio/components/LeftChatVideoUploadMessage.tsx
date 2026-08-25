import { Icon } from '@iconify/react';
import { useEffect, useMemo, useRef, useState, type ChangeEvent } from 'react';
import Button from '../../../components/Button';
import FilterDropdown from '../../../components/FilterDropdown';
import type { SelectedOption } from '../../../types';
import { ToggleSwitch } from '../../../components/ToggleSwitch';

type LeftChatVideoUploadMessageProps = {
  sentAt?: Date | string | number;
  time?: string;
  showTime?: boolean;
  onProceed?: () => Promise<unknown> | unknown;
  isProceeding?: boolean;
  className?: string;
};

type FrameType = 'start' | 'end';

const formatUserLocalTime = (date: Date) =>
  new Intl.DateTimeFormat(undefined, {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(date);

const aspectRatioOptions: SelectedOption[] = [
  { id: '1-1', value: '1:1', label: '1:1 Square' },
  { id: '16-9', value: '16:9', label: '16:9 Landscape' },
  { id: '9-16', value: '9:16', label: '9:16 Portrait' },
];

const resolutionOptions: SelectedOption[] = [
  { id: '720p', value: '720p', label: '720p' },
  { id: '1080p', value: '1080p', label: '1080p' },
  { id: '4k', value: '4k', label: '4k' },
];

const durationOptions: SelectedOption[] = [
  { id: '3s', value: '3', label: '3 seconds' },
  { id: '5s', value: '5', label: '5 seconds' },
  { id: '10s', value: '10', label: '10 seconds' },
];

const brandOptions: SelectedOption[] = [
  { id: 'ctruh', value: 'ctruh', label: 'CTRUH' },
  { id: '3devent', value: '3devent', label: '3DEVENT' },
];

const dropdownClassName =
  'w-full [&>button]:w-full [&>button]:min-w-0 [&>button]:bg-white [&>button]:rounded-lg [&>button]:border-0 [&>button]:px-[clamp(8px,0.625vw,8px)] [&>button]:py-[clamp(8px,0.625vw,8px)] [&>button]:text-xs [&>button]:leading-[15px] [&>button]:font-medium [&>button]:gap-[clamp(6px,0.625vw,8px)] [&>button]:h-[clamp(36px,3.125vw,40px)] [&>button]:hover:bg-white [&>button]:focus-visible:ring-0 [&>button]:data-[state=open]:bg-white';

const acceptedImageTypes = new Set([
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/webp',
]);

const acceptedImageExtensions = new Set([
  'png',
  'jpg',
  'jpeg',
  'webp',
]);

const imageAccept = Array.from(acceptedImageTypes).join(',');
const MAX_INSTRUCTION_LINES = 5;

const isValidImageFile = (file: File) => {
  if (acceptedImageTypes.has(file.type.toLowerCase())) {
    return true;
  }

  const extension = file.name.split('.').pop()?.toLowerCase();
  return extension ? acceptedImageExtensions.has(extension) : false;
};

const LeftChatVideoUploadMessage = ({
  sentAt,
  time,
  showTime = true,
  onProceed,
  isProceeding,
  className = '',
}: LeftChatVideoUploadMessageProps) => {
  const sendTimeRef = useRef<Date>(sentAt ? new Date(sentAt) : new Date());
  const startFrameInputRef = useRef<HTMLInputElement | null>(null);
  const endFrameInputRef = useRef<HTMLInputElement | null>(null);
  const instructionsRef = useRef<HTMLTextAreaElement | null>(null);

  const [isBrandMemoryOn, setIsBrandMemoryOn] = useState(true);
  const [instructions, setInstructions] = useState('');
  const [startFramePreview, setStartFramePreview] = useState<string | null>(null);
  const [endFramePreview, setEndFramePreview] = useState<string | null>(null);
  const [isSubmittingInternal, setIsSubmittingInternal] = useState(false);

  const isSubmitting =
    typeof isProceeding === 'boolean' ? isProceeding : isSubmittingInternal;

  const resolvedTime = useMemo(
    () => time ?? formatUserLocalTime(sendTimeRef.current),
    [time],
  );

  const setFramePreview = (frame: FrameType, nextPreview: string | null) => {
    const setter = frame === 'start' ? setStartFramePreview : setEndFramePreview;

    setter((prevPreview) => {
      if (prevPreview?.startsWith('blob:')) {
        URL.revokeObjectURL(prevPreview);
      }
      return nextPreview;
    });
  };

  const openImageSelector = (frame: FrameType) => {
    if (isSubmitting) return;
    const inputRef = frame === 'start' ? startFrameInputRef : endFrameInputRef;
    inputRef.current?.click();
  };

  const handleImageSelect = (
    event: ChangeEvent<HTMLInputElement>,
    frame: FrameType,
  ) => {
    if (isSubmitting) return;

    const selectedFile = event.target.files?.[0];

    if (!selectedFile || !isValidImageFile(selectedFile)) {
      event.target.value = '';
      return;
    }

    setFramePreview(frame, URL.createObjectURL(selectedFile));
  };

  const removeUploadedImage = (frame: FrameType) => {
    if (isSubmitting) return;

    setFramePreview(frame, null);

    const inputRef = frame === 'start' ? startFrameInputRef : endFrameInputRef;
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  useEffect(() => {
    return () => {
      if (startFramePreview?.startsWith('blob:')) {
        URL.revokeObjectURL(startFramePreview);
      }
      if (endFramePreview?.startsWith('blob:')) {
        URL.revokeObjectURL(endFramePreview);
      }
    };
  }, [startFramePreview, endFramePreview]);

  const resizeInstructions = (textarea: HTMLTextAreaElement) => {
    const computedStyles = window.getComputedStyle(textarea);
    const lineHeight = parseFloat(computedStyles.lineHeight) || 18;
    const paddingTop = parseFloat(computedStyles.paddingTop) || 0;
    const paddingBottom = parseFloat(computedStyles.paddingBottom) || 0;
    const maxHeight =
      lineHeight * MAX_INSTRUCTION_LINES + paddingTop + paddingBottom;

    textarea.style.height = 'auto';
    textarea.style.height = `${Math.min(textarea.scrollHeight, maxHeight)}px`;
    textarea.style.overflowY =
      textarea.scrollHeight > maxHeight ? 'auto' : 'hidden';
  };

  const handleInstructionsChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setInstructions(event.target.value);
    resizeInstructions(event.target);
  };

  useEffect(() => {
    if (instructionsRef.current) {
      resizeInstructions(instructionsRef.current);
    }
  }, [instructions]);

  const handleProceedClick = async () => {
    if (isSubmitting) return;

    if (typeof isProceeding === 'boolean') {
      await onProceed?.();
      return;
    }

    setIsSubmittingInternal(true);
    try {
      await onProceed?.();
    } finally {
      setIsSubmittingInternal(false);
    }
  };

  const renderFrameUpload = (
    frame: FrameType,
    label: string,
    previewSrc: string | null,
  ) => (
    <div className="flex min-w-0 flex-1 flex-col gap-[clamp(6px,0.625vw,8px)]">
      <div className="text-[13px] leading-[16.25px] font-semibold text-neutral-gray-900">
        {label}
      </div>

      {previewSrc ? (
        <div className="relative h-[clamp(96px,9.375vw,120px)] w-full overflow-hidden rounded-[clamp(10px,0.9375vw,12px)] border border-neutral-gray-400 bg-white">
          <button
            type="button"
            onClick={() => openImageSelector(frame)}
            disabled={isSubmitting}
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
            disabled={isSubmitting}
            aria-label={`Remove ${frame} frame image`}
            className="absolute right-[clamp(6px,0.625vw,8px)] top-[clamp(6px,0.625vw,8px)] inline-flex size-[clamp(16px,1.25vw,20px)] items-center justify-center rounded text-neutral-gray-900"
          >
            <Icon icon="lucide:x" className="size-[clamp(16px,1.25vw,20px)]" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => openImageSelector(frame)}
          disabled={isSubmitting}
          className="relative inline-flex h-[clamp(96px,9.375vw,120px)] w-full cursor-pointer items-start justify-start gap-[clamp(6px,0.625vw,8px)] rounded-[clamp(16px,1.5625vw,20px)] bg-neutral-gray-150 p-[clamp(16px,1.5625vw,20px)]"
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
              stroke="#B6B7BF"
              strokeWidth="2"
              strokeDasharray="8 8"
            />
          </svg>
          <div className="flex flex-1 self-stretch flex-col items-center justify-center gap-3">
            <Icon
              icon="solar:gallery-send-linear"
              className="size-[clamp(24px,2.5vw,32px)] text-neutral-gray-900"
            />
            <span className="text-xs leading-[18px] font-medium text-neutral-gray-900">
              Upload
            </span>
          </div>
        </button>
      )}
    </div>
  );

  return (
    <div
      className={`w-full flex flex-col items-start ${className}`}
      data-name="Chat Messages"
      data-node-id="6050:429037"
    >
      <div className="flex flex-col items-start gap-2 px-[clamp(18px,2.1875vw,28px)]">
        <div className="relative w-[clamp(320px,46.875vw,600px)] max-w-full rounded-[clamp(14px,1.5625vw,20px)] border border-neutral-gray-200 bg-neutral-gray-150 px-[clamp(16px,1.875vw,24px)] py-[clamp(14px,1.5625vw,20px)]">
          <div
            className={`flex flex-col gap-[clamp(6px,0.625vw,8px)] transition-opacity ${isSubmitting ? 'pointer-events-none opacity-55' : 'opacity-100'}`}
            aria-busy={isSubmitting}
          >
            <div className="flex w-full gap-[clamp(6px,0.625vw,8px)]">
              {renderFrameUpload('start', 'Start Frame', startFramePreview)}
              {renderFrameUpload('end', 'End Frame (Optional)', endFramePreview)}
            </div>

            <input
              ref={startFrameInputRef}
              type="file"
              accept={imageAccept}
              disabled={isSubmitting}
              className="hidden"
              onChange={(event) => handleImageSelect(event, 'start')}
            />

            <input
              ref={endFrameInputRef}
              type="file"
              accept={imageAccept}
              disabled={isSubmitting}
              className="hidden"
              onChange={(event) => handleImageSelect(event, 'end')}
            />

            <div className="h-px w-full bg-neutral-gray-200" />

            <div className="text-[13px] leading-[16.25px] font-semibold text-neutral-gray-900">
              Instructions
            </div>

            <textarea
              ref={instructionsRef}
              rows={1}
              value={instructions}
              onChange={handleInstructionsChange}
              placeholder="Create a clean studio image of my product with soft lighting"
              disabled={isSubmitting}
              className="min-h-[clamp(36px,3.125vw,40px)] w-full resize-none overflow-y-hidden rounded-lg border border-neutral-gray-400 bg-white px-3 py-2 text-xs leading-[18px] font-normal text-neutral-gray-900 outline-none [scrollbar-width:thin] [scrollbar-color:rgba(24,24,26,0.1)_transparent] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-[999px] [&::-webkit-scrollbar-thumb]:bg-[rgba(24,24,26,0.1)]"
            />

            <div className="h-px w-full bg-neutral-gray-200" />

            <div className="text-[13px] leading-[16.25px] font-semibold text-neutral-gray-900">
              Additional Details
            </div>

            <div className="flex w-full flex-wrap gap-3">
              <div className="min-w-[clamp(104px,9.375vw,120px)] flex-1">
                <FilterDropdown
                  className={dropdownClassName}
                  innerLabel="16:9 Landscape"
                  leftIcon={
                    <Icon
                      icon="solar:maximize-square-minimalistic-linear"
                      className="size-4 text-neutral-gray-900"
                    />
                  }
                  options={aspectRatioOptions}
                />
              </div>

              <div className="min-w-[clamp(104px,9.375vw,120px)] flex-1">
                <FilterDropdown
                  className={dropdownClassName}
                  innerLabel="1080p"
                  leftIcon={
                    <Icon
                      icon="solar:file-linear"
                      className="size-4 text-neutral-gray-900"
                    />
                  }
                  options={resolutionOptions}
                />
              </div>

              <div className="min-w-[clamp(104px,9.375vw,120px)] flex-1">
                <FilterDropdown
                  className={dropdownClassName}
                  innerLabel="10 seconds"
                  leftIcon={
                    <Icon
                      icon="solar:clock-circle-linear"
                      className="size-4 text-neutral-gray-900"
                    />
                  }
                  options={durationOptions}
                />
              </div>
            </div>

            <div className="h-px w-full bg-neutral-gray-200" />

            <div className="flex h-[clamp(20px,1.875vw,24px)] items-center gap-[clamp(6px,0.625vw,8px)]">
              <span className="text-[13px] leading-[16.25px] font-semibold text-neutral-gray-900">
                Use Brand Memory
              </span>
              <div className="-scale-y-100">
                <ToggleSwitch
                  isOn={isBrandMemoryOn}
                  onToggle={setIsBrandMemoryOn}
                />
              </div>
            </div>

            <div className="w-[clamp(104px,9.375vw,120px)]">
              <FilterDropdown
                className={dropdownClassName}
                innerLabel="CTRUH"
                leftIcon={<Icon icon="lucide:brain" className="size-4" />}
                options={brandOptions}
                fitMenuToContent
                footerActionLabel="Create New"
                footerActionIcon={
                  <Icon icon="lucide:plus" className="size-4 text-neutral-gray-900" />
                }
                onFooterAction={() => {}}
              />
            </div>

            <div className="h-px w-full bg-neutral-gray-200" />

            <div className="flex w-full items-center justify-between gap-[clamp(8px,0.9375vw,12px)]">
              <Button
                variant="ghost"
                size="sm"
                content="Versa AI 1.0"
                disabled={isSubmitting}
                leftIcon={
                  <Icon icon="solar:stars-line-duotone" className="size-5" />
                }
                rightIcon={
                  <span className="inline-flex items-center gap-1">
                    <span className="rounded bg-neutral-gray-300 px-1 py-0.5 text-[10px] leading-[13.5px] font-semibold text-neutral-gray-900">
                      ULTRA
                    </span>
                    <Icon icon="solar:alt-arrow-down-linear" className="size-4" />
                  </span>
                }
                className="!h-[clamp(30px,2.5vw,32px)] !w-fit !rounded-lg !border-0 !bg-white !px-[clamp(6px,0.625vw,8px)] !py-[clamp(10px,0.9375vw,12px)] !text-sm !leading-[17.5px] !font-semibold !text-neutral-gray-900"
              />

              <Button
                variant="tertiary"
                size="sm"
                content="Proceed"
                disabled={isSubmitting}
                isLoading={isSubmitting}
                onClick={handleProceedClick}
                rightIcon={
                  <Icon
                    icon="solar:round-arrow-right-linear"
                    className="size-5"
                  />
                }
                className="!h-[clamp(30px,2.5vw,32px)] !w-fit !rounded-lg !px-[clamp(6px,0.625vw,8px)] !py-[clamp(10px,0.9375vw,12px)] !text-sm !leading-[17.5px] !font-semibold"
              />
            </div>
          </div>

          {isSubmitting && (
            <div
              className="pointer-events-none absolute inset-0 rounded-[clamp(14px,1.5625vw,20px)] bg-neutral-gray-100/35"
              aria-hidden="true"
            />
          )}
        </div>

        {showTime && (
          <p className="text-[10px] leading-[13.5px] font-normal text-neutral-gray-600">
            {resolvedTime}
          </p>
        )}
      </div>
    </div>
  );
};

export default LeftChatVideoUploadMessage;
