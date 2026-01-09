import { useEffect, useState } from "react";
import {
  LeftArrowIcon,
  RightArrowIcon,
  YellowStarIcon,
} from "../../../../icons";
import { Testimonial } from "../../types";

const TestimonialCarousel: React.FC<{ testimonials: Testimonial[] }> = ({
  testimonials,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (testimonials.length > 1) {
      const interval = setInterval(() => {
        if (!isPaused) {
          setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
        }
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [testimonials.length, isPaused]);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };

  return (
    <div
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onClick={() => setIsPaused(!isPaused)}
      className="bg-tertiary-inverted p-4 rounded-lg"
    >
      {testimonials.map((testimonial, index) => (
        <div
          key={testimonial.id}
          className={`w-full flex flex-col gap-2 group ${
            index === currentIndex ? "block" : "hidden"
          }`}
        >
          <div className="flex flex-col gap-4 h-28.75 base:h-32 md:h-37.5 leading-6">
            <div className="flex gap-1">
              {Array.from({ length: 5 }).map((_, idx) => (
                <YellowStarIcon key={idx} className="w-4 h-4 md:w-5 md:h-5" />
              ))}
            </div>
            <p className="text-tertiary text-xs group-hover:text-primary md:text-sm font-normal italic">
              &quot;{testimonial.content}&quot;
            </p>
          </div>
          <div className="flex gap-2 justify-between">
            <div className="flex items-center gap-2">
              <img
                src={testimonial.image}
                alt={testimonial.name}
                className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover bg-secondary-inverted-50 border border-primary-50"
                loading="lazy"
              />
              <div className="flex flex-col">
                <p className="text-secondary text-xs font-semibold">
                  {testimonial.name}
                </p>
                <p className="text-tertiary text-[10px] font-normal leading-4">
                  {testimonial.role}
                </p>
              </div>
            </div>
            <div className="flex justify-center gap-3 px-2">
              <button onClick={handlePrev}>
                <LeftArrowIcon
                  className="stroke-tertiary w-5 h-5"
                  strokeWidth={2.5}
                />
              </button>
              <button onClick={handleNext}>
                <RightArrowIcon
                  className="stroke-tertiary w-5 h-5"
                  strokeWidth={2.5}
                />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TestimonialCarousel;
