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
        }, 2000);
      }
      return () => clearInterval(intervalId);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (
      <div
        className={`relative border-rounded-corners-gradient shadow-light-dark-soft bg-black cursor-pointer rounded-3xl overflow-hidden bg-xr-card-bg h-[350px] lg:h-[400px] group ${className}`}
      >
        <>
          <div className="absolute top-0 left-0 text-center w-full bg-gradient-to-b from-primary-inverted to-transparent px-6 pt-7 pb-5 group-hover:backdrop-blur-[2px] transition-transform duration-500">
            <p className="text-center font-metropolis text-xl font-medium leading-6 mb-2 text-secondary">
              {title}
            </p>
            <p className="text-tertiary text-center text-sm font-metropolis font-normal leading-[18px]">
              {description}
            </p>
          </div>
          <img
            src={imageUrl}
            width={0}
            height={0}
            alt={"3d render"}
            className="w-full h-full aspect-square object-cover object-center"
            loading="lazy"
          />
        </>
      </div>
    );
  }
);

export default CategoryCard;
