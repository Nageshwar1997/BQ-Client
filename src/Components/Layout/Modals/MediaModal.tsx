import { useEffect } from 'react';
import type { TClassName, TMediaOption } from '@/Types/Common.type';
import { ModalWrapper } from './ModalWrapper';
import { MediaCarouselWithParentMedia } from '../Carousels';

export const MediaModal = ({
  media,
  currentIndex,
  className = '',
  setCurrentIndex,
  opened,
  onClose,
  handleRemove,
}: {
  currentIndex: number | null;
  setCurrentIndex: (index: number | null) => void;
  media: TMediaOption[];
  opened: boolean;
  onClose: (isOpen: boolean) => void;
  handleRemove?: (index: number) => void;
} & TClassName) => {
  const handleClose = () => {
    onClose(false);
    setCurrentIndex(null);
  };

  useEffect(() => {
    if (media.length === 0) handleClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [media.length]);

  if (media.length === 0) return null;
  return (
    <ModalWrapper
      className="max-w-xl"
      isOpen={opened}
      onClose={handleClose}
      containerProps={{ className }}
      header={{ showCloseIcon: true }}
    >
      <MediaCarouselWithParentMedia
        handleRemove={handleRemove}
        media={media}
        needButtonControls={true}
        selected={currentIndex}
        videoProps={{
          autoPlay: true,
          muted: true,
          loop: true,
          className: 'object-contain! bg-primary-10 backdrop-blur-[2px] rounded-lg',
        }}
      />
    </ModalWrapper>
  );
};
