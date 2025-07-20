import { useState } from "react";
import { DropdownIcon } from "../../icons";
import { LeftGradient, RightGradient } from "../Gradients";
import useHorizontalScrollable from "../../hooks/useHorizontalScrollable";

const ImageCarousel = ({
  className,
  images,
}: {
  className?: string;
  images: string[];
}) => {
  const [showGradient, containerRef] = useHorizontalScrollable();
  const [currentIndex, setCurrentIndex] = useState(0);

  return (
    <div
      className={`bg-primary-inverted rounded-lg p-4 max-w-3xl w-full ${className}`}
    >
      {/* Main Image */}
      <div className="mb-4 h-[400px] lg:h-[420px] xl:h-[500px] flex items-center justify-center relative">
        <img
          src={images[currentIndex]}
          alt={`preview-${currentIndex}`}
          className="max-h-full mx-auto object-contain rounded-lg"
        />
        <div className="w-full py-2 absolute bottom-0 left-1/2 transform -translate-x-1/2 text-sm text-center flex items-center justify-center gap-5">
          <button
            type="button"
            aria-label="Previous Image"
            disabled={images.length === 0}
            onClick={() => {
              setCurrentIndex((prev) =>
                prev === 0 ? images.length - 1 : prev - 1
              );
            }}
            className="p-[5px] rounded border border-primary-50 bg-primary-inverted-50 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <DropdownIcon className="rotate-90 [&>path]:stroke-primary" />
          </button>
          <span className="py-2 w-24 px-4 min-h-full border border-primary-50 content-center bg-primary-inverted-50 text-primary leading-none rounded">
            {currentIndex + 1} of {images.length}
          </span>
          <button
            type="button"
            disabled={images.length === 0}
            onClick={() => {
              setCurrentIndex((prev) =>
                prev === images.length - 1 ? 0 : prev + 1
              );
            }}
            className="p-[5px] rounded border border-primary-50 bg-primary-inverted-50 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <DropdownIcon className="-rotate-90 [&>path]:stroke-primary" />
          </button>
        </div>
      </div>

      <hr className="h-px mb-4 block border-none bg-gradient-line" />
      {/* Thumbnails */}
      <div className="relative">
        {showGradient.left && (
          <LeftGradient className="!w-20" />
        )}
        <div
          className="flex gap-2 overflow-x-scroll scroll-smooth overflow-hidden"
          ref={containerRef}
        >
          {images.map((url, i) => (
            <div
              key={i}
              className={`min-w-20 min-h-20 max-w-24 max-h-24 group rounded overflow-hidden border border-primary-30 shadow-sm shrink-0 ${
                i === currentIndex ? "border-tertiary" : "border-primary-30"
              }`}
            >
              <img
                src={url}
                alt={`thumb-${i}`}
                onClick={() => setCurrentIndex(i)}
                className="w-full h-full object-cover cursor-pointer aspect-square"
              />
            </div>
          ))}
        </div>
        {showGradient.right && (
          <RightGradient className="!w-20" />
        )}
      </div>
    </div>
  );
};

export default ImageCarousel;
