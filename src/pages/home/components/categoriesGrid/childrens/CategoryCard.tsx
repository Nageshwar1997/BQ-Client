import { memo, useEffect, useState } from "react";

const CategoryCard = memo(
  ({
    title,
    description,
    className = "",
    images,
  }: {
    title: string;
    description: string;
    className?: string;
    images: { img: string }[];
  }) => {
    const [imageUrl, setImageUrl] = useState(images[0].img);
    useEffect(() => {
      const intervalId = setInterval(() => {
        setImageUrl(images[Math.floor(Math.random() * images.length)].img);
      }, 2000);
      return () => clearInterval(intervalId);
    }, [images]);
    return (
      <div
        className={`relative border-rounded-corners-gradient shadow-light-dark-soft bg-black cursor-pointer rounded-3xl overflow-hidden group hover:shadow-xl ${className}`}
      >
        <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-primary-inverted to-transparent px-6 pt-8 pb-6 flex flex-col items-center justify-center z-[1] group-hover:opacity-0 transition-opacity duration-500">
          <h3 className="text-xl font-medium leading-6 mb-2 text-secondary">
            {title}
          </h3>
          <p className="text-tertiary text-sm font-normal leading-[18px]">
            {description}
          </p>
        </div>
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-72 md:h-[280px] lg:h-[250px] xl:h-72 object-cover transition-transform transform group-hover:scale-105 duration-1000 z-0"
          loading="lazy"
        />
      </div>
    );
  }
);

export default CategoryCard;
