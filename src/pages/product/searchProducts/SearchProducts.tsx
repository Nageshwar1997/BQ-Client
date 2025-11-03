import { useEffect, useMemo, useState } from "react";
import { useInView } from "react-intersection-observer";
import { FilterIcon, LeftArrowIcon, SearchIcon } from "../../../icons";
import SortBy from "../../../components/sortBy";
import Filters from "../../../components/filters/Filters";
import Input from "../../../components/input/Input";
import { useGetAllProductsInfinite } from "../../../api/product/product.service";
import { debounce } from "../../../utils";
import { TUseGetAllProductInfinite } from "../../../api/types";
import useQueryParams from "../../../hooks/useQueryParams";
import ProductCard from "../../../components/ui/ProductCard";
import ProductCardSkeleton from "../../../components/skeletons/children/ProductCardSkeleton";
import ShowError from "../../../components/errors/ShowError";
import EmptyData from "../../../components/empty-data/EmptyData";
import { FetchedProductType } from "../../../types";
import usePathParams from "../../../hooks/usePathParams";

const SearchProducts = () => {
  const { queryParams, setParams, removeParam } = useQueryParams();
  const { navigate } = usePathParams();
  const { ref, inView } = useInView();
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
      pageParams: { limit: 5 },
      queryParams: {
        ...(queryParams && queryParams),
        ...(debouncedQuery && { search: debouncedQuery }),
      },
      enabled: !!Object.keys(queryParams).length,
    }),
    [debouncedQuery, queryParams]
  );

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useGetAllProductsInfinite(memoizedQueryParams);

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  const products: FetchedProductType[] =
    data?.pages.flatMap((page) => page.products) || [];

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
              needRef
              inputProps={{
                name: "search",
                placeholder: "Search products here...",
                value: searchQuery?.trimStart(),
                onChange: (e) => setSearchQuery(e.target.value),
              }}
              className="rounded-none h-full lg:h-full bg-transparent border-none [&>span]:cursor-default"
              containerClassName="h-full [&>div]:h-full px-2"
              icons={{
                right: {
                  icon: (
                    <SearchIcon
                      className="w-4 h-4 md:w-5 md:h-5 stroke-primary-50"
                      strokeWidth={1.5}
                    />
                  ),
                },
              }}
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
          {isError ? (
            <ShowError
              headingText="Something went wrong!"
              descriptionText="Please try again or refresh page"
              showHrLine={true}
              className="mx-auto mb-auto [&>h3]:text-base [&>h3]:base:text-base [&>h3]:sm:text-xl [&>h3]:md:text-2xl [&>h3]:lg:text-3xl [&>h3]:xl:text-4xl [&>h3]:uppercase [&>p]:text-xs [&>p]:base:text-sm [&>p]:sm:text-base [&>p]:md:text-lg pt-[150px]"
            />
          ) : products.length === 0 &&
            !isError &&
            !isLoading &&
            !isFetchingNextPage ? (
            <EmptyData
              content={"No products found"}
              className="mx-auto mb-auto [&>h3]:text-base [&>h3]:base:text-base [&>h3]:sm:text-xl [&>h3]:md:text-2xl [&>h3]:lg:text-3xl [&>h3]:xl:text-4xl [&>h3]:uppercase pt-[150px] gap-5"
            />
          ) : (
            <div className="flex-1 p-4 grid gap-4 grid-cols-[repeat(auto-fit,minmax(13rem,1fr))] base:grid-cols-[repeat(auto-fill,minmax(14rem,1fr))] xl:grid-cols-[repeat(auto-fill,minmax(16rem,1fr))]">
              {isLoading &&
                Array.from({ length: 5 }).map((_, index) => (
                  <ProductCardSkeleton key={index} />
                ))}
              {products?.map((product, index) => {
                const isLastItem = index === products.length - 4;
                return (
                  <div
                    key={product._id}
                    className="h-full"
                    ref={isLastItem ? ref : null}
                  >
                    <ProductCard
                      product={product}
                      onClick={() => navigate(`/product/${product._id}`)}
                    />
                  </div>
                );
              })}
              {isFetchingNextPage && (
                <div className="h-full">
                  <ProductCardSkeleton />
                </div>
              )}
            </div>
          )}
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
