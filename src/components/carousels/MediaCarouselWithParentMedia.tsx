import { useEffect, useMemo, useRef, useState } from "react";
import { DropdownIcon } from "../../icons";
import MediaCarousel from "./MediaCarousel";
import VideoPlayer from "../videoPlayers/VideoPlayer";
import { convertVideoToPoster } from "../../utils";
import { IMediaCarouselWithParentMedia } from "../../types";

const MediaCarouselWithParentMedia = ({
  className,
  data,
  selected = 0,
  needButtonControls = true,
  videoProps,
}: IMediaCarouselWithParentMedia) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mediaType, setMediaType] = useState<"image" | "video">("image");
  const thumbnailRefs = useRef<(HTMLDivElement | null)[]>([]);

  const src = useMemo(() => {
    if (data[currentIndex]) {
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
    if (data[currentIndex]) {
      setMediaType(data[currentIndex].type);
    }
  }, [currentIndex, data]);

  return (
    <div
      className={`bg-primary-inverted rounded-lg max-w-3xl w-full overflow-hidden ${className}`}
    >
      {/* Main Image */}
      <div className="mb-4 h-[400px] lg:h-[420px] xl:h-[500px] flex items-center justify-center relative">
        <div className="w-full h-full transform transition-opacity duration-500 flex items-center justify-center rounded-lg">
          {mediaType === "video" ? (
            <VideoPlayer
              videoProps={{
                ...videoProps,
                src,
                poster: convertVideoToPoster(src),
              }}
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

        {needButtonControls && (
          <div className="w-full py-2 absolute bottom-0 text-sm text-center flex items-center justify-center gap-5">
            <button
              type="button"
              onClick={() => {
                setCurrentIndex((prev) =>
                  currentIndex > 0 ? prev - 1 : data?.length - 1
                );
              }}
              className="p-[5px] rounded border border-primary-50 bg-primary-inverted-50 cursor-pointer"
            >
              <DropdownIcon className="rotate-90 [&>path]:stroke-primary" />
            </button>

            <span className="py-2 w-24 px-4 min-h-full border border-primary-50 content-center bg-primary-inverted-50 text-primary leading-none rounded">
              {currentIndex + 1} of {data.length}
            </span>
            <button
              type="button"
              onClick={() => {
                setCurrentIndex((prev) =>
                  currentIndex < data.length - 1 ? prev + 1 : 0
                );
              }}
              className="p-[5px] rounded border border-primary-50 bg-primary-inverted-50 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <DropdownIcon className="-rotate-90 [&>path]:stroke-primary" />
            </button>
          </div>
        )}
      </div>
      <hr className="h-px mb-4 block border-none bg-gradient-line" />
      {/* Thumbnails */}
      <MediaCarousel
        data={data}
        currentIndex={currentIndex}
        setCurrentIndex={setCurrentIndex}
        thumbnailRefs={thumbnailRefs}
      />
    </div>
  );
};

export default MediaCarouselWithParentMedia;
