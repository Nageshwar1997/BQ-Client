import { useEffect, useMemo, useState } from "react";
import { FilterIcon, LeftArrowIcon, SearchIcon } from "../../../icons";
import SortBy from "../../../components/sortBy";
import Filters from "../../../components/filters/Filters";
import Input from "../../../components/input/Input";
import { useGetAllProductsInfinite } from "../../../api/product/product.service";
import { debounce } from "../../../utils";
import { TUseGetAllProductInfinite } from "../../../api/types";
import useQueryParams from "../../../hooks/useQueryParams";

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
        requiredFields: ["title", "brand", "commonImages"],
        populateFields: { category: ["name"] },
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

  console.log("productsQuery", productsQuery);

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
              className="rounded-none h-full lg:h-full bg-transparent border-none"
              containerClassName="h-full [&>div]:h-full"
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
                className={`w-4 h-4 sm:w-5 sm:h-5 transform transition-all duration-500 ${
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

          <div className="flex-1 p-4 grid grid-cols-3 gap-5 overflow-y-scroll min-h-[1000px]">
            {/* Render productsQuery.data?.pages here */}
          </div>

          <SortBy
            className={`sticky top-[100px] lg:top-[118px] transform transition-all duration-500 ease-in-out overflow-hidden ${
              show.sortBy ? "w-[200px]" : "w-0"
            }`}
          />
        </div>
      </div>
    </div>
  );
};

export default SearchProducts;
