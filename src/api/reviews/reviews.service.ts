import {
  keepPreviousData,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  add_review,
  get_reviews_by_product_id,
  update_like_dislike_helpful,
} from "./reviews.api";
import {
  IReviewsInfiniteApiParams,
  IReviewsApiParams,
  TLikeDislikeHelpfulReview,
} from "../types";
import useQueryParams from "../../hooks/useQueryParams";

// Add Review
export const useAddReview = () => {
  const { params } = useQueryParams();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["add_review"],
    mutationFn: (data: FormData) => add_review(data, params.productId || ""),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["get_reviews_by_product_id_infinite"],
      });
      queryClient.invalidateQueries({ queryKey: ["get_product_by_id"] });
    },
  });
};

// Like / Dislike / Helpful Review
export const useLikeDislikeHelpfulReview = () => {
  return useMutation({
    mutationKey: ["update_like_dislike_helpful"],
    mutationFn: (data: TLikeDislikeHelpfulReview) =>
      update_like_dislike_helpful(data),
  });
};

export const useGetAllReviewsByProductId = ({
  queryParams,
  pageParams,
  data,
  enabled = true,
}: IReviewsApiParams) => {
  return useQuery({
    queryKey: [
      "get_reviews_by_product_id_non_infinite",
      queryParams,
      pageParams,
    ],
    queryFn: () => get_reviews_by_product_id({ data, queryParams, pageParams }),
    enabled,
    placeholderData: keepPreviousData,
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
  });
};

// Infinite Reviews Query
export const useGetAllReviewsByProductIdInfinite = ({
  pageParams,
  queryParams,
  enabled = true,
  data = {},
  refetchOnWindowFocus = false,
}: IReviewsInfiniteApiParams) => {
  return useInfiniteQuery({
    queryKey: ["get_reviews_by_product_id_infinite", queryParams, pageParams],
    initialPageParam: 1,
    queryFn: async ({ pageParam = 1 }) => {
      return get_reviews_by_product_id({
        pageParams: { page: pageParam, limit: pageParams.limit },
        queryParams,
        data,
      });
    },
    enabled,
    refetchOnWindowFocus,
    staleTime: 0.5 * 60 * 1000, // 30 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes
    getNextPageParam: (lastPage, allPages) => {
      const hasMore = lastPage.reviews.length === pageParams.limit;
      return hasMore ? allPages.length + 1 : undefined;
    },
  });
};
