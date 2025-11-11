import Modal from "../../../../components/modal";
import MediaCarouselWithParentMedia from "../../../../components/carousels/MediaCarouselWithParentMedia";
import { ClassName, TMediaOption } from "../../../../types";
import { useEffect } from "react";

const MediaModal = ({
  reviewMedia,
  currentIndex,
  className = "",
  setCurrentIndex,
  opened,
  onClose,
  handleRemove,
}: {
  currentIndex: number | null;
  setCurrentIndex: (index: number | null) => void;
  reviewMedia: TMediaOption[];
  opened: boolean;
  onClose: (isOpen: boolean) => void;
  handleRemove?: (index: number) => void;
} & ClassName) => {
  const handleClose = () => {
    onClose(false);
    setCurrentIndex(null);
  };

  useEffect(() => {
    if (reviewMedia.length === 0) handleClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reviewMedia.length]);

  if (reviewMedia.length === 0) return null;
  return (
    <Modal
      className="max-w-xl"
      isOpen={opened}
      onClose={handleClose}
      containerProps={{ className }}
    >
      <MediaCarouselWithParentMedia
        handleRemove={handleRemove}
        data={reviewMedia}
        needButtonControls={true}
        selected={currentIndex}
        videoProps={{
          autoPlay: true,
          muted: true,
          loop: true,
          className:
            "!object-contain bg-primary-10 backdrop-blur-[2px] rounded-lg",
        }}
      />
    </Modal>
  );
};

export default MediaModal;
