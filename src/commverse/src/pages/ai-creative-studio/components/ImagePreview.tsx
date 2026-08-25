import { useEffect, useRef, useState } from 'react';
// import { ImageWithFallback } from './figma/ImageWithFallback';
import { Icon } from '@iconify/react';
import Button from '../../../components/Button';
import { ImageWithFallback } from '../context/ImageWithFallback';

type LibraryItem = {
  id: string;
  url: string;
  type: 'image' | 'video';
  outputKey: string;
  generatedMediaId: string;
  linkedProductId: string | null;
  linkedProductName: string | null;
};

type ImagePreviewProps = {
  items: LibraryItem[];
  initialIndex: number;
  onClose: () => void;
  onUnlink?: (item: LibraryItem) => Promise<void> | void;
  onAddToProduct?: (item: LibraryItem) => void;
  onDelete?: (item: LibraryItem) => Promise<void> | void;
  isUnlinking?: boolean;
  isDeleting?: boolean;
};

export function ImagePreview({
  items,
  initialIndex,
  onClose,
  onUnlink,
  // onAddToProduct,
  onDelete,
  isUnlinking,
  isDeleting,
}: ImagePreviewProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const thumbnailRailRef = useRef<HTMLDivElement | null>(null);
  const thumbnailButtonRefs = useRef<Array<HTMLButtonElement | null>>([]);

  // Sync index if initialIndex changes
  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex]);

  // Handle ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  useEffect(() => {
    const rail = thumbnailRailRef.current;
    const activeThumbnail = thumbnailButtonRefs.current[currentIndex];
    if (!rail || !activeThumbnail) return;

    const railRect = rail.getBoundingClientRect();
    const thumbRect = activeThumbnail.getBoundingClientRect();
    const targetDelta =
      thumbRect.left -
      railRect.left -
      (railRect.width / 2 - thumbRect.width / 2);

    rail.scrollBy({ left: targetDelta, behavior: 'smooth' });
  }, [currentIndex, items.length]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : items.length - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < items.length - 1 ? prev + 1 : 0));
  };

  const handleDownload = async () => {
    const currentItem = items[currentIndex];
    try {
      const response = await fetch(currentItem.url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const extension = currentItem.type === 'video' ? 'mp4' : 'png';
      a.download = `generated-${currentItem.id}.${extension}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Download failed:', error);
      // Fallback to simple link if fetch fails
      const a = document.createElement('a');
      a.href = currentItem.url;
      a.target = '_blank';
      a.download = `generated-${currentItem.id}.png`;
      a.click();
    }
  };

  const currentItem = items[currentIndex];

  return (
    <div className="animate-in fade-in fixed inset-0 z-50 flex h-screen w-screen flex-col overflow-hidden bg-white duration-200">
      {/* Navbar */}
      <div className="flex h-[88px] w-full shrink-0 items-center justify-between bg-white px-[32px] py-[20px]">
        {/* Logo - LHS */}
        <img
          src="/assets/icons/Commverse Logo - Final.svg"
          alt="logo"
          className="h-auto w-full max-w-51 object-cover"
        />
        {/* RHS Actions */}
        <div className="flex items-center justify-end">
          <Button
            variant="ghost"
            leftIcon={
              <Icon
                icon="ic:twotone-delete-outline"
                className="size-5 text-[#FF2A2A]"
              />
            }
            onClick={() => void onDelete?.(currentItem)}
            disabled={isDeleting}
          />
          <Button
            variant="ghost"
            leftIcon={
              <Icon
                icon="solar:download-minimalistic-linear"
                className="size-5"
              />
            }
            onClick={handleDownload}
          />
          <Button
            variant="ghost"
            leftIcon={
              <Icon
                icon="lucide:x"
                className="text-neutral-gray-900 size-5 cursor-pointer"
              />
            }
            onClick={onClose}
          />
        </div>
      </div>

      {/* Main Body */}
      <div className="relative flex flex-1 flex-col items-center justify-center overflow-hidden pt-[20px] pb-[48px]">
        <div className="flex w-full flex-1 items-center justify-between">
          {/* Prev Button */}
          <Button
            variant="ghost"
            leftIcon={
              <span className="flex h-[24px] w-[24px] items-center justify-center">
                <Icon
                  icon="solar:alt-arrow-left-linear"
                  className="fill-neutral-gray-100 h-full! w-full!"
                />
              </span>
            }
            onClick={handlePrev}
            className="z-10 h-[64px]! w-[64px]! rounded-[14px]! p-0!"
          />

          {/* Large Image */}
          <div className="relative aspect-square max-h-[70vh] overflow-hidden rounded-[20px]">
            {currentItem.type === 'video' ? (
              <video
                src={currentItem.url}
                className="size-full max-h-[482px] min-h-[482px] max-w-[482px] min-w-[482px] bg-white object-contain"
                controls
                playsInline
                preload="metadata"
              />
            ) : (
              <ImageWithFallback
                src={currentItem.url}
                alt="Preview"
                className="size-full max-h-[482px] max-w-[482px] bg-white object-contain"
              />
            )}
          </div>

          {/* Next Button */}
          <Button
            variant="ghost"
            leftIcon={
              <span className="flex h-[24px] w-[24px] items-center justify-center">
                <Icon
                  icon="solar:alt-arrow-right-linear"
                  className="fill-neutral-gray-100 h-full! w-full!"
                />
              </span>
            }
            onClick={handleNext}
            className="z-10 h-[64px]! w-[64px]! rounded-[14px]! p-0!"
          />
        </div>

        {/* Thumbnail Strip */}
        {/* {!currentItem.linkedProductId && (
          <div className="mt-[20px] flex items-center justify-center">
            <Button
              content="Add to Product"
              variant="tertiary"
              leftIcon={
                <Icon
                  icon="solar:box-minimalistic-linear"
                  className="size-5 text-white"
                />
              }
              size="sm"
              onClick={() => onAddToProduct?.(currentItem)}
            />
          </div>
        )} */}

        {currentItem.linkedProductId && (
          <div className="mt-[20px] flex items-center gap-3">
            <div className="flex max-w-[360px] items-center gap-2 rounded-[12px] bg-[#EAEBF1] px-3 py-2">
              <Icon
                icon="solar:box-minimalistic-linear"
                className="size-5 shrink-0"
              />
              <p className="truncate text-[14px] leading-[1.2] font-semibold text-[#18181A]">
                {currentItem.linkedProductName || 'Linked Product'}
              </p>
            </div>
            <Button
              content="Remove"
              variant="tertiary"
              size="sm"
              onClick={() => void onUnlink?.(currentItem)}
              disabled={isUnlinking}
              isLoading={isUnlinking}
            />
          </div>
        )}

        <div
          ref={thumbnailRailRef}
          className="no-scrollbar mt-[20px] flex w-full max-w-[482px] items-center justify-start gap-[8px] overflow-x-auto px-4 py-8"
        >
          {items.map((item, index) => (
            <button
              key={item.id}
              ref={(el) => {
                thumbnailButtonRefs.current[index] = el;
              }}
              onClick={() => setCurrentIndex(index)}
              className={`relative block h-[64px] w-[64px] shrink-0 cursor-pointer overflow-hidden rounded-[12px] border-[1.5px] transition-all ${
                currentIndex === index
                  ? 'border-[#18181a] opacity-100'
                  : 'border-transparent opacity-60 hover:opacity-100'
              }`}
            >
              {item.type === 'video' ? (
                <video
                  src={item.url}
                  className="size-full rounded-[10px] object-cover"
                  muted
                  playsInline
                  preload="metadata"
                />
              ) : (
                <ImageWithFallback
                  src={item.url}
                  alt="Thumbnail"
                  className="size-full rounded-[10px] object-contain"
                />
              )}
              {item.type === 'video' && (
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/10">
                  <Icon
                    icon="material-symbols:play-circle-rounded"
                    className="size-6 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]"
                  />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
