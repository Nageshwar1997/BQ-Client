import { Icon } from '@iconify/react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router';

import { ExperienceFilterIcon, VersaAIGradientFillIcon } from '../../../icons';
import {
  generateMedia,
  linkGeneratedMediaToProduct,
  waitForGeneratedMediaCompletion,
  type GenerateMediaPayload,
  type GeneratedMediaType,
  getCreativeStudioMaxPromptCharacterLimit,
  getCreativeStudioImageFileSizeError,
  getCreativeStudioPromptCharacterLimit,
  getCreativeStudioPromptLengthError,
} from '../../../services/ai-creative-studio';
import { useChat } from '../context/ChatContext';
import type { MediaAttachment, Message } from '../context/ChatContext';
import { useUser } from '../context/UserContext';
import Input from '../imports/input-component';
import ImageUploadMessage from './ImageUploadMessage';
import MediaResponseMessage from './MediaResponseMessage';
import VideoUploadMessage from './VideoUploadMessage';
import type { ImageProceedPayload } from './ImageUploadMessage';
import type { MediaItem } from './MediaResponseMessage';
import type { VideoProceedPayload } from './VideoUploadMessage';
import Button from '../../../components/Button';
import ProductAssetAssignmentModal from '../../../components/ProductAssetAssignmentModal';
import type { ProductData } from '../../../components/ProductListItem';
import Userprofile from '../../../components/Userprofile';
import { assetOption, experienceOptions } from '../../3d-asset-library';

type PendingAttachment = {
  id: string;
  file: File;
  url: string;
  name: string;
};

type ComposerPayload = {
  text: string;
  attachments: MediaAttachment[];
  preferredMediaType: GeneratedMediaType | null;
};

type GenerationRequest = {
  mediaType: GeneratedMediaType;
  prompt: string;
  files: File[];
  aspectRatio?: string;
  sampleCount?: number;
  imageMimeType?: string;
  endImageMimeType?: string;
  durationSeconds?: number;
  resolution?: string;
  useBrandMemory?: boolean;
  brandId?: string;
};

const IMAGE_ASPECT_RATIO_MAP: Record<string, string> = {
  '1-1': '1:1',
  '16-9': '16:9',
  '9-16': '9:16',
  '4-3': '4:3',
  '3-4': '3:4',
  '4-5': '4:5',
  '2-3': '2:3',
  '3-2': '3:2',
  '1-2': '1:2',
  '2-1': '2:1',
};

const VIDEO_ASPECT_RATIO_MAP: Record<string, string> = {
  '1-1': '1:1',
  '16-9': '16:9',
  '9-16': '9:16',
};

const SUPPORTED_IMAGE_MIME_TYPES = new Set([
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
]);

const SUPPORTED_IMAGE_EXTENSIONS = new Set(['jpeg', 'jpg', 'png', 'webp']);
const SUPPORTED_IMAGE_ACCEPT = Array.from(SUPPORTED_IMAGE_MIME_TYPES).join(',');
const USAGE_LIMIT_EXCEEDED_MESSAGE =
  'Usage limit exceeded for your current plan.';
const PRICING_PAGE_PATH = '/settings/payments/plan-and-billing';

const isSupportedImageFile = (file: File): boolean => {
  if (SUPPORTED_IMAGE_MIME_TYPES.has(file.type.toLowerCase())) {
    return true;
  }

  const extension = file.name.split('.').pop()?.toLowerCase();
  return extension ? SUPPORTED_IMAGE_EXTENSIONS.has(extension) : false;
};

const isUsageLimitExceededError = (message: string | null) =>
  message?.trim().toLowerCase() === USAGE_LIMIT_EXCEEDED_MESSAGE.toLowerCase();

