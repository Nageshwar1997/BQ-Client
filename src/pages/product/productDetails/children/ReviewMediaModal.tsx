import Modal from "../../../../components/modal";
import MediaCarouselWithParentMedia from "../../../../components/carousels/MediaCarouselWithParentMedia";
import { TCarouselOption } from "../../../../types";

const ReviewMediaModal = ({
  reviewMedia,
  currentIndex,
  setCurrentIndex,
  opened,
  onClose,
}: {
  currentIndex: number | null;
  setCurrentIndex: (index: number | null) => void;
  reviewMedia: TCarouselOption[];
  opened: boolean;
  onClose: (isOpen: boolean) => void;
}) => {
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

export default ReviewMediaModal;
