import { useEffect, useMemo, useState } from 'react';
import { Icon } from '@iconify/react';

export type MediaItem = {
  id: string;
  url: string;
  type: 'image' | 'video';
  name?: string;
  outputKey?: string;
  generatedMediaId?: string;
};

type MediaResponseMessageProps = {
  sentAt?: Date | string | number;
  time?: string;
  showTime?: boolean;
  items: MediaItem[];
  onAddToProduct?: (item: MediaItem) => void;
  onDownload?: (item: MediaItem) => void;
  className?: string;
};

const formatUserLocalTime = (date: Date) =>
  new Intl.DateTimeFormat(undefined, {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(date);

function MediaCard({
  item,
  // onAddToProduct,
  onDownload,
  onOpenPreview,
}: {
  item: MediaItem;
  // onAddToProduct?: (item: MediaItem) => void;
  onDownload?: (item: MediaItem) => void;
  onOpenPreview: (item: MediaItem) => void;
}) {
  return (
    <div className="flex shrink-0 flex-col items-start gap-[8px]">
      <button
        type="button"
        onClick={() => onOpenPreview(item)}
        className="relative size-[200px] shrink-0 cursor-zoom-in overflow-hidden rounded-[20px] border border-[#eaebf1] bg-white"
      >
        {item.type === 'video' ? (
          <>
            <video
              src={item.url}
              className="size-full object-cover"
              playsInline
              muted
              preload="metadata"
            />
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/10">
              <Icon
                icon="material-symbols:play-circle-rounded"
                className="size-10 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]"
              />
            </div>
          </>
        ) : (
          <img
            alt="Generated media"
            className="size-full object-cover"
            src={item.url}
          />
        )}
      </button>

      <div className="flex items-center gap-[12px]">
        {/* <button
          type="button"
          onClick={() => onAddToProduct?.(item)}
          className="flex cursor-pointer items-center gap-[2px] rounded-[12px] transition-opacity hover:opacity-70"
        >
          <Icon icon="solar:box-minimalistic-linear" className="size-4" />
          <p className="text-[12px] leading-[1.3] whitespace-nowrap text-[#48494d]">
            Add to Product
          </p>
        </button> */}

        <button
          type="button"
          onClick={() => onDownload?.(item)}
          className="flex cursor-pointer items-center gap-[2px] rounded-[12px] transition-opacity hover:opacity-70"
        >
          <Icon icon="solar:download-minimalistic-linear" className="size-4" />
          <p className="text-[12px] leading-[1.3] whitespace-nowrap text-[#48494d]">
            Download
          </p>
        </button>
      </div>
    </div>
  );
}

export default function MediaResponseMessage({
  sentAt,
  time,
  showTime = true,
  items,
  // onAddToProduct,
  onDownload,
  className = '',
}: MediaResponseMessageProps) {
  const [feedback, setFeedback] = useState<'up' | 'down' | null>(null);
  const [previewItem, setPreviewItem] = useState<MediaItem | null>(null);

  const resolvedTime = useMemo(() => {
    return time ?? formatUserLocalTime(sentAt ? new Date(sentAt) : new Date());
  }, [sentAt, time]);

  useEffect(() => {
    if (!previewItem) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setPreviewItem(null);
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [previewItem]);

  if (items.length === 0) {
    return null;
  }

  return (
    <div
      className={`flex w-full flex-col items-start ${className}`}
      data-name="Media Response Message"
    >
      <div className="flex flex-col items-start gap-2 px-[clamp(18px,2.1875vw,28px)]">
        <div className="flex flex-col items-start gap-[20px]">
          <div className="flex flex-wrap items-start gap-[8px]">
            {items.map((item) => (
              <MediaCard
                key={item.id}
                item={item}
                // onAddToProduct={onAddToProduct}
                onDownload={onDownload}
                onOpenPreview={setPreviewItem}
              />
            ))}
          </div>

          <div className="flex items-center gap-1">
            <p className="font-metropolis text-[12px]/[18px] whitespace-nowrap text-[#48494d]">
              How was the result?
            </p>
            <Icon
              onClick={() =>
                setFeedback((prev) => (prev === 'up' ? null : 'up'))
              }
              icon={`${feedback === 'up' ? 'solar:like-bold' : 'solar:like-broken'}`}
              className="m-2 size-5 cursor-pointer"
            />
            <Icon
              onClick={() =>
                setFeedback((prev) => (prev === 'down' ? null : 'down'))
              }
              icon={`${feedback === 'down' ? 'solar:dislike-bold' : 'solar:dislike-broken'}`}
              className="m-2 size-5 cursor-pointer"
            />
          </div>
        </div>

        {showTime && (
          <p className="text-[10px] leading-[13.5px] text-[#797a80]">
            {resolvedTime}
          </p>
        )}
      </div>

      {previewItem && (
        <div
          className="fixed inset-0 z-[90] flex items-center justify-center bg-black/70 p-6"
          onClick={() => setPreviewItem(null)}
        >
          <button
            type="button"
            aria-label="Close full view"
            className="absolute top-6 right-6 flex size-11 items-center justify-center rounded-full bg-white text-[#18181a] shadow-md transition-colors hover:bg-[#f4f5f9]"
            onClick={() => setPreviewItem(null)}
          >
            <Icon icon="lucide:x" className="size-5" />
          </button>

          <div
            className="relative max-h-[85vh] max-w-[85vw] overflow-hidden rounded-[20px] bg-white"
            onClick={(event) => event.stopPropagation()}
          >
            {previewItem.type === 'video' ? (
              <video
                src={previewItem.url}
                className="max-h-[85vh] max-w-[85vw] object-contain"
                controls
                autoPlay
                playsInline
              />
            ) : (
              <img
                src={previewItem.url}
                alt="Generated media full view"
                className="max-h-[85vh] max-w-[85vw] object-contain"
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
