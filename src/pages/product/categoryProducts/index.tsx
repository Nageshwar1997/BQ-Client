import useQueryParams from "../../../hooks/useQueryParams";
import { CATEGORY_IMAGE_DATA } from "./data";
import { useGetAllProductsInfinite } from "../../../api/product/product.service";
import { useEffect, useState } from "react";
import { FilterIcon, LeftArrowIcon } from "../../../icons";
import Filters from "../../../components/filters/Filters";
import SortBy from "../../../components/sortBy";

type TCategoryImage = { img: string; category: string };

const CategoryProducts = () => {
  const { params } = useQueryParams();
  const [categoryImage, setCategoryImage] = useState<TCategoryImage | null>(
    null
  );
  const [showFilter, setShowFilter] = useState<boolean>(false);
  const [showSortBy, setShowSortBy] = useState<boolean>(false);

  const { levelOneCategory, levelTwoCategory, levelThreeCategory } = params;

  useEffect(() => {
    const levelOneCat = CATEGORY_IMAGE_DATA[String(levelOneCategory)];
    const levelTwoCat = levelOneCat?.subCategories?.find(
      (c) => c?.category === levelTwoCategory
    );
    const levelThreeCat = levelTwoCat?.subCategories?.find(
      (c) => c?.category === levelThreeCategory
    );
    const finalCategoryImgData = levelThreeCat || levelTwoCat || levelOneCat;

    setCategoryImage(finalCategoryImgData || null);
  }, [levelOneCategory, levelThreeCategory, levelTwoCategory]);

  const allProductsQuery = useGetAllProductsInfinite({
    pageParams: { limit: 5 },
    data: { requiredFields: ["title"] },
    queryParams: {
      ...(levelOneCategory && { category_1: levelOneCategory }),
      ...(levelTwoCategory && { category_2: levelTwoCategory }),
      ...(levelThreeCategory && { category_3: levelThreeCategory }),
    },
  });

  console.log("allProductsQuery", allProductsQuery.data?.pages);

  return (
    <div className="lg:-mt-16 flex flex-col">
      <img
        src={
          categoryImage?.img ||
          "https://res.cloudinary.com/drbhw0nwt/image/upload/f_auto,q_auto/v1751652153/Beautinique/Category_Images/7-4-2025_1751652153544_Sugar-Elite.webp"
        }
        alt={categoryImage?.category || "Category"}
      />
      <div className="grow flex flex-col">
        <div className="sticky top-16 h-[54px] bg-primary-inverted flex items-center justify-between border-y border-y-primary-50 z-10">
          <button
            className="flex items-center gap-2 px-11 py-[14px] border-r border-r-primary-50 base:tracking-widest"
            onClick={() => {
              setShowFilter((prev) => !prev);
              setShowSortBy(false);
            }}
          >
            <span className="uppercase text-sm sm:text-base text-primary">
              FILTER
            </span>
            <FilterIcon
              className={`stroke-primary w-5 h-5 transform transition-all duration-500 ${
                showFilter ? "scale-100 scale-x-[-1]" : ""
              }`}
              strokeWidth={1.6}
            />
          </button>
          <button
            className="flex items-center gap-2 px-11 py-[14px] border-l border-l-primary-50  base:tracking-widest group"
            onClick={() => {
              setShowSortBy((prev) => !prev);
              setShowFilter(false);
            }}
          >
            <span className="uppercase text-sm text-nowrap sm:text-base text-primary">
              SORT BY
            </span>
            <LeftArrowIcon
              className={`w-5 h-5 transform transition-all duration-500 ${
                showSortBy ? "scale-100 scale-x-[-1]" : ""
              }`}
              strokeWidth={1.6}
            />
          </button>
        </div>
        <div className="grow bg-primary-inverted flex">
          <Filters
            className={`sticky top-[100px] lg:top-[118px] transform transition-all duration-500 ease-in-out overflow-hidden ${
              showFilter ? "w-[270px]" : "w-0"
            }`}
          />

          <div className="flex-1 bg-pink-300 p-4 min-h-[1000px]">Body</div>
          <SortBy
            className={`sticky top-[100px] lg:top-[118px] transform transition-all duration-500 ease-in-out overflow-hidden ${
              showSortBy ? "w-[200px]" : "w-0"
            }`}
          />
        </div>
      </div>
    </div>
  );
};

export default CategoryProducts;
