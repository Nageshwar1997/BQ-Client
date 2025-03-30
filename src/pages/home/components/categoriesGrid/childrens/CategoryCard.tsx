import { memo, useEffect, useState } from "react";

const CategoryCard = memo(
  ({
    title,
    description,
    className,
    images,
  }: {
    title: string;
    description: string;
    className?: string;
    images: { img: string }[];
  }) => {
    const [imageUrl, setImageUrl] = useState(images[0].img);
    useEffect(() => {
      let intervalId: number;
      if (images && images.length > 0) {
        intervalId = setInterval(() => {
          setImageUrl(images[Math.floor(Math.random() * images.length)].img);
        }, 1500);
      }
      return () => clearInterval(intervalId);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (
      <div
        className={`border-rounded-corners-gradient shadow-light-dark-soft bg-black cursor-pointer rounded-3xl overflow-hidden bg-xr-card-bg ${className}`}
      >
        <>
          <div className="px-6 pt-7 pb-5">
            <p className="text-center font-metropolis text-xl font-medium leading-6 mb-2 text-white">
              {title}
            </p>
            <p className="text-description text-center text-sm font-metropolis font-normal leading-[18px]">
              {description}
            </p>
          </div>
          <img
            src={imageUrl}
            width={0}
            height={0}
            alt={"3d render"}
            className="w-full h-[200px] aspect-square object-contain"
            loading="lazy"
          />
        </>
      </div>
    );
  }
);

export default CategoryCard;
