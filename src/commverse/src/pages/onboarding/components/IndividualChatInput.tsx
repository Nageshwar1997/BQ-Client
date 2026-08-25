// ─── Chat Input — matches Figma exactly ──────────────────────────────────────

import {
  Fragment,
  useCallback,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type ClipboardEvent,
  type DragEvent,
  type KeyboardEvent,
} from 'react';
import type { MediaAttachment } from '../../../types/chat';
import { Icon } from '@iconify/react';
import { AddIcon, VersaAIGradientFillIcon } from '../../../icons';
import TextArea from '../../../components/TextArea';
import type { IndividualStageTab } from '../components/IndividualOnboarding';
import type { OnboardingUrlValidationMode } from '../onboarding.utils';
import { isValidHttpUrl } from '../onboarding.utils';

// ─── Types ────────────────────────────────────────────────────────────────────
type PendingAttachment = MediaAttachment & {
  status: 'uploading' | 'uploaded' | 'error';
  error?: string;
};

export type UploadAsset = {
  id: string;
  url: string;
  name: string;
  type: 'image' | 'video';
  thumbnailUrl?: string;
  file?: File;
};

export const IMAGE_SLOT_COUNT = 2;

// ─── Icons ────────────────────────────────────────────────────────────────────

/** Versa AI badge — Figma exact */
function VersaAIBadge() {
  return (
    <div className="flex shrink-0 items-center gap-[3.097px]">
      {/* "Powered by " label */}
      <p
        className="text-[14px] leading-[1.7] whitespace-nowrap text-black"
        style={{ fontFamily: 'sans-serif' }}
      >
        Powered by
      </p>
      {/* Versa AI logo + wordmark */}
      <div className="flex shrink-0 items-center justify-center gap-[2.6px]">
        <VersaAIGradientFillIcon className="size-5!" />
        <div className="flex items-center gap-[1.733px] text-[17.33px] leading-none whitespace-nowrap text-[#18181a]">
          <span style={{ fontFamily: 'sans-serif', fontWeight: 600 }}>
            Versa
          </span>
          <span style={{ fontFamily: 'sans-serif' }}>AI</span>
        </div>
      </div>
    </div>
  );
}

type ChatInputProps = {
  onSend: (text: string, attachments: MediaAttachment[]) => void;
  onUploadAttachment: (file: File) => Promise<UploadAsset>;
  onUploadedAttachmentsChange?: (attachments: MediaAttachment[]) => void;
  onVideoUpload?: () => void;
  onImageUpload?: () => void;
  placeholder?: string;
  disabled?: boolean;
  isSubmitting?: boolean;
  className?: string;
  activeTab: IndividualStageTab;
  errorMessage?: string | null;
  resetSignal?: number;
  chipOnlyMode?: boolean;
  textEntryDisabled?: boolean;
  urlValidationMode?: OnboardingUrlValidationMode | null;
};

