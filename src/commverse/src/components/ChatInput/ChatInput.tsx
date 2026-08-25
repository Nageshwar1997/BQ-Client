// ─── Chat Input — matches Figma exactly ──────────────────────────────────────

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type DragEvent,
  type KeyboardEvent,
} from 'react';
import type { MediaAttachment } from '../../types/chat';
import { Icon } from '@iconify/react';
import { VersaAIGradientFillIcon } from '../../icons';
import TextArea from '../TextArea';
import type { OnboardingUrlValidationMode } from '../../pages/onboarding/onboarding.utils';
import { isValidHttpUrl } from '../../pages/onboarding/onboarding.utils';

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
  onVideoUpload?: () => void;
  onImageUpload?: () => void;
  placeholder?: string;
  disabled?: boolean;
  isSubmitting?: boolean;
  errorMessage?: string | null;
  className?: string;
  urlValidationMode?: OnboardingUrlValidationMode | null;
};

const ChatInput = ({
  onSend,
  onUploadAttachment,
  placeholder = 'Ask anything...',
  disabled,
  isSubmitting,
  errorMessage,
  className = '',
  urlValidationMode = null,
}: ChatInputProps) => {
  const [text, setText] = useState('');
  const [attachments, setAttachments] = useState<PendingAttachment[]>([]);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const [hasAttemptedInvalidUrlSubmit, setHasAttemptedInvalidUrlSubmit] =
    useState(false);
  const attachmentsRef = useRef<PendingAttachment[]>([]);

  const revokePreviewUrl = useCallback((attachment: MediaAttachment) => {
    if (attachment.file && attachment.url.startsWith('blob:')) {
      URL.revokeObjectURL(attachment.url);
    }
  }, []);

  const uploadFiles = useCallback(
    async (files: File[]) => {
      if (files.length === 0) return;
      setUploadError(null);

      const placeholders: PendingAttachment[] = files.map((file) => ({
        id: crypto.randomUUID(),
        type: file.type.startsWith('video/') ? 'video' : 'image',
        url: '',
        name: file.name,
        status: 'uploading',
      }));

      setAttachments((prev) => [...prev, ...placeholders]);

      await Promise.all(
        placeholders.map(async (placeholder, index) => {
          const file = files[index];
          try {
            const uploaded = await onUploadAttachment(file);
            setAttachments((prev) =>
              prev.map((attachment) =>
                attachment.id === placeholder.id
                  ? {
                      ...attachment,
                      id: uploaded.id,
                      url: uploaded.url,
                      name: uploaded.name,
                      type: uploaded.type,
                      file: uploaded.file,
                      status: 'uploaded',
                    }
                  : attachment
              )
            );
          } catch (error) {
            const message =
              error instanceof Error ? error.message : 'Upload failed';
            setAttachments((prev) =>
              prev.map((attachment) =>
                attachment.id === placeholder.id
                  ? { ...attachment, status: 'error', error: message }
                  : attachment
              )
            );
            setUploadError(message);
          }
        })
      );
    },
    [onUploadAttachment]
  );

  function removeAttachment(id: string) {
    setAttachments((prev) => {
      const attachmentToRemove = prev.find(
        (attachment) => attachment.id === id
      );
      if (attachmentToRemove) {
        revokePreviewUrl(attachmentToRemove);
      }

      return prev.filter((attachment) => attachment.id !== id);
    });
  }

  function handleSend() {
    const uploadedAttachments = attachments.filter(
      (attachment) => attachment.status === 'uploaded'
    );
    if ((!text.trim() && uploadedAttachments.length === 0) || disabled) return;
    if (urlValidationMode && text.trim().length > 0 && !isValidHttpUrl(text)) {
      setHasAttemptedInvalidUrlSubmit(true);
      return;
    }
    onSend(text.trim(), uploadedAttachments);
    uploadedAttachments.forEach(revokePreviewUrl);
    setText('');
    setAttachments([]);
    setUploadError(null);
    setHasAttemptedInvalidUrlSubmit(false);
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  const hasUploadingAttachments = attachments.some(
    (attachment) => attachment.status === 'uploading'
  );
  const hasFailedAttachments = attachments.some(
    (attachment) => attachment.status === 'error'
  );
  const isInputDisabled = Boolean(disabled || isSubmitting);
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
    (text.trim().length > 0 || attachments.length > 0) &&
    !isInputDisabled &&
    !hasUploadingAttachments &&
    !hasFailedAttachments;

  function handleDragOver(e: DragEvent<HTMLDivElement>) {
    if (isInputDisabled) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    setIsDragActive(true);
  }

  function handleDragLeave(e: DragEvent<HTMLDivElement>) {
    if (e.currentTarget.contains(e.relatedTarget as Node)) return;
    setIsDragActive(false);
  }

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    if (isInputDisabled) return;
    e.preventDefault();
    setIsDragActive(false);

    const imageFiles = Array.from(e.dataTransfer.files).filter((file) =>
      file.type.startsWith('image/')
    );

    if (imageFiles.length === 0) {
      setUploadError('Only image files can be dropped here.');
      return;
    }

    void uploadFiles(imageFiles);
  }

  useEffect(() => {
    attachmentsRef.current = attachments;
  }, [attachments]);

  useEffect(() => {
    return () => {
      attachmentsRef.current.forEach(revokePreviewUrl);
    };
  }, [revokePreviewUrl]);

  return (
    /* Figma: bg-[#f7f8fa] rounded-[20px] border border-[#f0f1f7] relative */
    <div
      className={`rounded-[20px] p-px ${isInputDisabled ? 'bg-neutral-gray-200' : 'bg-gradient-versa'}`}
    >
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`bg-neutral-gray-150 mx-auto w-full rounded-[19px] shadow-[0_8px_24px_rgba(24,24,26,0.08)] ${className}`}
      >
        <div className="relative flex w-full flex-col items-start gap-6 p-3">
          {isDragActive && (
            <div className="bg-neutral-gray-150/95 absolute inset-0 z-10 flex items-center justify-center rounded-[20px]">
              <p className="text-[14px] font-medium text-[#18181a]">
                Drop an image to upload
              </p>
            </div>
          )}
          {/* ── Attachment previews (bonus, not in Figma but needed) ── */}
          {attachments.length > 0 && (
            <div className="flex w-full flex-wrap gap-2">
              {attachments.map((att) => (
                <div
                  key={att.id}
                  className="group relative overflow-hidden rounded-xl"
                >
                  {att.status === 'uploading' ? (
                    <div className="flex h-16 w-24 flex-col items-center justify-center gap-1 rounded-xl bg-[#e2e3ea] px-2">
                      <span className="text-neutral-gray-700 text-[10px]">
                        Uploading...
                      </span>
                      <span className="text-neutral-gray-600 max-w-[80px] truncate text-[10px]">
                        {att.name}
                      </span>
                    </div>
                  ) : att.status === 'error' ? (
                    <div className="flex h-16 w-24 flex-col items-center justify-center gap-1 rounded-xl bg-[#ffecec] px-2">
                      <span className="text-ui-error text-[10px]">Failed</span>
                      <span className="text-ui-error max-w-[80px] truncate text-[10px]">
                        {att.name}
                      </span>
                    </div>
                  ) : att.type === 'image' ? (
                    <img
                      src={att.url}
                      alt={att.name}
                      className="h-16 w-auto rounded-xl object-cover"
                    />
                  ) : (
                    <div className="flex h-16 w-24 flex-col items-center justify-center gap-1 rounded-xl bg-[#18181a]">
                      <Icon
                        icon="solar:videocamera-linear"
                        className="size-4"
                      />

                      <span className="max-w-[80px] truncate px-1 text-[10px] text-white">
                        {att.name}
                      </span>
                    </div>
                  )}
                  <button
                    onClick={() => removeAttachment(att.id)}
                    className="absolute top-1 right-1 flex size-5 cursor-pointer items-center justify-center rounded-full bg-[#18181a]/80 opacity-0 transition-opacity group-hover:opacity-100"
                  >
                    <Icon icon="lucide:x" />
                  </button>
                </div>
              ))}
            </div>
          )}
          {(uploadError || urlValidationError || errorMessage) && (
            <p className="text-ui-error text-xs">
              {uploadError || urlValidationError || errorMessage}
            </p>
          )}

          {/* ── Text input — Figma: h-[48px], 14px, #797a80 placeholder ── */}

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
            disabled={disabled}
            containerClassName="w-full h-full"
            className="h-16! resize-none! rounded-none! border-none! bg-transparent! px-0! py-0! text-sm shadow-none! ring-0! outline-none! placeholder:text-[#797a80] focus:ring-0!"
          />

          {/* ── Footer — Figma: justify-between ── */}
          <div className="-mt-4 flex w-full shrink-0 items-start justify-end">
            {/* RHS — gap-[20px] */}
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
      </div>
    </div>
  );
};

export default ChatInput;
