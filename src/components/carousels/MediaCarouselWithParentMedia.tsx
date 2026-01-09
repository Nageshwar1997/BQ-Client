import { useEffect, useMemo, useRef, useState } from "react";
import { DropdownIcon } from "../../icons";
import MediaCarousel from "./MediaCarousel";
import VideoPlayer from "../videoPlayers/VideoPlayer";
import { IMediaCarouselWithParentMedia } from "../../types";

const MediaCarouselWithParentMedia = ({
  className,
  data,
  selected = 0,
  needButtonControls = true,
  videoProps,
  handleRemove,
}: IMediaCarouselWithParentMedia) => {
  const [currentIndex, setCurrentIndex] = useState(selected ?? 0);
  const [mediaType, setMediaType] = useState<"image" | "video">("image");
  const thumbnailRefs = useRef<(HTMLDivElement | null)[]>([]);

  const src = useMemo(() => {
    if (currentIndex >= data.length) {
      return data[data.length - 1].url;
    } else if (data[currentIndex]) {
      return data[currentIndex].url;
    }
    return "";
  }, [currentIndex, data]);

  useEffect(() => {
    if (selected === null || selected === undefined) return;
    setCurrentIndex(selected); // Set the current index to the selected thumbnail
    // Scroll the selected thumbnail into view
    const el = thumbnailRefs.current[selected];
    if (el) {
      el.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    }
  }, [selected]);

  useEffect(() => {
    const nextType = data[currentIndex]?.type;
    if (nextType && nextType !== mediaType) {
      setMediaType(nextType);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex, data]);

  if (data.length === 0) return null;

  return (
    <div
      className={`bg-primary-inverted rounded-lg max-w-3xl w-full overflow-hidden ${className}`}
    >
      {/* Main Image */}
      <div className="mb-4 h-100 lg:h-105 xl:h-125 flex items-center justify-center relative">
        <div className="w-full h-full transform transition-opacity duration-500 flex items-center justify-center rounded-lg">
          {mediaType === "video" ? (
            <VideoPlayer
              key={src}
              videoProps={{ ...videoProps, src }}
              className="max-h-full mx-auto flex items-center justify-center"
            />
          ) : (
            <img
              src={src}
              alt={`preview-${currentIndex}`}
              className="max-h-full mx-auto object-contain w-full h-full"
              loading="lazy"
            />
          )}
        </div>

        {needButtonControls && data.length > 1 && (
          <div className="w-full py-2 absolute bottom-0 text-sm text-center flex items-center justify-center gap-5">
            <button
              type="button"
              onClick={() => {
                setCurrentIndex((prev) =>
                  currentIndex > 0 ? prev - 1 : data?.length - 1
                );
              }}
              className="p-1.25 rounded-sm border border-primary-50 bg-primary-inverted-50 cursor-pointer"
            >
              <DropdownIcon className="rotate-90 [&>path]:stroke-primary" />
            </button>

            <span className="py-2 w-24 px-4 min-h-full border border-primary-50 content-center bg-primary-inverted-50 text-primary leading-none rounded-sm">
              {currentIndex + 1} of {data.length}
            </span>
            <button
              type="button"
              onClick={() => {
                setCurrentIndex((prev) =>
                  currentIndex < data.length - 1 ? prev + 1 : 0
                );
              }}
              className="p-1.25 rounded-sm border border-primary-50 bg-primary-inverted-50 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <DropdownIcon className="-rotate-90 [&>path]:stroke-primary" />
            </button>
          </div>
        )}
      </div>
      {/* Thumbnails */}
      {data.length > 1 && (
        <>
          <hr className="h-px mb-4 block border-none bg-gradient-line" />
          <MediaCarousel
            data={data}
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
