import { useEffect, useMemo } from "react";
import { TUseGetAllProductInfinite } from "../../../../api/types";
import TextDisplay from "../../../../components/TextDisplay";
import { FetchedProductType, PopulatedCategory } from "../../../../types";
import { useGetAllProductsInfinite } from "../../../../api/product/product.service";
import { useInView } from "react-intersection-observer";
import useHorizontalScrollable from "../../../../hooks/useHorizontalScrollable";
import { LeftGradient, RightGradient } from "../../../../components/Gradients";
import ProductCard from "../../searchProducts/ProductCard";

const SimilarProducts = ({
  category,
  productId,
}: {
  category: PopulatedCategory;
  productId: string;
}) => {
  const { ref, inView } = useInView();
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

  if (!products.length) return null;
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
          className={`flex gap-4 overflow-x-auto scroll-smooth px-4 ${
            !showGradient.left && !showGradient.right
              ? "justify-center"
              : "justify-start"
          }`}
          ref={containerRef}
        >
          {products
            .filter((p) => p?._id !== productId)
            .map((product, index) => (
              <div
                key={index}
                className="shrink-0 w-[260px]"
                ref={index === products.length - 2 ? ref : null}
              >
                <ProductCard product={product} />
              </div>
            ))}
        </div>
        {showGradient.right && (
          <RightGradient className="h-full !w-5 !sm:w-20" />
        )}
      </div>
    </div>
  );
};

export default SimilarProducts;
