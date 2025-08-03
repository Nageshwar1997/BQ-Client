import Modal from "../../../../components/modal";
import MediaCarouselWithParentMedia from "../../../../components/carousels/MediaCarouselWithParentMedia";
import { TCarouselOption } from "../../../../types";

const ReviewMediaModal = ({
  reviewMedia,
  currentIndex,
  setCurrentIndex,
  isOpen,
  setIsOpen,
}: {
  currentIndex: number | null;
  setCurrentIndex: (index: number | null) => void;
  reviewMedia: TCarouselOption[];
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}) => {
  return (
    <Modal
      children={
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
      }
      className="max-w-xl"
      isOpen={isOpen}
      onClose={() => {
        setIsOpen(false);
        setCurrentIndex(null);
      }}
    />
  );
};

export default ReviewMediaModal;
