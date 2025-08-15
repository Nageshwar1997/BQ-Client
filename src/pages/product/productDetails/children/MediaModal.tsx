import Modal from "../../../../components/modal";
import MediaCarouselWithParentMedia from "../../../../components/carousels/MediaCarouselWithParentMedia";
import { TCarouselOption } from "../../../../types";

const MediaModal = ({
  reviewMedia,
  currentIndex,
  setCurrentIndex,
  opened,
  onClose,
  handleRemove,
}: {
  currentIndex: number | null;
  setCurrentIndex: (index: number | null) => void;
  reviewMedia: TCarouselOption[];
  opened: boolean;
  onClose: (isOpen: boolean) => void;
  handleRemove?: (index: number) => void;
}) => {
  if (reviewMedia.length === 0) return null;
  return (
    <Modal
      className="max-w-xl"
      isOpen={opened}
      onClose={() => {
        onClose(false);
        setCurrentIndex(null);
      }}
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