const formatUserLocalTime = (date: Date) =>
  new Intl.DateTimeFormat(undefined, {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(date);

function VersaAIBadge() {
  return (
    <div className="flex shrink-0 items-center gap-[3.097px]">
      {/* "Powered by " label */}
      <p className="text-[14px] leading-[1.7] whitespace-nowrap text-black">
        Powered by
      </p>
      {/* Versa AI logo + wordmark */}
      <div className="flex shrink-0 items-center justify-center gap-[2.6px]">
        <VersaAIGradientFillIcon className="size-5!" />
        <div className="flex items-center gap-[1.733px] text-[17.33px] leading-none whitespace-nowrap text-[#18181a]">
          <span className="font-degular font-semibold">Versa</span>
          <span className="font-degular font-normal">AI</span>
        </div>
      </div>
    </div>
  );
}

type ChatInputProps = {
  onSend: (payload: ComposerPayload) => void;
  mediaType: GeneratedMediaType | null;
  onMediaTypeChange: (mediaType: GeneratedMediaType | null) => void;
  hideModeSelector?: boolean;
  disabled?: boolean;
  isSubmitting?: boolean;
};

type ChatInterfaceProps = {
  onPendingProcessChange?: (hasPending: boolean) => void;
};

function ChatInput({
  onSend,
  mediaType,
  onMediaTypeChange,
  hideModeSelector,
  disabled,
  isSubmitting,
}: ChatInputProps) {
  const [text, setText] = useState('');
  const [attachments, setAttachments] = useState<PendingAttachment[]>([]);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const plusInputRef = useRef<HTMLInputElement>(null);
  const unsentAttachmentsRef = useRef<PendingAttachment[]>([]);

  const revokeAttachmentUrl = useCallback((attachment: PendingAttachment) => {
    if (attachment.url.startsWith('blob:')) {
      URL.revokeObjectURL(attachment.url);
    }
  }, []);

  useEffect(() => {
    unsentAttachmentsRef.current = attachments;
  }, [attachments]);

  useEffect(() => {
    return () => {
      unsentAttachmentsRef.current.forEach(revokeAttachmentUrl);
    };
  }, [revokeAttachmentUrl]);

  const maxAttachments = mediaType === 'image' ? 1 : 2;
  const promptLengthError = useMemo(() => {
    if (mediaType) {
      return getCreativeStudioPromptLengthError(text, mediaType);
    }

    const trimmedText = text.trim();
    if (!trimmedText) return null;

    const maxPromptLimit = getCreativeStudioMaxPromptCharacterLimit();
    return trimmedText.length > maxPromptLimit
      ? `Prompt must be ${maxPromptLimit} characters or less before choosing image or video.`
      : null;
  }, [mediaType, text]);
  const promptCharacterLimit = mediaType
    ? getCreativeStudioPromptCharacterLimit(mediaType)
    : getCreativeStudioMaxPromptCharacterLimit();
  const visibleError = uploadError ?? promptLengthError;

  const handleModeChange = (nextMode: GeneratedMediaType | null) => {
    if (nextMode === 'image' && attachments.length > 1) {
      setAttachments((prev) => prev.slice(0, 1));
      setUploadError('Image mode supports only 1 image.');
    }
    onMediaTypeChange(nextMode);
  };

  const uploadFiles = useCallback(
    (files: File[]) => {
      if (files.length === 0) return;

      setUploadError(null);

      const supportedImageFiles = files.filter(isSupportedImageFile);
      if (supportedImageFiles.length !== files.length) {
        setUploadError(
          'Only image/jpeg, image/jpg, image/png, and image/webp are allowed.'
        );
      }

      const imageFiles = supportedImageFiles.filter(
        (file) => !getCreativeStudioImageFileSizeError(file)
      );
      if (imageFiles.length !== supportedImageFiles.length) {
        setUploadError(
          getCreativeStudioImageFileSizeError(
            supportedImageFiles.find((file) =>
              Boolean(getCreativeStudioImageFileSizeError(file))
            ) ?? supportedImageFiles[0]
          )
        );
      }

      if (attachments.length >= maxAttachments) {
        setUploadError(
          maxAttachments === 1
            ? 'Image mode supports only 1 image.'
            : 'You can upload maximum 2 images.'
        );
        return;
      }

      const remaining = maxAttachments - attachments.length;
      const acceptedFiles = imageFiles.slice(0, remaining);

      if (imageFiles.length > remaining) {
        setUploadError(
          maxAttachments === 1
            ? 'Image mode supports only 1 image. Extra files were ignored.'
            : 'You can upload maximum 2 images. Extra files were ignored.'
        );
      }

      if (acceptedFiles.length === 0) return;

      const nextAttachments: PendingAttachment[] = acceptedFiles.map(
        (file) => ({
          id: crypto.randomUUID(),
          file,
          name: file.name,
          url: URL.createObjectURL(file),
        })
      );

      setAttachments((prev) => [...prev, ...nextAttachments]);
    },
    [attachments.length, maxAttachments]
  );

  const handlePlusFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files ? Array.from(event.target.files) : [];
    event.target.value = '';
    uploadFiles(files);
  };

  const removeAttachment = (id: string) => {
    setAttachments((prev) => {
      const target = prev.find((item) => item.id === id);
      if (target) {
        revokeAttachmentUrl(target);
      }
      return prev.filter((item) => item.id !== id);
    });
  };

  const handleSend = () => {
    const trimmedText = text.trim();

    if (!trimmedText && attachments.length === 0) {
      setUploadError('Add a prompt or at least one image to continue.');
      return;
    }

    if (!trimmedText) {
      setUploadError('Please add a prompt before sending.');
      return;
    }

    if (promptLengthError) {
      setUploadError(promptLengthError);
      return;
    }

    if (mediaType === 'video' && attachments.length > 2) {
      setUploadError('Video mode supports maximum 2 images.');
      return;
    }

    if (mediaType === 'image' && attachments.length > 1) {
      setUploadError('Image mode supports only 1 image.');
      return;
    }

    if (disabled || isSubmitting) return;

    onSend({
      text: trimmedText,
      preferredMediaType: mediaType,
      attachments: attachments.map((attachment) => ({
        id: attachment.id,
        type: 'image',
        url: attachment.url,
        name: attachment.name,
        file: attachment.file,
      })),
    });

    setText('');
    setAttachments([]);
    setUploadError(null);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  const canSend =
    text.trim().length > 0 && !promptLengthError && !disabled && !isSubmitting;

  return (
    <div className="bg-neutral-gray-150 relative w-full rounded-[20px]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-[-0.5px] rounded-[20.5px] border border-solid border-[#f0f1f7]"
      />

      <div className="relative flex w-full flex-col items-start gap-[24px] p-[12px]">
        {attachments.length > 0 && (
          <div className="flex w-full flex-wrap gap-1">
            {attachments.map((attachment) => (
              <div
                key={attachment.id}
                className="group relative rounded-xl border border-[#d0d1d9] bg-white"
              >
                <img
                  src={attachment.url}
                  alt={attachment.name}
                  className="size-[54px] rounded-[11px] object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeAttachment(attachment.id)}
                  className="absolute -top-1 -right-1 flex size-5 cursor-pointer items-center justify-center rounded-full bg-[#18181A]"
                >
                  <Icon icon="lucide:x" className="size-3 text-white" />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex h-[48px] w-full items-start">
          <Input
            placeholder="Ask anything..."
            value={text}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setText(event.target.value);
              if (uploadError) {
                setUploadError(null);
              }
            }}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            containerClassName="w-full h-full"
            className="h-full! rounded-none! border-none! bg-transparent! px-0! py-0! text-[14px] shadow-none! ring-0! placeholder:text-[#797a80] focus:ring-0!"
          />
        </div>

        <div className="flex w-full items-center justify-between gap-3 text-[12px]">
          <div className="min-h-[18px] flex-1">
            {visibleError ? (
              <p className="text-[#c81e1e]">{visibleError}</p>
            ) : null}
          </div>
          <p
            className={promptLengthError ? 'text-[#c81e1e]' : 'text-[#797a80]'}
          >
            {text.trim().length}/{promptCharacterLimit}
          </p>
        </div>

        <div className="flex w-full shrink-0 items-start justify-between">
          <div className="flex shrink-0 items-center gap-[8px]">
            <button
              type="button"
              onClick={() => plusInputRef.current?.click()}
              disabled={disabled || attachments.length >= maxAttachments}
              className="flex w-8 shrink-0 cursor-pointer items-center justify-center gap-[4px] rounded-[8px] bg-white px-[8px] py-[6px] transition-colors hover:bg-[#f0f1f7] disabled:cursor-not-allowed disabled:opacity-50"
              title={`Add up to ${maxAttachments} image${maxAttachments > 1 ? 's' : ''}`}
            >
              <Icon icon="lucide:plus" className="size-4" />
            </button>

            {hideModeSelector ? null : mediaType ? (
              <button
                type="button"
                onClick={() => handleModeChange(null)}
                disabled={disabled}
                className="flex shrink-0 cursor-pointer items-center justify-center gap-1 rounded-[8px] bg-[#EAEBF1] px-[8px] py-[6px] text-sm leading-none font-semibold text-[#18181A] disabled:opacity-50"
                title="Clear selected mode"
              >
                <Icon
                  icon={
                    mediaType === 'image'
                      ? 'solar:gallery-outline'
                      : 'solar:videocamera-linear'
                  }
                  className="size-5"
                />
                <span className="text-sm leading-none font-semibold capitalize">
                  {mediaType === 'image' ? 'Image' : 'Video'}
                </span>
                <Icon icon="lucide:x" className="size-4" />
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => handleModeChange('image')}
                  disabled={disabled}
                  className="flex shrink-0 cursor-pointer items-center justify-center gap-1 rounded-[8px] bg-white px-[8px] py-[6px] text-sm leading-none font-semibold text-[#18181A] disabled:opacity-50"
                >
                  <Icon icon="solar:gallery-outline" className="size-5" />
                  <span>Image</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleModeChange('video')}
                  disabled={disabled}
                  className="flex shrink-0 cursor-pointer items-center justify-center gap-1 rounded-[8px] bg-white px-[8px] py-[6px] text-sm leading-none font-semibold text-[#18181A] disabled:opacity-50"
                >
                  <Icon icon="solar:videocamera-linear" className="size-5" />
                  <span>Video</span>
                </button>
              </>
            )}
          </div>

          <div className="flex shrink-0 items-center gap-[20px]">
            <VersaAIBadge />

            <button
              type="button"
              onClick={handleSend}
              disabled={!canSend}
              title="Send"
              className="flex h-[32px] w-[32px] flex-none shrink-0 grow-0 cursor-pointer flex-row items-center justify-center gap-[4px] rounded-[8px] bg-[#18181a] px-[8px] py-[6px] transition-colors enabled:hover:bg-[#333340] disabled:cursor-not-allowed disabled:bg-[#797a80]"
            >
              <Icon
                icon="solar:arrow-up-outline"
                className="size-7 text-[#FFF]"
              />
            </button>
          </div>
        </div>
      </div>

      <input
        ref={plusInputRef}
        type="file"
        accept={SUPPORTED_IMAGE_ACCEPT}
        multiple={maxAttachments > 1}
        className="hidden"
        onChange={handlePlusFileChange}
      />
    </div>
  );
}

function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === 'user';
  const time = formatUserLocalTime(message.timestamp);

  if (isUser) {
    return (
      <div className="flex items-end justify-end gap-3">
        <div className="flex max-w-[70%] flex-col items-end gap-2">
          {message.text && (
            <div className="bg-neutral-gray-150 rounded-[10px] border border-[#eaebf1] px-4 py-2 text-[14px] leading-tight text-[#313236]">
              {message.text}
            </div>
          )}
          {message.attachments && message.attachments.length > 0 && (
            <div className="flex flex-wrap justify-end gap-2">
              {message.attachments.map((attachment) => (
                <div
                  key={attachment.id}
                  className="max-w-[220px] overflow-hidden rounded-2xl border border-[#f0f1f7] shadow-sm"
                >
                  <img
                    src={attachment.url}
                    alt={attachment.name}
                    className="block size-full max-h-48 w-auto rounded-[12px] object-cover"
                  />
                </div>
              ))}
            </div>
          )}
          <p className="text-[10px] text-[#797a80]">{time}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-3">
      <div className="size-8 shrink-0" />
      <div className="flex max-w-[70%] flex-col gap-2">
        <div className="bg-neutral-gray-150 rounded-3xl rounded-tl-md border border-[#f0f1f7] px-4 py-3 text-[14px] leading-relaxed text-[#18181a]">
          {message.text}
        </div>
        <p className="text-[10px] text-[#797a80]">{time}</p>
      </div>
    </div>
  );
}

function StatusLineMessage({ message }: { message: Message }) {
  const variant = String(message.meta?.variant ?? 'progress');
  const time = formatUserLocalTime(message.timestamp);

  if (variant === 'plain') {
    return (
      <div className="flex flex-col items-start gap-2 px-[clamp(18px,2.1875vw,28px)]">
        <p className="text-[16px] leading-normal text-[#313236]">
          {message.text}
        </p>
        <p className="text-[10px] text-[#797a80]">{time}</p>
      </div>
    );
  }

  if (variant === 'gathering') {
    return (
      <div className="flex flex-col items-start gap-2 px-[clamp(18px,2.1875vw,28px)]">
        <div className="flex items-center gap-2">
          <img src="/Commverse.svg" alt="Commverse" className="size-5" />
          <p className="ai-status-gradient-text text-sm italic">
            {message.text}
          </p>
        </div>
      </div>
    );
  }

  if (variant === 'info-success' || variant === 'success') {
    return (
      <div className="flex flex-col items-start gap-2 px-[clamp(18px,2.1875vw,28px)]">
        <div className="flex items-center gap-2">
          <img src="/Commverse.svg" alt="Commverse" className="size-5" />
          <p className="text-sm font-medium text-[#18181a]">{message.text}</p>
          <Icon
            icon="solar:check-circle-outline"
            className="size-5 text-[#18181a]"
          />
        </div>
        <p className="text-[10px] text-[#797a80]">{time}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-start gap-2 px-[clamp(18px,2.1875vw,28px)]">
      <div className="flex items-center gap-2">
        <img src="/Commverse.svg" alt="Commverse" className="size-5" />
        <p className="ai-status-gradient-text text-sm italic">{message.text}</p>
      </div>
      <p className="text-[10px] text-[#797a80]">{time}</p>
    </div>
  );
}

function GenerationChoiceMessage({
  onCreateImage,
  onCreateVideo,
  disabled,
}: {
  onCreateImage: () => void;
  onCreateVideo: () => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex w-full flex-col items-start gap-4 px-[clamp(18px,2.1875vw,28px)]">
      <div className="flex items-center gap-2">
        <img src="/Commverse.svg" alt="Commverse" className="size-5" />
        <p className="text-sm font-medium text-[#18181A]">
          What would you like to generate?
        </p>
      </div>
      <div className="flex items-center gap-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
        >
          <path
            d="M5.42272 12H5.303C4.77458 12 4.33594 11.63 4.27212 11.1277C4.00998 9.0658 2.8064 7.43975 0.843726 7.07956C0.356928 6.99028 0 6.57194 0 6.07689V5.95356C0 5.42926 0.363464 5.0049 0.858175 4.92509C3.04498 4.57229 5.12514 2.92354 5.57461 0.834609C5.67816 0.353659 6.08549 0 6.57745 0H6.69717C7.2256 0 7.66423 0.370001 7.72805 0.87228C7.99019 2.9342 9.19377 4.56025 11.1564 4.92044C11.6432 5.00972 12.0002 5.42806 12.0002 5.92311V6.04644C12.0002 6.57074 11.6367 6.9951 11.142 7.07491C8.95519 7.42771 6.87503 9.07646 6.42556 11.1654C6.32201 11.6463 5.91468 12 5.42272 12Z"
            fill="#002DFF"
          />
        </svg>
        <p className="ai-status-gradient-text text-sm italic">
          Waiting for your input...
        </p>
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onCreateImage}
          disabled={disabled}
          className="font-metropolis cursor-pointer rounded-[10px] bg-[#f0f1f7] px-2 py-1.5 text-sm font-semibold text-[#18181a] transition-colors hover:bg-[#e4e5ef] disabled:cursor-not-allowed disabled:opacity-50"
        >
          Create an Image
        </button>
        <button
          type="button"
          onClick={onCreateVideo}
          disabled={disabled}
          className="font-metropolis cursor-pointer rounded-[10px] bg-[#f0f1f7] px-2 py-1.5 text-sm font-semibold text-[#18181a] transition-colors hover:bg-[#e4e5ef] disabled:cursor-not-allowed disabled:opacity-50"
        >
          Create a Video
        </button>
      </div>
    </div>
  );
}

function GenerationActionsMessage({
  regenerateCount,
  maxRegenerations,
  onRegenerate,
  onStartNewChat,
  disabled,
}: {
  regenerateCount: number;
  maxRegenerations: number;
  onRegenerate: () => void;
  onStartNewChat: () => void;
  disabled?: boolean;
}) {
  const remaining = Math.max(0, maxRegenerations - regenerateCount);

  return (
    <div className="flex w-full flex-col items-center justify-center gap-6 p-16">
      <div>
        <h3 className="leading-[38px font-metropolis text-center text-[32px] font-medium text-[#242426]">
          Ready to generate more?
        </h3>
        <p className="font-metropolis text-center text-[14px] text-[#48494d]">
          Regenerate this result or start a new prompt.
        </p>
      </div>
      <div className="flex items-center gap-3">
        {remaining > 0 && (
          <Button
            onClick={onRegenerate}
            disabled={disabled}
            variant="secondary"
            content="Regenerate"
          />
        )}
        <Button
          onClick={onStartNewChat}
          disabled={disabled}
          variant="tertiary"
          content="Start New Chat"
        />
      </div>
    </div>
  );
}

function buildPreparationMessages(payload: {
  mediaType: GeneratedMediaType;
  prompt: string;
  attachments: MediaAttachment[];
}): Message[] {
  const gatheringStatusId = crypto.randomUUID();
  const aiResponse = `Got it. I'll create a ${
    payload.mediaType === 'image' ? 'clean studio render' : 'product video'
  } based on your input.`;

  return [
    {
      id: crypto.randomUUID(),
      role: 'ai',
      kind: 'status',
      text: aiResponse,
      meta: { variant: 'plain' },
      timestamp: new Date(),
    },
    {
      id: gatheringStatusId,
      role: 'ai',
      kind: 'status',
      text: 'Gathering information...',
      meta: { variant: 'gathering' },
      timestamp: new Date(),
    },
    {
      id: crypto.randomUUID(),
      role: 'ai',
      kind: payload.mediaType === 'image' ? 'image-upload' : 'video-upload',
      text: '',
      attachments: payload.attachments,
      meta: {
        prompt: payload.prompt,
        gatheringStatusId,
      },
      timestamp: new Date(),
    },
  ];
}

function EmptyState({
  onSend,
  mediaType,
  onMediaTypeChange,
  hideModeSelector,
  isSubmitting,
}: {
  onSend: (payload: ComposerPayload) => void;
  mediaType: GeneratedMediaType | null;
  onMediaTypeChange: (mediaType: GeneratedMediaType | null) => void;
  hideModeSelector?: boolean;
  isSubmitting?: boolean;
}) {
  const { user } = useUser();

  return (
    <div className="flex size-full flex-col items-center justify-center pt-[24px] pr-[48px] pb-[128px] pl-[32px]">
      <div className="flex w-full flex-col items-center justify-center gap-8 px-12">
        <div className="flex size-15 items-center justify-center rounded-full bg-[#002DFF] text-white">
          <img src="/Commverse.svg" alt="Commverse" className="size-12" />
        </div>
        <div className="flex w-full items-center justify-center gap-[8px] text-center text-[32px] leading-[1.2] font-medium whitespace-nowrap text-[#18181a]">
          <p className="shrink-0">Hello,</p>
          <div className="flex shrink-0 items-center">
            <p className="shrink-0">{user.firstName}</p>
            <p className="shrink-0">!</p>
          </div>
        </div>

        <ChatInput
          onSend={onSend}
          mediaType={mediaType}
          onMediaTypeChange={onMediaTypeChange}
          hideModeSelector={hideModeSelector}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
}

export function AICreativeStudioNavbar({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="font-metropolis h-[88px] w-full shrink-0 border-b border-[#f0f1f7]">
      <div className="flex h-full items-center justify-between py-5 pr-12 pl-8">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1.5">
            <Icon
              icon="solar:magic-stick-3-linear"
              className="size-7 text-[#A74EFF]"
            />
            <span className="text-[24.89px]/[29px] whitespace-nowrap text-[#a74eff]">
              {title}
            </span>
          </div>
          <p className="text-[14px]/[17px] text-[#797a80]">{description}</p>
        </div>
        <Userprofile />
      </div>
    </div>
  );
}

export default function ChatInterface({
  onPendingProcessChange,
}: ChatInterfaceProps) {
  const navigate = useNavigate();
  const { chats, currentChatId, createNewChat, updateChatMessages, isLoading } =
    useChat();

  const [messages, setMessages] = useState<Message[]>([]);
  const [isProcessingMedia, setIsProcessingMedia] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [retryAction, setRetryAction] = useState<(() => void) | null>(null);
  const [selectedChoiceMessageIds, setSelectedChoiceMessageIds] = useState<
    Set<string>
  >(new Set());
  const [lastRequestByChat, setLastRequestByChat] = useState<
    Record<string, GenerationRequest>
  >({});
  const [composerMediaTypeByChat, setComposerMediaTypeByChat] = useState<
    Record<string, GeneratedMediaType | null>
  >({});
  const [regenerateCountByChat, setRegenerateCountByChat] = useState<
    Record<string, number>
  >({});
  const [isAddToProductModalOpen, setIsAddToProductModalOpen] = useState(false);
  const [pendingAddItem, setPendingAddItem] = useState<MediaItem | null>(null);
  const [isLinkingProduct, setIsLinkingProduct] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);
  const shouldShowUpgradeCta = isUsageLimitExceededError(apiError);

  useEffect(() => {
    if (!currentChatId) return;
    const contextChat = chats.find((chat) => chat.id === currentChatId);
    setMessages(contextChat?.messages ?? []);
  }, [chats, currentChatId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isProcessingMedia]);

  useEffect(() => {
    onPendingProcessChange?.(isProcessingMedia);
  }, [isProcessingMedia, onPendingProcessChange]);

  const syncMessages = useCallback(
    (chatId: string, nextMessages: Message[]) => {
      updateChatMessages(chatId, nextMessages);
    },
    [updateChatMessages]
  );

  const updateMessageText = useCallback(
    (
      chatId: string,
      messageId: string,
      text: string,
      metaPatch?: Record<string, unknown>
    ) => {
      setMessages((prev) => {
        const next = prev.map((message) =>
          message.id === messageId
            ? {
                ...message,
                text,
                ...(metaPatch
                  ? { meta: { ...(message.meta ?? {}), ...metaPatch } }
                  : {}),
              }
            : message
        );
        syncMessages(chatId, next);
        return next;
      });
    },
    [syncMessages]
  );

  const runGeneration = useCallback(
    async (
      request: GenerationRequest,
      options?: { triggerLabel?: 'Proceed' | 'Regenerate' }
    ): Promise<boolean> => {
      if (!currentChatId) return false;

      const promptLengthError = getCreativeStudioPromptLengthError(
        request.prompt,
        request.mediaType
      );
      if (promptLengthError) {
        setApiError(promptLengthError);
        setRetryAction(null);
        return false;
      }

      const chatId = currentChatId;

      setApiError(null);
      setRetryAction(null);
      setIsProcessingMedia(true);
      setLastRequestByChat((prev) => ({
        ...prev,
        [chatId]: request,
      }));

      const triggerMessage: Message = {
        id: crypto.randomUUID(),
        role: 'user',
        kind: 'text',
        text: options?.triggerLabel ?? 'Proceed',
        timestamp: new Date(),
      };

      const statusMessageId = crypto.randomUUID();
      const statusMessage: Message = {
        id: statusMessageId,
        role: 'ai',
        kind: 'status',
        text: `Generating ${request.mediaType}...`,
        meta: { variant: 'progress' },
        timestamp: new Date(),
      };

      setMessages((prev) => {
        const withoutActions = prev.filter(
          (message) => message.kind !== 'generation-actions'
        );
        const next = [...withoutActions, triggerMessage, statusMessage];
        syncMessages(chatId, next);
        return next;
      });

      try {
        const payload: GenerateMediaPayload = {
          mediaType: request.mediaType,
          images: request.files,
          prompt: request.prompt,
          aspectRatio: request.aspectRatio,
          ...(request.mediaType === 'video' && request.sampleCount !== undefined
            ? { sampleCount: request.sampleCount }
            : {}),
          imageMimeType: request.imageMimeType,
          endImageMimeType: request.endImageMimeType,
          durationSeconds: request.durationSeconds,
          resolution: request.resolution,
          useBrandMemory: request.useBrandMemory,
          brandId: request.brandId,
        };

        const imageRunCount =
          request.mediaType === 'image'
            ? Math.max(1, Math.min(4, request.sampleCount ?? 1))
            : 1;

        const queuedJobs = await Promise.all(
          Array.from({ length: imageRunCount }, () => generateMedia(payload))
        );

        updateMessageText(
          chatId,
          statusMessageId,
          imageRunCount > 1
            ? `Generating ${imageRunCount} images...`
            : `Generating ${request.mediaType}...`
        );

        let completedJobsCount = 0;
        const completedItems = await Promise.all(
          queuedJobs.map(async (queued) => {
            const completed = await waitForGeneratedMediaCompletion(
              queued.generatedMediaId,
              {
                onStatusChange: (status) => {
                  if (imageRunCount > 1) {
                    if (status === 'processing') {
                      updateMessageText(
                        chatId,
                        statusMessageId,
                        `Generating ${imageRunCount} images...`
                      );
                    }
                    return;
                  }

                  if (status === 'queued') {
                    updateMessageText(
                      chatId,
                      statusMessageId,
                      `Generating ${request.mediaType}...`
                    );
                  }

                  if (status === 'processing') {
                    updateMessageText(
                      chatId,
                      statusMessageId,
                      `${request.mediaType === 'image' ? 'Image' : 'Video'} is generating...`
                    );
                  }
                },
              }
            );

            completedJobsCount += 1;
            if (imageRunCount > 1) {
              updateMessageText(
                chatId,
                statusMessageId,
                `Generating ${imageRunCount} images... (${completedJobsCount}/${imageRunCount} ready)`
              );
            }

            return completed;
          })
        );

        const mediaItems: MediaAttachment[] = completedItems.flatMap(
          (completed) =>
            completed.outputs.map((output, index) => ({
              id: `${completed.id}-${index + 1}`,
              type: completed.mediaType,
              url: output.url,
              name: `${completed.mediaType}-${index + 1}.${output.format || (completed.mediaType === 'image' ? 'png' : 'mp4')}`,
              outputKey: output.key,
              generatedMediaId: completed.id,
            }))
        );

        setMessages((prev) => {
          const withoutActions = prev.filter(
            (message) => message.kind !== 'generation-actions'
          );

          const withSuccessStatus = withoutActions.map((message) =>
            message.id === statusMessageId
              ? {
                  ...message,
                  meta: { ...(message.meta ?? {}), variant: 'success' },
                  text:
                    request.mediaType === 'image'
                      ? imageRunCount > 1
                        ? `${mediaItems.length} Images Generated Successfully!`
                        : 'Image Generated Successfully!'
                      : 'Video Generated Successfully!',
                }
              : message
          );

          const responseMessage: Message = {
            id: crypto.randomUUID(),
            role: 'ai',
            kind: 'media-response',
            text: '',
            attachments: mediaItems,
            meta: {
              generatedMediaId: completedItems[0]?.id,
            },
            timestamp: new Date(),
          };

          const actionsMessage: Message = {
            id: crypto.randomUUID(),
            role: 'ai',
            kind: 'generation-actions',
            text: '',
            timestamp: new Date(),
          };

          const next = [...withSuccessStatus, responseMessage, actionsMessage];
          syncMessages(chatId, next);
          return next;
        });
        return true;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Media generation failed.';
        updateMessageText(chatId, statusMessageId, errorMessage);
        setApiError(errorMessage);
        if (isUsageLimitExceededError(errorMessage)) {
          setRetryAction(null);
        } else {
          setRetryAction(() => () => {
            void runGeneration(request);
          });
        }
        return false;
      } finally {
        setIsProcessingMedia(false);
      }
    },
    [currentChatId, syncMessages, updateMessageText]
  );

  const handleSend = useCallback(
    (payload: ComposerPayload) => {
      if (!currentChatId) return;

      setApiError(null);
      setRetryAction(null);
      const trimmedText = payload.text.trim();

      const userMessage: Message = {
        id: crypto.randomUUID(),
        role: 'user',
        kind: 'text',
        text: trimmedText,
        attachments: payload.attachments,
        meta: {
          preferredMediaType: payload.preferredMediaType,
        },
        timestamp: new Date(),
      };

      setMessages((prev) => {
        const next =
          payload.preferredMediaType === 'image' ||
          payload.preferredMediaType === 'video'
            ? [
                ...prev,
                userMessage,
                ...buildPreparationMessages({
                  mediaType: payload.preferredMediaType,
                  prompt: trimmedText,
                  attachments: payload.attachments,
                }),
              ]
            : [
                ...prev,
                userMessage,
                {
                  id: crypto.randomUUID(),
                  role: 'ai',
                  kind: 'generation-choice',
                  text: 'What would you like to generate?',
                  attachments: payload.attachments,
                  meta: {
                    prompt: trimmedText,
                  },
                  timestamp: new Date(),
                } satisfies Message,
              ];
        syncMessages(currentChatId, next);
        return next;
      });
    },
    [currentChatId, syncMessages]
  );

  const handleGenerationChoice = useCallback(
    (choiceMessageId: string, mediaType: GeneratedMediaType) => {
      if (!currentChatId) return;

      const choiceMessage = messages.find(
        (message) => message.id === choiceMessageId
      );
      if (!choiceMessage) return;

      const promptFromChoice =
        typeof choiceMessage.meta?.prompt === 'string'
          ? choiceMessage.meta.prompt
          : '';

      setMessages((prev) => {
        const next = [
          ...prev,
          ...buildPreparationMessages({
            mediaType,
            prompt: promptFromChoice,
            attachments: choiceMessage.attachments ?? [],
          }),
        ];
        syncMessages(currentChatId, next);
        return next;
      });

      setSelectedChoiceMessageIds((prev) => {
        const next = new Set(prev);
        next.add(choiceMessageId);
        return next;
      });
    },
    [currentChatId, messages, syncMessages]
  );

  const handleProceedImage = useCallback(
    async (seedMessage: Message, payload: ImageProceedPayload) => {
      const seedAttachments = seedMessage.attachments ?? [];
      const fallbackImage = seedAttachments[0]?.file ?? null;
      const imageFile = payload.imageFile ?? fallbackImage;

      if (!imageFile) {
        setApiError('Upload at least one image before proceeding.');
        return false;
      }

      const prompt = payload.instructions.trim();
      if (!prompt) {
        setApiError('Prompt is required.');
        return false;
      }

      const promptLengthError = getCreativeStudioPromptLengthError(
        prompt,
        'image'
      );
      if (promptLengthError) {
        setApiError(promptLengthError);
        return false;
      }

      if (
        currentChatId &&
        typeof seedMessage.meta?.gatheringStatusId === 'string'
      ) {
        updateMessageText(
          currentChatId,
          seedMessage.meta.gatheringStatusId,
          'Information Gathered Successfully!',
          { variant: 'info-success' }
        );
      }

      const aspectRatio = IMAGE_ASPECT_RATIO_MAP[payload.aspectRatio] ?? '1:1';

      const request: GenerationRequest = {
        mediaType: 'image',
        files: [imageFile],
        prompt,
        aspectRatio,
        sampleCount: Math.max(1, Math.min(4, payload.quantity)),
        imageMimeType: payload.format || undefined,
        useBrandMemory: payload.useBrandMemory,
        brandId: payload.brandId,
      };

      return await runGeneration(request, { triggerLabel: 'Proceed' });
    },
    [currentChatId, runGeneration, updateMessageText]
  );

  const handleProceedVideo = useCallback(
    async (seedMessage: Message, payload: VideoProceedPayload) => {
      const seedAttachments = seedMessage.attachments ?? [];
      const startFrameFile = payload.startFrameFile ?? seedAttachments[0]?.file;
      const endFrameFile = payload.endFrameFile ?? seedAttachments[1]?.file;

      if (!startFrameFile) {
        setApiError('At least one image is required to generate video.');
        return false;
      }

      const prompt = payload.instructions.trim();
      if (!prompt) {
        setApiError('Prompt is required.');
        return false;
      }

      const promptLengthError = getCreativeStudioPromptLengthError(
        prompt,
        'video'
      );
      if (promptLengthError) {
        setApiError(promptLengthError);
        return false;
      }

      if (
        currentChatId &&
        typeof seedMessage.meta?.gatheringStatusId === 'string'
      ) {
        updateMessageText(
          currentChatId,
          seedMessage.meta.gatheringStatusId,
          'Information Gathered Successfully!',
          { variant: 'info-success' }
        );
      }

      const files = [startFrameFile, endFrameFile].filter(
        (file): file is File => Boolean(file)
      );

      const aspectRatio = VIDEO_ASPECT_RATIO_MAP[payload.aspectRatio] ?? '16:9';

      const request: GenerationRequest = {
        mediaType: 'video',
        files,
        prompt,
        aspectRatio,
        sampleCount: 1,
        imageMimeType: startFrameFile.type || undefined,
        endImageMimeType: endFrameFile?.type || undefined,
        durationSeconds: Number(payload.duration),
        resolution: payload.resolution,
        useBrandMemory: payload.useBrandMemory,
        brandId: payload.brandId,
      };

      return await runGeneration(request, { triggerLabel: 'Proceed' });
    },
    [currentChatId, runGeneration, updateMessageText]
  );

  const handleDownloadOutput = useCallback(async (item: MediaItem) => {
    const defaultExtension = item.type === 'video' ? 'mp4' : 'png';
    const fileNameFromItem = item.name?.trim();

    const extensionFromUrl = (() => {
      try {
        const pathname = new URL(item.url).pathname;
        const ext = pathname.split('.').pop()?.toLowerCase();
        return ext && ext.length <= 5 ? ext : null;
      } catch {
        return null;
      }
    })();

    const extension =
      fileNameFromItem?.split('.').pop()?.toLowerCase() ||
      extensionFromUrl ||
      defaultExtension;

    const fileName = fileNameFromItem || `generated-${item.id}.${extension}`;

    try {
      const response = await fetch(item.url);
      if (!response.ok) {
        throw new Error(`Download failed with status ${response.status}`);
      }

      const blob = await response.blob();
      const objectUrl = window.URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = objectUrl;
      anchor.download = fileName;
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
      window.URL.revokeObjectURL(objectUrl);
      setApiError(null);
    } catch {
      const anchor = document.createElement('a');
      anchor.href = item.url;
      anchor.target = '_blank';
      anchor.rel = 'noopener noreferrer';
      anchor.download = fileName;
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
    }
  }, []);

  const handleAddToProduct = useCallback((item: MediaItem) => {
    const generatedMediaId = item.generatedMediaId;
    const outputKey = item.outputKey;

    if (!generatedMediaId || !outputKey) {
      setApiError('Unable to link this output to a product.');
      return;
    }

    setPendingAddItem(item);
    setIsAddToProductModalOpen(true);
  }, []);

  const handleSelectProductForAddToProduct = useCallback(
    async (product: ProductData) => {
      if (!pendingAddItem || isLinkingProduct) return false;

      const generatedMediaId = pendingAddItem.generatedMediaId;
      const outputKey = pendingAddItem.outputKey;

      if (!generatedMediaId || !outputKey) {
        setApiError('Unable to link this output to a product.');
        return false;
      }

      setIsLinkingProduct(true);
      try {
        await linkGeneratedMediaToProduct({
          generatedMediaId,
          outputKey,
          productId: product.id,
        });
        setApiError(null);
        setPendingAddItem(null);
        setIsAddToProductModalOpen(false);
        return true;
      } catch (error) {
        setApiError(
          error instanceof Error
            ? error.message
            : 'Failed to link media to product.'
        );
        return false;
      } finally {
        setIsLinkingProduct(false);
      }
    },
    [isLinkingProduct, pendingAddItem]
  );

  const handleRegenerate = useCallback(() => {
    if (!currentChatId) return;

    const maxRegenerations = 3;
    const currentCount = regenerateCountByChat[currentChatId] ?? 0;

    if (currentCount >= maxRegenerations) {
      setApiError('Maximum 3 regenerations are allowed in a single chat.');
      return;
    }

    const request = lastRequestByChat[currentChatId];
    if (!request) {
      setApiError('No generation found to regenerate in this chat.');
      return;
    }

    setRegenerateCountByChat((prev) => ({
      ...prev,
      [currentChatId]: currentCount + 1,
    }));

    void runGeneration(request, { triggerLabel: 'Regenerate' });
  }, [currentChatId, lastRequestByChat, regenerateCountByChat, runGeneration]);

  const handleStartNewChat = useCallback(() => {
    const newChatId = createNewChat();
    setApiError(null);
    setRetryAction(null);
    setSelectedChoiceMessageIds(new Set());
    setComposerMediaTypeByChat((prev) => ({
      ...prev,
      [newChatId]: null,
    }));
    setRegenerateCountByChat((prev) => ({
      ...prev,
      [newChatId]: 0,
    }));
  }, [createNewChat]);

  const handleCloseAddToProductModal = useCallback(() => {
    if (isLinkingProduct) return;
    setIsAddToProductModalOpen(false);
    setPendingAddItem(null);
  }, [isLinkingProduct]);

  const hasMessages = messages.length > 0;

  const currentRegenerationCount = useMemo(() => {
    if (!currentChatId) return 0;
    return regenerateCountByChat[currentChatId] ?? 0;
  }, [currentChatId, regenerateCountByChat]);
  const isRegenerationExhausted = currentRegenerationCount >= 3;

  const currentComposerMediaType = useMemo(() => {
    if (!currentChatId) return null;
    return composerMediaTypeByChat[currentChatId] ?? null;
  }, [composerMediaTypeByChat, currentChatId]);

  const hasPendingGenerationChoice = useMemo(() => {
    return messages.some(
      (message) =>
        message.kind === 'generation-choice' &&
        !selectedChoiceMessageIds.has(message.id)
    );
  }, [messages, selectedChoiceMessageIds]);

  const handleComposerMediaTypeChange = useCallback(
    (nextMediaType: GeneratedMediaType | null) => {
      if (!currentChatId) return;
      setComposerMediaTypeByChat((prev) => ({
        ...prev,
        [currentChatId]: nextMediaType,
      }));
    },
    [currentChatId]
  );

  if (isLoading) {
    return (
      <div className="flex size-full items-center justify-center bg-white">
        <p className="text-sm text-[#797a80]">Loading AI Creative Studio...</p>
      </div>
    );
  }

  return (
    <>
      <div className="font-metropolis flex size-full flex-col bg-white">
        {/* ── Navbar ── */}
        <AICreativeStudioNavbar
          title="AI Creative Studio"
          description="Create interactive 3D viewers for web and PDPs"
        />

        {/* ── Body ── */}
        {!hasMessages ? (
          /* Empty / welcome state — Figma layout */
          <div className="flex flex-1 overflow-hidden">
            <EmptyState
              onSend={handleSend}
              mediaType={currentComposerMediaType}
              onMediaTypeChange={handleComposerMediaTypeChange}
              hideModeSelector={hasPendingGenerationChoice}
              isSubmitting={isProcessingMedia}
            />
          </div>
        ) : (
          /* Chat mode */
          <div className="flex flex-1 flex-col overflow-hidden">
            {/* Messages scroll area */}
            <div className="flex-1 overflow-y-auto py-6 pr-[48px] pl-[32px]">
              <div className="mx-auto flex max-w-2xl flex-col gap-5">
                {messages.map((message) => {
                  if (message.kind === 'generation-choice') {
                    if (selectedChoiceMessageIds.has(message.id)) {
                      return null;
                    }

                    return (
                      <GenerationChoiceMessage
                        key={message.id}
                        onCreateImage={() =>
                          handleGenerationChoice(message.id, 'image')
                        }
                        onCreateVideo={() =>
                          handleGenerationChoice(message.id, 'video')
                        }
                        disabled={isProcessingMedia}
                      />
                    );
                  }

                  if (message.kind === 'image-upload') {
                    const initialAttachment = message.attachments?.[0];
                    const initialPrompt =
                      typeof message.meta?.prompt === 'string'
                        ? message.meta.prompt
                        : '';

                    return (
                      <ImageUploadMessage
                        key={message.id}
                        sentAt={message.timestamp}
                        initialImageFile={initialAttachment?.file ?? null}
                        initialImageUrl={initialAttachment?.url ?? null}
                        initialInstructions={initialPrompt}
                        onProceed={(payload) =>
                          handleProceedImage(message, payload)
                        }
                        isProceeding={isProcessingMedia}
                      />
                    );
                  }

                  if (message.kind === 'video-upload') {
                    const firstAttachment = message.attachments?.[0];
                    const secondAttachment = message.attachments?.[1];
                    const initialPrompt =
                      typeof message.meta?.prompt === 'string'
                        ? message.meta.prompt
                        : '';

                    return (
                      <VideoUploadMessage
                        key={message.id}
                        sentAt={message.timestamp}
                        initialStartFrameFile={firstAttachment?.file ?? null}
                        initialEndFrameFile={secondAttachment?.file ?? null}
                        initialStartFrameUrl={firstAttachment?.url ?? null}
                        initialEndFrameUrl={secondAttachment?.url ?? null}
                        initialInstructions={initialPrompt}
                        onProceed={(payload) =>
                          handleProceedVideo(message, payload)
                        }
                        isProceeding={isProcessingMedia}
                      />
                    );
                  }

                  if (message.kind === 'media-response') {
                    const items: MediaItem[] = (message.attachments ?? []).map(
                      (attachment) => ({
                        id: attachment.id,
                        url: attachment.url,
                        type: attachment.type,
                        name: attachment.name,
                        outputKey: attachment.outputKey,
                        generatedMediaId: attachment.generatedMediaId,
                      })
                    );

                    return (
                      <MediaResponseMessage
                        key={message.id}
                        sentAt={message.timestamp}
                        items={items}
                        onAddToProduct={handleAddToProduct}
                        onDownload={handleDownloadOutput}
                      />
                    );
                  }

                  if (message.kind === 'generation-actions') {
                    return (
                      <GenerationActionsMessage
                        key={message.id}
                        regenerateCount={currentRegenerationCount}
                        maxRegenerations={3}
                        onRegenerate={handleRegenerate}
                        onStartNewChat={handleStartNewChat}
                        disabled={isProcessingMedia}
                      />
                    );
                  }

                  if (message.kind === 'status') {
                    return (
                      <StatusLineMessage key={message.id} message={message} />
                    );
                  }

                  return <MessageBubble key={message.id} message={message} />;
                })}

                {apiError && (
                  <div className="bg-neutral-gray-150 rounded-xl border border-[#f0f1f7] p-3 text-[12px] text-[#48494d]">
                    <p>{apiError}</p>
                    {(retryAction || shouldShowUpgradeCta) && (
                      <button
                        type="button"
                        onClick={
                          shouldShowUpgradeCta
                            ? () => navigate(PRICING_PAGE_PATH)
                            : (retryAction ?? undefined)
                        }
                        className="mt-2 cursor-pointer rounded-md bg-[#18181a] px-2 py-1 text-[11px] text-white"
                      >
                        {shouldShowUpgradeCta ? 'Upgrade' : 'Retry'}
                      </button>
                    )}
                  </div>
                )}

                <div ref={bottomRef} />
              </div>
            </div>

            {/* Fixed bottom input — Figma: pl-[32px] pr-[48px] pb-[24px] */}
            {!isRegenerationExhausted && (
              <div className="shrink-0 border-t border-[#f0f1f7] bg-white pt-[16px] pr-[48px] pb-[24px] pl-[32px]">
                <div className="mx-auto max-w-2xl">
                  <ChatInput
                    onSend={handleSend}
                    mediaType={currentComposerMediaType}
                    onMediaTypeChange={handleComposerMediaTypeChange}
                    hideModeSelector={hasPendingGenerationChoice}
                    disabled={isProcessingMedia}
                    isSubmitting={isProcessingMedia}
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <ProductAssetAssignmentModal
        open={isAddToProductModalOpen}
        onClose={handleCloseAddToProductModal}
        products={[]}
        selectionMode="product-only"
        onProductSelect={handleSelectProductForAddToProduct}
        productFilters={[
          {
            label: 'Experiences',
            icon: <ExperienceFilterIcon className="size-4 text-[#18181A]" />,
            options: experienceOptions,
          },
          {
            label: 'Assets',
            icon: <Icon icon="solar:box-minimalistic-linear" />,
            options: assetOption,
          },
        ]}
      />
    </>
  );
}
