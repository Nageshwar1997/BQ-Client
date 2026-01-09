import { useMemo } from "react";
import { HOME_CATEGORIES_DATA } from "../../data";
import HeadingWithDescription from "../../../../components/ui/HeadingWithDescription";
import CategoryCard from "./childrens/CategoryCard";

const CategoriesGrid = () => {
  const categories = useMemo(() => HOME_CATEGORIES_DATA, []);
  return (
    <div className="flex flex-col items-center w-full px-[5%]">
      <HeadingWithDescription
        titleTexts={["Product Categories"]}
        className="py-6! text-center"
        wrapperClassName="lg:[&>hr]:w-2/3"
        descriptionText={
          "Exclusive beauty products crafted to enhance your natural glow, from skincare to makeup essentials."
        }
        horizontalLine="bottom"
      />
      <div className="w-full py-5 sm:py-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-12 gap-6 lg:gap-10 place-items-center">
        {categories.map((category, index) => (
          <CategoryCard
            key={index}
            {...category}
            intervalDuration={(index + 1) * 1000}
            className={`w-75 sm:w-full ${
              index === 4 ? "sm:col-span-2 sm:[&_img]:h-87.5" : ""
            } ${
              index > 2
                ? "xl:col-span-6 lg:[&_img]:h-62.5 xl:[&_img]:h-87.5"
                : "xl:col-span-4"
            }`}
          />
        ))}
      </div>
    </div>
  );
};
export default CategoriesGrid;
