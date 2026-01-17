import { useEffect, useMemo, useRef, useState } from 'react';
import MediaCarousel from './MediaCarousel';
import type { IMediaCarouselWithParent, TClassName } from '../../../types';
import VideoPlayer from '../media/VideoPlayer';
import { DropdownIcon } from '../../../icons';
import HR from '../../ui/HR';

const ChevronButton = ({ onClick, className = '' }: { onClick: () => void } & TClassName) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`border-primary/50 bg-primary-invert/50 cursor-pointer rounded-sm border p-1.25 ${className}`}
    >
      <DropdownIcon className="stroke-primary rotate-90" />
    </button>
  );
};

const MediaCarouselWithParentMedia = ({
  className,
  media,
  selected = 0,
  needButtonControls = true,
  videoProps,
  handleRemove,
}: IMediaCarouselWithParent) => {
  const [currentIndex, setCurrentIndex] = useState(selected ?? 0);
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image');
  const thumbnailRefs = useRef<(HTMLDivElement | null)[]>([]);

  const src = useMemo(() => {
    if (currentIndex >= media.length) {
      return media[media.length - 1].url;
    } else if (media[currentIndex]) {
      return media[currentIndex].url;
    }
    return '';
  }, [currentIndex, media]);

  const handleIndexChange = (btnDir: 'prev' | 'next') => {
    if (btnDir === 'prev') {
      setCurrentIndex((prevIdx) => (currentIndex > 0 ? prevIdx - 1 : media?.length - 1));
    } else {
      setCurrentIndex((prevIdx) => (currentIndex < media.length - 1 ? prevIdx + 1 : 0));
    }
  };

  useEffect(() => {
    if (selected === null || selected === undefined) return;
    setCurrentIndex(selected); // Set the current index to the selected thumbnail
    // Scroll the selected thumbnail into view
    const el = thumbnailRefs.current[selected];
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  }, [selected]);

  useEffect(() => {
    const nextType = media[currentIndex]?.type;
    if (nextType && nextType !== mediaType) {
      setMediaType(nextType);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex, media]);

  if (media.length === 0) return null;

  return (
    <div className={`bg-primary-invert w-full overflow-hidden rounded-lg ${className}`}>
      {/* Main Image */}
      <div className="relative mb-4 flex h-100 items-center justify-center lg:h-105 xl:h-125">
        <div className="flex h-full w-full transform items-center justify-center rounded-lg transition-opacity duration-500">
          {mediaType === 'video' ? (
            <VideoPlayer
              key={src}
              videoProps={{ ...videoProps, src }}
              className="mx-auto flex max-h-full items-center justify-center"
            />
          ) : (
            <img
              src={src}
              alt={`preview-${currentIndex}`}
              className="mx-auto h-full max-h-full w-full object-contain"
              loading="lazy"
            />
          )}
        </div>

        {needButtonControls && media.length > 1 && (
          <div className="absolute bottom-0 flex w-full items-center justify-center gap-5 py-2 text-center text-sm">
            <ChevronButton onClick={() => handleIndexChange('prev')} />
            <span className="border-primary/50 bg-primary-invert/50 text-primary min-h-full w-24 content-center rounded-sm border px-4 py-2 leading-none">
              {currentIndex + 1} of {media.length}
            </span>
            <ChevronButton
              onClick={() => handleIndexChange('next')}
              className="[&>svg]:-rotate-90"
            />
          </div>
        )}
      </div>
      {/* Thumbnails */}
      {media.length > 1 && (
        <>
          <HR />
          <MediaCarousel
            media={media}
            selected={currentIndex}
            onClick={setCurrentIndex}
            handleRemove={handleRemove}
            thumbnailRefs={thumbnailRefs}
          />
        </>
      )}
    </div>
  );
};

export default MediaCarouselWithParentMedia;
