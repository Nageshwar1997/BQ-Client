import type { TESTIMONIALS } from '@/Constants';
import { LeftArrowIcon, RightArrowIcon, YellowStarIcon } from '@/Icons';
import { useEffect, useState } from 'react';

export const TestimonialCarousel = ({ data }: { data: typeof TESTIMONIALS }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (data.length > 1) {
      const interval = setInterval(() => {
        if (!isPaused) {
          setCurrentIndex((prevIndex) => (prevIndex + 1) % data.length);
        }
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [data.length, isPaused]);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? data.length - 1 : prevIndex - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % data.length);
  };

  return (
    <div
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onClick={() => setIsPaused(!isPaused)}
      className="bg-tertiary-invert rounded-lg p-4"
    >
      {data.map((testimonial, index) => (
        <div
          key={testimonial.name}
          className={`group flex w-full flex-col gap-2 ${
            index === currentIndex ? 'block' : 'hidden'
          }`}
        >
          <div className="base:h-32 flex h-28.75 flex-col gap-4 leading-6 md:h-37.5">
            <div className="flex gap-1">
              {Array.from({ length: 5 }).map((_, idx) => (
                <YellowStarIcon key={idx} className="size-5 md:size-5" />
              ))}
            </div>
            <p className="text-tertiary group-hover:text-primary text-xs font-normal italic md:text-sm">
              &quot;{testimonial.content}&quot;
            </p>
          </div>
          <div className="flex justify-between gap-2">
            <div className="flex items-center gap-2">
              <img
                src={testimonial.image}
                alt={testimonial.name}
                className="bg-secondary-invert/50 border-primary/50 size-10 rounded-full border object-cover md:size-12"
                loading="lazy"
              />
              <div className="flex flex-col">
                <p className="text-secondary text-xs font-semibold">{testimonial.name}</p>
                <p className="text-tertiary text-[10px] leading-4 font-normal">
                  {testimonial.role}
                </p>
              </div>
            </div>
            <div className="[&>svg]:stroke-tertiary flex justify-center gap-3 px-2 [&>svg]:size-5">
              <LeftArrowIcon onClick={handlePrev} strokeWidth={2.5} />
              <RightArrowIcon onClick={handleNext} strokeWidth={2.5} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
