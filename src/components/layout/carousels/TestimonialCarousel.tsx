import type { TESTIMONIALS } from '@/constants/navbar.constants';
import { Icon } from '@iconify/react';
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
          <div className="flex flex-col gap-4 leading-6">
            <div className="flex gap-1">
              {Array.from({ length: 5 }).map((_, idx) => (
                <Icon
                  key={idx}
                  icon="streamline-ultimate-color:rating-star"
                  className="size-5 md:size-5"
                />
              ))}
            </div>
            <p className="text-tertiary group-hover:text-primary text-xs break-all italic">
              &quot;{testimonial.content}&quot;
            </p>
          </div>
          <div className="flex justify-between gap-2">
            <div className="flex items-center gap-2">
              <img
                src={testimonial.image}
                alt={testimonial.name}
                className="bg-secondary-invert/50 border-primary/50 size-8 rounded-full border object-cover"
                loading="lazy"
              />
              <div className="flex flex-col">
                <p className="text-secondary text-[10px] font-semibold">{testimonial.name}</p>
                <p className="text-tertiary text-[9px] leading-4">{testimonial.role}</p>
              </div>
            </div>
            <div className="[&>svg]:text-tertiary [&>svg]:hover:text-primary flex justify-center gap-3 px-2 [&>svg]:size-5 [&>svg]:cursor-pointer">
              <Icon icon="solar:arrow-left-linear" onClick={handlePrev} />
              <Icon icon="solar:arrow-right-linear" onClick={handleNext} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
