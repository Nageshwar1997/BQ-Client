import { LeftGradient, RightGradient } from "../Gradients";
import useHorizontalScrollable from "../../hooks/useHorizontalScrollable";
import { TMediaCarousel } from "../../types";
import { CloseIcon, PlayIcon } from "../../icons";
import VideoPlayer from "../videoPlayers/VideoPlayer";

const MediaCarousel = ({
  className = "",
  data,
  selected,
  onClick,
  thumbnailRefs,
  handleRemove,
  gradientClassName = "",
}: TMediaCarousel) => {
  const { showGradient, containerRef } = useHorizontalScrollable();

  if (data?.length === 0) return null;

  return (
    <div className={`p-1 relative ${className}`}>
      {showGradient.left && (
        <LeftGradient className={`!w-20 h-full ${gradientClassName}`} />
      )}
      <div
        className={`flex items-center gap-2 overflow-x-scroll scroll-smooth overflow-hidden ${
          !showGradient.left && !showGradient.right ? "justify-center" : ""
        }`}
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
            onClick={() => onClick(i)}
            className={`w-20 h-20 group rounded overflow-hidden border shadow-sm shrink-0 hover:opacity-100 transition-colors duration-300 relative ${
              i === selected
                ? "border-tertiary opacity-100"
                : "border-primary-30 opacity-90"
            } ${item.type === "video" ? "relative" : ""}`}
          >
            {item.type === "video" ? (
              <>
                {i !== selected && (
                  <div className="absolute inset-0 w-full h-full aspect-square bg-black/50 flex items-center justify-center group pointer-events-none">
                    <PlayIcon className="fill-white opacity-90 group-hover:opacity-100" />
                  </div>
                )}
                <VideoPlayer
                  key={item.url}
                  videoProps={{ src: item.url, autoPlay: false }}
                  className="w-full h-full object-cover cursor-pointer aspect-square"
                />
              </>
            ) : (
              <img
                src={item.url}
                alt={`image-${i}`}
                className="w-full h-full object-cover cursor-pointer aspect-square"
              />
            )}

            {handleRemove && (
              <button
                type="button"
                className="absolute top-0.5 right-0.5 z-[1] bg-tertiary rounded-full p-0.5 flex items-center justify-center text-xs"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove(i);
                }}
              >
                <CloseIcon className="w-3 h-3 stroke-primary-inverted" />
              </button>
            )}
          </div>
        ))}
      </div>
      {showGradient.right && (
        <RightGradient className={`!w-20 h-full ${gradientClassName}`} />
      )}
    </div>
  );
};

export default MediaCarousel;
