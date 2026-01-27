import {
  keepPreviousData,
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { ReviewApi } from '../api';
import { customHooks } from '../../hooks';
import { QUERY_KEYS } from '../../constants';
import { InvalidateQueries } from '../InvalidateQueries';
import { store } from '../../store';
import { toaster } from '../../utils';
import type { IApiReviewQueryProps } from '../../types';

export class ReviewService extends ReviewApi {
  public AddReview = () => {
    const { pathParams } = customHooks.PathParams();
    const qc = useQueryClient();
    const invalidate = new InvalidateQueries(qc);

    return useMutation({
      mutationKey: QUERY_KEYS.reviews.add_review,
      mutationFn: (data: FormData) => this.add_review(data, pathParams.productId ?? ''),
      onSuccess: () =>
        invalidate.multiple([
          QUERY_KEYS.products.product,
          QUERY_KEYS.reviews.get_reviews_by_product_id,
        ]),
    });
  };

  public LikeDislikeHelpful = () => {
    const { authenticated } = store.user();

    return useMutation({
      mutationKey: [...QUERY_KEYS.reviews.like_dislike_helpful, authenticated],
      mutationFn: this.like_dislike_helpful,
      onSuccess: ({ message }) => toaster('success', message),
      onError: ({ message }) => toaster('error', message),
    });
  };

  public GetReviewsByProductId = (props: IApiReviewQueryProps) => {
    const { enabled, pageParams, ...restProps } = props;
    const { queryParams } = restProps ?? {};
    const { authenticated } = store.user();

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
