import { useLocation } from "react-router-dom";
import { CATEGORY_IMAGE_DATA } from "./data";
// import { useGetAllProductsInfinite } from "../../../api/product/product.service";
import { useEffect, useState, useMemo } from "react";
import { FilterIcon, LeftArrowIcon } from "../../../icons";
import Filters from "../../../components/filters/Filters";
import SortBy from "./SortBy";

type TCategoryImage = { img: string; category: string };

const CategoryProducts = () => {
  const { pathname } = useLocation();
  const [categoryImage, setCategoryImage] = useState<TCategoryImage | null>(
    null
  );
  const [showFilter, setShowFilter] = useState<boolean>(false);
  const [showSortBy, setShowSortBy] = useState<boolean>(false);

  const paths = useMemo(
    () =>
      pathname
        .split("/")
        .filter((path) => path !== "")
        .slice(1, 4),
    [pathname]
  );

  useEffect(() => {
    const levelOneCat = CATEGORY_IMAGE_DATA[paths[0]];
    const levelTwoCat = levelOneCat?.subCategories?.find(
      (c) => c?.category === paths[1]
    );
    const levelThreeCat = levelTwoCat?.subCategories?.find(
      (c) => c?.category === paths[2]
    );
    const finalCategoryImgData = levelThreeCat || levelTwoCat || levelOneCat;

    setCategoryImage(finalCategoryImgData || null);
  }, [paths]);

  // const allProductsQuery = useGetAllProductsInfinite({
  //   pageParams: { limit: 1 },
  //   data: { requiredFields: ["title"] },
  //   queryParams: {
  //     category_1: paths[0],
  //     category_2: paths[1],
  //     category_3: paths[2],
  //   },
  // });

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
