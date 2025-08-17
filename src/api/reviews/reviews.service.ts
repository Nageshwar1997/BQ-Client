import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";
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

export const useAddReview = () => {
  const { params } = useQueryParams();
  return useMutation({
    mutationKey: ["add_review"],
    mutationFn: (data: FormData) => add_review(data, params.productId || ""),
  });
};

export const useLikeDislikeHelpfulReview = () => {
  return useMutation({
    mutationKey: ["update_like_dislike_helpful"],
    mutationFn: (data: TLikeDislikeHelpfulReview) =>
      update_like_dislike_helpful({
        reviewId: data.reviewId,
        liked: data.liked,
        disliked: data.disliked,
        isHelpful: data.isHelpful,
      }),
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
  });
};

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
    getNextPageParam: (lastPage, allPages) => {
      const hasMore = lastPage.reviews.length === pageParams.limit;
      return hasMore ? allPages.length + 1 : undefined;
    },
  });
};
