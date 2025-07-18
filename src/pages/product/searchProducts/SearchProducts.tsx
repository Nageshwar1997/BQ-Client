import { useEffect, useMemo, useState } from "react";
import { FilterIcon, LeftArrowIcon, SearchIcon } from "../../../icons";
import SortBy from "../../../components/sortBy";
import Filters from "../../../components/filters/Filters";
import Input from "../../../components/input/Input";
import { useGetAllProductsInfinite } from "../../../api/product/product.service";
import { debounce, toINRCurrency } from "../../../utils";
import { TUseGetAllProductInfinite } from "../../../api/types";
import useQueryParams from "../../../hooks/useQueryParams";
import RatingStars from "../../../components/navbar/components/rating/RatingStars";

const SearchProducts = () => {
  const { queryParams, setParams, removeParam } = useQueryParams();
  const [show, setShow] = useState<Record<"filter" | "sortBy", boolean>>({
    filter: false,
    sortBy: false,
  });
  const [searchQuery, setSearchQuery] = useState(queryParams?.search || "");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  const debouncedSetQuery = useMemo(
    () =>
      debounce((value: string) => {
        if (value && value?.trim()) {
          setDebouncedQuery(value.trim());
          setParams({ ...queryParams, search: value?.trim() });
        } else {
          removeParam("search");
        }
      }, 600),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useEffect(() => {
    debouncedSetQuery(searchQuery);
  }, [searchQuery, debouncedSetQuery]);

  const memoizedQueryParams: TUseGetAllProductInfinite = useMemo(
    () => ({
      data: {
        requiredFields: [
          "title",
          "brand",
          "commonImages",
          "discount",
          "sellingPrice",
          "originalPrice",
        ],
        populateFields: { category: ["name"], reviews: ["rating"] },
      },
      pageParams: { page: 1, limit: 5 },
      queryParams: {
        ...(queryParams && queryParams),
        ...(debouncedQuery && { search: debouncedQuery }),
      },
      enabled: !!Object.keys(queryParams).length,
    }),
    [debouncedQuery, queryParams]
  );

  const productsQuery = useGetAllProductsInfinite(memoizedQueryParams);

  const products =
    productsQuery.data?.pages.flatMap((page) => page.products) || [];

  return (
    <div className="lg:-mt-16 flex flex-col">
      <img
        src={
          "https://res.cloudinary.com/drbhw0nwt/image/upload/f_auto,q_auto/v1751652153/Beautinique/Category_Images/7-4-2025_1751652153544_Sugar-Elite.webp"
        }
        alt={"Category"}
      />
      <div className="grow flex flex-col">
        <div className="sticky top-16 h-9 lg:h-[54px] bg-primary-inverted border-y border-y-primary-50 z-10">
          <div className="flex items-center justify-between h-full">
            <button
              className="h-full flex items-center gap-2 px-5 py-2 lg:px-11 lg:py-[14px] border-r border-r-primary-50 base:tracking-widest"
              onClick={() =>
                setShow((prev) => ({ sortBy: false, filter: !prev.filter }))
              }
            >
              <span className="uppercase text-sm lg:text-base text-primary hidden sm:block">
                FILTER
              </span>
              <FilterIcon
                className={`stroke-primary w-4 h-4 sm:w-5 sm:h-5 transform transition-all duration-500 ${
                  show.filter ? "scale-100 scale-x-[-1]" : ""
                }`}
                strokeWidth={1.6}
              />
            </button>
            <Input
              name="search"
              placeholder="Search products here..."
              className="rounded-none h-full lg:h-full bg-transparent border-none [&>span]:cursor-default"
              containerClassName="h-full [&>div]:h-full px-2"
              value={searchQuery?.trimStart()}
              rightIcon={
                <SearchIcon
                  className="w-4 h-4 md:w-5 md:h-5 stroke-primary-50"
                  strokeWidth={1.5}
                />
              }
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button
              className="h-full flex items-center gap-2 px-5 py-2 lg:px-11 lg:py-[14px] border-l border-l-primary-50 base:tracking-widest group"
              onClick={() =>
                setShow((prev) => ({ filter: false, sortBy: !prev.sortBy }))
              }
            >
              <span className="uppercase text-sm lg:text-base text-primary hidden sm:block whitespace-nowrap">
                SORT BY
              </span>
              <LeftArrowIcon
                className={`stroke-primary w-4 h-4 sm:w-5 sm:h-5 transform transition-all duration-500 ${
                  show.sortBy ? "scale-100 scale-x-[-1]" : ""
                }`}
                strokeWidth={1.6}
              />
            </button>
          </div>
        </div>

        <div className="grow bg-primary-inverted flex">
          <Filters
            className={`sticky top-[100px] lg:top-[118px] transform transition-all duration-500 ease-in-out overflow-hidden ${
              show.filter ? "w-[270px]" : "w-0"
            }`}
            needCategoriesFilters={true}
          />

          <div className="flex-1 p-4 grid gap-4 grid-cols-[repeat(auto-fit,minmax(13rem,1fr))] base:grid-cols-[repeat(auto-fill,minmax(14rem,1fr))] xl:grid-cols-[repeat(auto-fill,minmax(16rem,1fr))]">
            {products.map((product) => {
              return (
                <div
                  key={product?._id}
                  className="p-4 rounded-lg shadow-sm bg-primary-inverted flex flex-col gap-4 border-rounded-corners-gradient cursor-pointer"
                >
                  <div className="aspect-square overflow-hidden rounded-md relative group">
                    <img
                      src={product?.commonImages[0]}
                      alt="Product"
                      className="w-full h-full object-contain aspect-square hover:scale-105 transition-transform duration-500"
                    />
                    <span className="w-6 h-6 absolute top-1 right-1 text-[8px] flex flex-col items-center justify-center rounded-full font-semibold dark:bg-green-700 light:bg-green-600 leading-none">
                      {`-${product?.discount.toFixed(0)}%`}
                    </span>
                  </div>
                  <hr className="h-px block border-none bg-gradient-line" />
                  <div className="flex flex-col justify-between gap-1 grow">
                    <p className="text-base/normal font-semibold line-clamp-2 text-secondary">
                      {product?.title}
                    </p>
                    <div className="text-sm font-medium line-clamp-1 text-secondary opacity-70">
                      {product?.brand}
                    </div>
                    <div className="text-sm text-tertiary line-clamp-1">
                      {product?.category?.name}
                    </div>
                    <div className="text-sm font-medium text-tertiary flex items-center gap-3">
                      <span className="text-secondary">
                        {toINRCurrency(product?.sellingPrice)}
                      </span>
                      <span className="text-tertiary line-through opacity-50">
                        {toINRCurrency(product?.originalPrice)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <RatingStars rating={product?.rating ?? 4.5} />
                      <div className="flex items-center gap-0.5">
                        <span className="text-base/none">(</span>
                        <span className="text-base/none">
                          {product?.reviews?.length}
                        </span>
                        <span className="text-base/none">)</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <SortBy
            className={`sticky top-[100px] lg:top-[118px] transform transition-all duration-500 ease-in-out overflow-hidden ${
              show.sortBy ? "w-[270px]" : "w-0"
            }`}
          />
        </div>
      </div>
    </div>
  );
};

export default SearchProducts;
