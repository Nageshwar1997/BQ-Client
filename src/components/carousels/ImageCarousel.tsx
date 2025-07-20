import { useState } from "react";
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
      </div>

      <hr className="h-px mb-4 block border-none bg-gradient-line" />
      {/* Thumbnails */}
      <div className="relative">
        {showGradient.left && <LeftGradient className="!w-20 h-full" />}
        <div
          className="flex gap-2 overflow-x-scroll scroll-smooth overflow-hidden"
          ref={containerRef}
        >
          {images.map((url, i) => (
            <div
              key={i}
              className={`w-20 h-20 group rounded overflow-hidden border border-primary-30 shadow-sm shrink-0 ${
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
        {showGradient.right && <RightGradient className="!w-20 h-full" />}
      </div>
    </div>
  );
};

export default ImageCarousel;