const IndividualChatInput = ({
  onSend,
  onUploadAttachment,
  onUploadedAttachmentsChange,
  placeholder = 'Ask anything...',
  disabled,
  isSubmitting,
  activeTab,
  errorMessage,
  resetSignal = 0,
  chipOnlyMode = false,
  textEntryDisabled = false,
  urlValidationMode = null,
  className = '',
}: ChatInputProps) => {
  const canUseAssets = activeTab !== 'beauty-try-on';
  const requiresTwoImages =
    activeTab === 'cloth-try-on' || activeTab === 'product-ad';
  const requiresPrompt = activeTab === 'product-ad';
  const isInputDisabled = Boolean(disabled || isSubmitting);
  const [text, setText] = useState('');
  const [attachments, setAttachments] = useState<
    Array<PendingAttachment | null>
  >(Array(IMAGE_SLOT_COUNT).fill(null));
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const [hasAttemptedInvalidUrlSubmit, setHasAttemptedInvalidUrlSubmit] =
    useState(false);
  const attachmentsRef = useRef<Array<PendingAttachment | null>>([]);
  const thumbInputRefs = useRef<Array<HTMLInputElement | null>>([]);

  const revokePreviewUrl = useCallback((attachment: MediaAttachment) => {
    if (attachment.file && attachment.url.startsWith('blob:')) {
      URL.revokeObjectURL(attachment.url);
    }
  }, []);

  const uploadFileForSlot = useCallback(
    async (slotIndex: number, file: File) => {
      if (!canUseAssets) return;
      if (!file.type.startsWith('image/')) {
        setUploadError('Only image files are supported.');
        return;
      }

      setUploadError(null);
      const placeholder: PendingAttachment = {
        id: crypto.randomUUID(),
        type: 'image',
        url: '',
        name: file.name,
        status: 'uploading',
      };

      setAttachments((prev) => {
        const current = prev[slotIndex];
        if (current) {
          revokePreviewUrl(current);
        }
        const updated = [...prev];
        updated[slotIndex] = placeholder;
        return updated;
      });

      try {
        const uploaded = await onUploadAttachment(file);
        setAttachments((prev) => {
          const updated = [...prev];
          if (updated[slotIndex]?.id === placeholder.id) {
            updated[slotIndex] = {
              ...placeholder,
              id: uploaded.id,
              url: uploaded.url,
              name: uploaded.name,
              type: uploaded.type,
              file: uploaded.file,
              status: 'uploaded',
            };
          }
          return updated;
        });
      } catch (error) {
        const message =
          error instanceof Error ? error.message : 'Upload failed';
        setAttachments((prev) => {
          const updated = [...prev];
          if (updated[slotIndex]?.id === placeholder.id) {
            updated[slotIndex] = {
              ...placeholder,
              status: 'error',
              error: message,
            };
          }
          return updated;
        });
        setUploadError(message);
      }
    },
    [canUseAssets, onUploadAttachment, revokePreviewUrl]
  );

  function removeAttachmentFromSlot(slotIndex: number) {
    setAttachments((prev) => {
      const current = prev[slotIndex];
      if (current) {
        revokePreviewUrl(current);
      }
      const updated = [...prev];
      updated[slotIndex] = null;
      return updated;
    });
  }

  function onThumbAdd(slotIndex: number) {
    if (isInputDisabled || !canUseAssets) return;
    thumbInputRefs.current[slotIndex]?.click();
  }

  function onThumbFile(e: ChangeEvent<HTMLInputElement>, slotIndex: number) {
    if (!canUseAssets) return;
    const file = e.target.files?.[0];
    if (!file) return;
    void uploadFileForSlot(slotIndex, file);
    e.currentTarget.value = '';
  }

  function handleSend() {
    if (chipOnlyMode || textEntryDisabled) return;
    const uploadedAttachments = (canUseAssets ? attachments : []).filter(
      (attachment): attachment is PendingAttachment =>
        attachment?.status === 'uploaded'
    );
    const hasRequiredImages =
      !requiresTwoImages || uploadedAttachments.length >= IMAGE_SLOT_COUNT;
    const hasRequiredPrompt = !requiresPrompt || text.trim().length > 0;
    if ((!text.trim() && uploadedAttachments.length === 0) || disabled) return;
    if (!hasRequiredImages || !hasRequiredPrompt) return;
    if (urlValidationMode && text.trim().length > 0 && !isValidHttpUrl(text)) {
      setHasAttemptedInvalidUrlSubmit(true);
      return;
    }
    onSend(text.trim(), uploadedAttachments);
    setText('');
    setAttachments(Array(IMAGE_SLOT_COUNT).fill(null));
    setUploadError(null);
    setHasAttemptedInvalidUrlSubmit(false);
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (chipOnlyMode || textEntryDisabled) return;
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  const hasUploadingAttachments = attachments.some(
    (attachment) => attachment?.status === 'uploading'
  );
  const hasFailedAttachments = attachments.some(
    (attachment) => attachment?.status === 'error'
  );
  const uploadedAttachmentCount = attachments.filter(
    (attachment) => attachment?.status === 'uploaded'
  ).length;
  const hasRequiredImages =
    !requiresTwoImages || uploadedAttachmentCount >= IMAGE_SLOT_COUNT;
  const hasRequiredPrompt = !requiresPrompt || text.trim().length > 0;
  const urlValidationError =
    hasAttemptedInvalidUrlSubmit &&
    urlValidationMode &&
    text.trim().length > 0 &&
    !isValidHttpUrl(text)
      ? urlValidationMode === 'website'
        ? 'Please enter a valid website URL.'
        : 'Please enter a valid product URL.'
      : null;

  const canSend =
    !chipOnlyMode &&
    !textEntryDisabled &&
    hasRequiredImages &&
    hasRequiredPrompt &&
    (text.trim().length > 0 || (canUseAssets && uploadedAttachmentCount > 0)) &&
    !disabled &&
    !isSubmitting &&
    !hasUploadingAttachments &&
    !hasFailedAttachments;

  function handleDragOver(e: DragEvent<HTMLDivElement>) {
    if (isInputDisabled || !canUseAssets) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    setIsDragActive(true);
  }

  function handleDragLeave(e: DragEvent<HTMLDivElement>) {
    if (e.currentTarget.contains(e.relatedTarget as Node)) return;
    setIsDragActive(false);
  }

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    if (isInputDisabled || !canUseAssets) return;
    e.preventDefault();
    setIsDragActive(false);

    const imageFiles = Array.from(e.dataTransfer.files).filter((file) =>
      file.type.startsWith('image/')
    );

    if (imageFiles.length === 0) {
      setUploadError('Only image files can be dropped here.');
      return;
    }

    const emptySlots = attachments
      .map((attachment, index) => (attachment === null ? index : null))
      .filter((index): index is number => index !== null);

    if (emptySlots.length === 0) {
      setUploadError('Both image slots are already filled.');
      return;
    }

    const filesToUpload = imageFiles.slice(0, emptySlots.length);
    filesToUpload.forEach((file, index) => {
      const slotIndex = emptySlots[index];
      void uploadFileForSlot(slotIndex, file);
    });

    if (imageFiles.length > emptySlots.length) {
      setUploadError('Only two images are allowed.');
    }
  }

  function handlePaste(e: ClipboardEvent<HTMLTextAreaElement>) {
    if (isInputDisabled || !canUseAssets) return;

    const imageFiles = Array.from(e.clipboardData.items)
      .filter((item) => item.type.startsWith('image/'))
      .map((item) => item.getAsFile())
      .filter((file): file is File => file !== null);

    if (imageFiles.length === 0) return;

    e.preventDefault();

    const emptySlots = attachments
      .map((attachment, index) => (attachment === null ? index : null))
      .filter((index): index is number => index !== null);

    if (emptySlots.length === 0) {
      setUploadError('Both image slots are already filled.');
      return;
    }

    const filesToUpload = imageFiles.slice(0, emptySlots.length);
    filesToUpload.forEach((file, index) => {
      const slotIndex = emptySlots[index];
      void uploadFileForSlot(slotIndex, file);
    });

    if (imageFiles.length > emptySlots.length) {
      setUploadError('Only two images are allowed.');
    }
  }

  useEffect(() => {
    attachmentsRef.current = attachments;
  }, [attachments]);

  useEffect(() => {
    const uploadedAttachments = (canUseAssets ? attachments : []).filter(
      (attachment): attachment is PendingAttachment =>
        attachment?.status === 'uploaded'
    );
    onUploadedAttachmentsChange?.(uploadedAttachments);
  }, [attachments, canUseAssets, onUploadedAttachmentsChange]);

  useEffect(() => {
    setText('');
    setAttachments(Array(IMAGE_SLOT_COUNT).fill(null));
    setUploadError(null);
  }, [resetSignal]);

  useEffect(() => {
    return () => {
      attachmentsRef.current
        .filter(
          (attachment): attachment is PendingAttachment => attachment !== null
        )
        .forEach(revokePreviewUrl);
    };
  }, [revokePreviewUrl]);

  return (
    <div
      className={`focus-within:bg-gradient-versa rounded-[20px] p-px ${canUseAssets && isDragActive ? 'bg-gradient-versa' : 'bg-neutral-gray-200'}`}
    >
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`bg-neutral-gray-150 mx-auto w-full rounded-[19px] shadow-[0_8px_24px_rgba(24,24,26,0.08)] ${className}`}
      >
        <div className="relative flex w-full flex-col items-start gap-6 p-3">
          {canUseAssets && isDragActive && (
            <div className="bg-neutral-gray-150/95 absolute inset-0 z-10 flex items-center justify-center rounded-[20px]">
              <p className="text-[14px] font-medium text-[#18181a]">
                Drop an image to upload
              </p>
            </div>
          )}
          {activeTab !== 'beauty-try-on' && (
            <div className="flex justify-center gap-2">
              {Array.from({ length: 2 }).map((_, idx) => {
                const attachment = attachments[idx];
                return (
                  <Fragment key={idx}>
                    <div
                      onClick={() => onThumbAdd(idx)}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => {
                        if (isInputDisabled) return;
                        e.preventDefault();
                        e.stopPropagation();
                        const file = e.dataTransfer.files?.[0];
                        if (!file) return;
                        void uploadFileForSlot(idx, file);
                      }}
                      className={`bg-neutral-gray-300 border-neutral-gray-400 relative flex size-11 items-center justify-center overflow-hidden rounded-lg border-[1.5px] ${isInputDisabled
                        ? 'cursor-not-allowed opacity-70'
                        : 'cursor-pointer'
                        }`}
                    >
                      {attachment?.status === 'uploading' ? (
                        <span className="text-[9px] text-[#797a80]">...</span>
                      ) : attachment?.status === 'uploaded' ? (
                        <>
                          <img
                            src={attachment.url}
                            alt={attachment.name}
                            className="size-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              removeAttachmentFromSlot(idx);
                            }}
                            className="absolute top-0 right-0 flex size-4 items-center justify-center rounded-full bg-[#18181a]/80"
                          >
                            <Icon
                              icon="lucide:x"
                              className="size-3 text-white"
                            />
                          </button>
                        </>
                      ) : attachment?.status === 'error' ? (
                        <span className="text-ui-error text-[9px]">!</span>
                      ) : (
                        <AddIcon className="stroke-neutral-gray-600 size-6" />
                      )}
                    </div>
                    <input
                      ref={(el) => {
                        thumbInputRefs.current[idx] = el;
                      }}
                      type="file"
                      accept="image/*"
                      onChange={(e) => onThumbFile(e, idx)}
                      className="hidden"
                    />
                  </Fragment>
                );
              })}
            </div>
          )}
          {(uploadError || urlValidationError || errorMessage) && (
            <p className="text-ui-error text-xs">
              {uploadError || urlValidationError || errorMessage}
            </p>
          )}
          <TextArea
            placeholder={placeholder}
            value={text}
            rows={5}
            onChange={(e) => {
              setText(e.target.value);
              if (hasAttemptedInvalidUrlSubmit) {
                setHasAttemptedInvalidUrlSubmit(false);
              }
            }}
            onKeyDown={handleKeyDown}
            onPaste={handlePaste}
            disabled={disabled || chipOnlyMode || textEntryDisabled}
            readOnly={chipOnlyMode || textEntryDisabled}
            containerClassName="w-full h-full"
            className="h-16! resize-none! rounded-none! border-none! bg-transparent! px-0! py-0! text-sm shadow-none! ring-0! outline-none! placeholder:text-[#797a80] focus:ring-0!"
          />
          <div className="-mt-4 flex w-full shrink-0 items-start justify-end">
            {/* RHS — gap-[20px] */}
            <div className="flex shrink-0 items-center gap-[20px]">
              <VersaAIBadge />
                <button
                  type="button"
                  onClick={handleSend}
                  disabled={!canSend || chipOnlyMode || textEntryDisabled}
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
      </div>
    </div>
  );
};

export default IndividualChatInput;
