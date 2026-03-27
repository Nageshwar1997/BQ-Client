import {
  keepPreviousData,
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { ReviewApi } from '../Api/Review.api';
import { Hook } from '@/Hooks';
import { InvalidateQueries } from '../InvalidateQueries';
import type { IApiReviewQueryProps } from '@/Types/Common.type';
import { QUERY_KEYS } from '@/Constants';
import { oldToaster } from '@/Utils/Common.util';
import { UserStore } from '@/Stores';

export class ReviewService extends ReviewApi {
  public AddReview = () => {
    const { pathParams } = Hook.PathParams();
    const qc = useQueryClient();
    const invalidate = new InvalidateQueries(qc);

    return useMutation({
      mutationKey: QUERY_KEYS.reviews.add_review,
      mutationFn: (data: FormData) => this.add_review(data, pathParams.productId ?? ''),
      onSuccess: ({ message }) => {
        oldToaster('success', message);
        invalidate.multiple([
          QUERY_KEYS.products.product,
          QUERY_KEYS.reviews.get_reviews_by_product_id,
        ]);
      },
      onError: ({ message }) => oldToaster('error', message),
    });
  };

  public LikeDislikeHelpful = () => {
    const { authenticated } = UserStore();

    return useMutation({
      mutationKey: [...QUERY_KEYS.reviews.like_dislike_helpful, authenticated],
      mutationFn: this.like_dislike_helpful,
      onSuccess: ({ message }) => oldToaster('success', message),
      onError: ({ message }) => oldToaster('error', message),
    });
  };

  public GetReviewsByProductId = (props: IApiReviewQueryProps) => {
    const { enabled, pageParams, ...restProps } = props;
    const { queryParams } = restProps ?? {};
    const { authenticated } = UserStore();

    return useInfiniteQuery({
      queryKey: [
        ...QUERY_KEYS.reviews.get_reviews_by_product_id,
        authenticated,
        queryParams,
        pageParams,
      ],
      initialPageParam: 1,
      queryFn: ({ pageParam = 1 }) =>
        this.get_reviews_by_product_id({
          ...restProps,
          pageParams: { page: pageParam, limit: pageParams?.limit ?? 10 },
        }),
      enabled,
      placeholderData: keepPreviousData,
      staleTime: 0.5 * 60 * 1000, // 30 seconds
      gcTime: 5 * 60 * 1000, // 5 minutes
      getNextPageParam: (lastPage, allPages) => {
        const hasMore = lastPage.reviews.length === pageParams?.limit;
        return hasMore ? allPages.length + 1 : undefined;
      },
    });
  };
}
