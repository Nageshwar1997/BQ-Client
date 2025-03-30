import { useMemo } from "react";
import { HOME_CATEGORIES_DATA } from "../../data";
import HeadingWithDescription from "../../../../components/ui/HeadingWithDescription";
import CategoryCard from "./childrens/CategoryCard";

const CategoriesGrid = () => {
  const categories = useMemo(() => HOME_CATEGORIES_DATA, []);
  return (
    <div className="flex flex-col items-center">
      <HeadingWithDescription
        titleTexts={["Product Categories"]}
        className="!py-5 [&>h1]:!leading-none [&>h1>span]:!leading-none"
        wrapperClassName="[&>hr]:w-2/3"
        descriptionText={
          "Exclusive beauty products crafted to enhance your natural glow, from skincare to makeup essentials"
        }
        horizontalLine="bottom"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 pt-8 pb-6 lg:pb-32 max-w-7xl mx-[35px] xl:mx-auto">
        {categories.map((category, index) => (
          <CategoryCard
            key={index}
            {...category}
            className={`col-span-full ${
              index > 2 ? "lg:col-span-6" : "lg:col-span-4"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default CategoriesGrid;
