import { useEffect, useMemo } from "react";
import { TUseGetAllProductInfinite } from "../../../../api/types";
import TextDisplay from "../../../../components/TextDisplay";
import { FetchedProductType, PopulatedCategory } from "../../../../types";
import { useGetAllProductsInfinite } from "../../../../api/product/product.service";
import { useInView } from "react-intersection-observer";
import useHorizontalScrollable from "../../../../hooks/useHorizontalScrollable";
import { LeftGradient, RightGradient } from "../../../../components/Gradients";
import ProductCard from "../../searchProducts/ProductCard";
import ProductCardSkeleton from "../../../../components/skeletons/children/ProductCardSkeleton";
import ShowError from "../../../../components/errors/ShowError";
import EmptyData from "../../../../components/empty-data/EmptyData";
import useQueryParams from "../../../../hooks/useQueryParams";

const SimilarProducts = ({ category }: { category: PopulatedCategory }) => {
  const { ref, inView } = useInView();
  const { params } = useQueryParams();
  const [showGradient, containerRef] = useHorizontalScrollable();

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
        category_3: category?.category,
        category_2: category?.parentCategory.category,
        category_1: category?.parentCategory.parentCategory.category,
      },
      enabled: !!category,
    }),
    [category]
  );

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useGetAllProductsInfinite(memoizedQueryParams);
  const products: FetchedProductType[] =
    data?.pages?.flatMap((page) => page.products) || [];

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  return (
    <div className="w-full py-8 border-y border-y-primary-50">
      <TextDisplay
        content={[{ isHighlighted: true, text: "Similar Products" }]}
        className="text-xl md:text-3xl lg:text-4xl"
      />
      <hr className="max-w-xl mx-auto h-px block border-none bg-gradient-line my-4" />
      <div className="relative">
        {showGradient.left && <LeftGradient className="h-full !w-5 !sm:w-20" />}
        <div
          className={`max-h-[445px] flex gap-4 overflow-x-auto scroll-smooth px-4 ${
            !showGradient.left && !showGradient.right
              ? "justify-center"
              : "justify-start"
          }`}
          ref={containerRef}
        >
          {isError ? (
            <ShowError
              headingText="Something went wrong!"
              descriptionText="Failed to find similar products. Please reload the page"
              showHrLine={true}
              className="mx-auto mb-auto [&>h3]:text-base [&>h3]:base:text-base [&>h3]:sm:text-xl [&>h3]:md:text-2xl [&>h3]:lg:text-3xl [&>h3]:xl:text-4xl [&>h3]:uppercase [&>p]:text-xs [&>p]:base:text-sm [&>p]:sm:text-base [&>p]:md:text-lg"
            />
          ) : isLoading ? (
            Array.from({ length: 5 }).map((_, index) => (
              <ProductCardSkeleton key={index} className="shrink-0 w-[260px]" />
            ))
          ) : products.length <= 1 ? (
            <EmptyData
              content={"No similar products found"}
              className="mx-auto mb-auto [&>h3]:text-base [&>h3]:base:text-base [&>h3]:sm:text-xl [&>h3]:md:text-2xl [&>h3]:lg:text-3xl [&>h3]:xl:text-4xl [&>h3]:uppercase gap-5"
            />
          ) : (
            <>
              {products
                .filter((p) => p?._id !== params.productId)
                .map((product, index) => (
                  <div
                    key={index}
                    className="shrink-0 w-[260px] h-full"
                    ref={index === products.length - 2 ? ref : null}
                  >
                    <ProductCard product={product} />
                  </div>
                ))}
              {isFetchingNextPage && (
                <ProductCardSkeleton className="w-[260px]" />
              )}
            </>
          )}
        </div>
        {showGradient.right && (
          <RightGradient className="h-full !w-5 !sm:w-20" />
        )}
      </div>
    </div>
  );
};

export default SimilarProducts;
