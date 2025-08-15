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

const ReviewsSection = () => {
  const { params, queryParams, setParams, removeParam } = useQueryParams();
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
      productId: params.productId || "",
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
    <div className="w-full py-4 border-y border-y-primary-50 space-y-4 relative">
      <Dropdown
        title={
          REVIEWS_OPTIONS.find((o) => o.value === queryParams?.sortBy)?.name ??
          REVIEWS_OPTIONS[0].name
        }
        isAbsolute={true}
        closeOnOptionClick={true}
        closeOnOutsideClick={true}
        showShadow={true}
        className="!w-[180px] ml-auto [&>button]:border [&>button]:border-primary-30 [&>button]:rounded-md [&>div]:rounded-md sticky top-[65px]"
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
          className="w-full mx-auto mb-auto [&>h3]:text-base [&>h3]:base:text-base [&>h3]:sm:text-xl [&>h3]:md:text-2xl [&>h3]:lg:text-3xl [&>h3]:xl:text-4xl [&>h3]:uppercase [&>p]:text-xs [&>p]:base:text-sm [&>p]:sm:text-base [&>p]:md:text-lg"
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
          className="w-full mx-auto [&>h3]:text-base [&>h3]:base:text-base [&>h3]:sm:text-xl [&>h3]:md:text-2xl [&>h3]:lg:text-3xl [&>h3]:xl:text-4xl [&>h3]:uppercase gap-5"
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
