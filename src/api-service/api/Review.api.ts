import type { IApiReviewQueryProps, TLikeDislikeHelpfulReview } from '@/types';
import { ApiRequest } from '../ApiRequest';

export class ReviewApi extends ApiRequest {
  protected add_review = (data: FormData, productId: string) => {
    const { method, url } = this.routes.reviews.add_review;
    return this.request({ method, url: `${url}/${productId}`, data }, { isPrivateRoute: true });
  };

  protected like_dislike_helpful = ({
    reviewId,
    ...data
  }: TLikeDislikeHelpfulReview & { reviewId: string }) => {
    const { method, url } = this.routes.reviews.like_dislike_helpful;
    return this.request({ method, url: `${url}/${reviewId}`, data }, { isPrivateRoute: true });
  };

  protected get_reviews_by_product_id = (params: Omit<IApiReviewQueryProps, 'enabled'>) => {
    const { queryParams = {}, ...restParams } = params ?? {};
    const { productId = '', ...restQueryParams } = queryParams;
    const { method, url } = this.routes.reviews.get_reviews_by_product_id;

    return this.request({
      method,
      url: `${url}/${productId}`,
      params: { ...restQueryParams, ...restParams },
    });
  };
}
