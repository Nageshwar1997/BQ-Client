import { LeftGradient, RightGradient } from "../Gradients";
import useHorizontalScrollable from "../../hooks/useHorizontalScrollable";
import { TMediaCarousel } from "../../types";
import { PlayIcon } from "../../icons";
import { convertVideoToPoster } from "../../utils";

const MediaCarousel = ({
  className = "",
  data,
  currentIndex,
  setCurrentIndex,
  thumbnailRefs,
  onImageClick,
}: TMediaCarousel) => {
  const [showGradient, containerRef] = useHorizontalScrollable();

  return (
    <div className={`p-1 relative ${className}`}>
      {showGradient.left && <LeftGradient className="!w-20 h-full" />}
      <div
        className={`flex items-center gap-2
           ${
             !showGradient.left && !showGradient.right
               ? "justify-center"
               : "overflow-x-scroll scroll-smooth overflow-hidden"
           }
        `}
        ref={containerRef}
      >
        {data?.map((item, i) => (
          <div
            key={i}
            ref={(el) => {
              if (thumbnailRefs?.current) {
                thumbnailRefs.current[i] = el;
              }
            }}
            onClick={() => {
              setCurrentIndex(i);
              onImageClick?.();
            }}
            className={`w-20 h-20 group rounded overflow-hidden border shadow-sm shrink-0 hover:opacity-100 transition-colors duration-300 ${
              i === currentIndex
                ? "border-tertiary opacity-100"
                : "border-primary-30 opacity-90"
            } ${item.type === "video" ? "relative" : ""}`}
          >
            {item.type === "video" && i !== currentIndex && (
              <div className="absolute inset-0 w-full h-full aspect-square bg-black/50 flex items-center justify-center group pointer-events-none">
                <PlayIcon className="fill-white opacity-90 group-hover:opacity-100" />
              </div>
            )}
            <img
              src={
                item.type === "video"
                  ? convertVideoToPoster(item.url)
                  : item.url
              }
              alt={`image-${i}`}
              className="w-full h-full object-cover cursor-pointer aspect-square"
            />
          </div>
        ))}
      </div>
      {showGradient.right && <RightGradient className="!w-20 h-full" />}
    </div>
  );
};

export default MediaCarousel;
