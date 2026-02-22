import { useEffect, useMemo } from "react";
import { FetchedReviewType } from "../../../../types";
import ProductReviews from "./ProductReviews";
import Dropdown from "../../../../components/dropdown/Dropdown";
import useQueryParams from "../../../../hooks/useQueryParams";
import { REVIEWS_OPTIONS } from "../../../../constants";
import DropdownOptions from "../../../../components/dropdown/children/DropdownOptions";
import { useGetAllReviewsByProductIdInfinite } from "../../../../api/reviews/reviews.service";
import ShowError from "../../../../components/errors/ShowError";
import { useInView } from "react-intersection-observer";
import ReviewCardSkeleton from "../../../../components/skeletons/children/ReviewCardSkeleton";
import EmptyData from "../../../../components/empty-data/EmptyData";
import usePathParams from "../../../../hooks/usePathParams";

const ReviewsSection = () => {
  const { queryParams, setParams, removeParam } = useQueryParams();
  const { pathParams } = usePathParams();
  const { ref, inView } = useInView();

  const {
    data,
    isError,
    isLoading,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useGetAllReviewsByProductIdInfinite({
    pageParams: { limit: 2 },
    queryParams: {
      productId: pathParams.productId || "",
      sortBy: queryParams.sortBy,
    },
    data: {
      populateFields: { user: ["firstName", "lastName", "profilePic"] },
    },
  });

  const reviews: FetchedReviewType[] = useMemo(() => {
    return data?.pages.flatMap((page) => page.reviews) || [];
  }, [data]);

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  return (
    <div className="w-full py-4 border-t border-t-primary-50 space-y-4 relative">
      <Dropdown
        title={
          REVIEWS_OPTIONS.find((o) => o.value === queryParams?.sortBy)?.name ??
          REVIEWS_OPTIONS[0].name
        }
        isAbsolute={true}
        closeOnOptionClick={true}
        closeOnOutsideClick={true}
        showShadow={true}
        className="w-45! ml-auto [&>button]:border [&>button]:border-primary-30 [&>button]:rounded-md [&>div]:rounded-md sticky top-16.25"
      >
        <DropdownOptions
          options={REVIEWS_OPTIONS}
          selected={queryParams?.sortBy ?? REVIEWS_OPTIONS[0].value}
          onChange={(data) => {
            if (
              queryParams?.sortBy === data.value ||
              data.value === "most-recent"
            ) {
              removeParam("sortBy");
            } else {
              setParams({ sortBy: data.value });
            }
          }}
          className="[&>button]:text-nowrap bg-secondary-inverted"
        />
      </Dropdown>
      {isError ? (
        <ShowError
          headingText="Something went wrong!"
          descriptionText="Failed to get the reviews. Please reload the page"
          className="w-full mx-auto mb-auto [&>h3]:text-base base:[&>h3]:text-base sm:[&>h3]:text-xl md:[&>h3]:text-2xl lg:[&>h3]:text-3xl xl:[&>h3]:text-4xl [&>h3]:uppercase [&>p]:text-xs base:[&>p]:text-sm sm:[&>p]:text-base md:[&>p]:text-lg"
        />
      ) : isLoading ? (
        Array.from({ length: 5 }).map((_, index) => (
          <ReviewCardSkeleton
            key={index}
            className={`${index !== 4 ? "border-b border-b-primary-10" : ""} ${
              index === 0 ? "pt-4" : ""
            }`}
          />
        ))
      ) : reviews.length === 0 ? (
        <EmptyData
          content={"Reviews not available"}
          className="w-full mx-auto [&>h3]:text-base base:[&>h3]:text-base sm:[&>h3]:text-xl md:[&>h3]:text-2xl lg:[&>h3]:text-3xl xl:[&>h3]:text-4xl [&>h3]:uppercase gap-5"
        />
      ) : reviews.length > 0 ? (
        <div className="flex flex-col gap-4">
          <ProductReviews reviews={reviews} ref={ref} />
          {isFetchingNextPage && (
            <ReviewCardSkeleton className="border-t border-t-primary-10 pt-4" />
          )}
        </div>
      ) : null}
    </div>
  );
};

export default ReviewsSection;
