import { AxiosError } from "axios";
import api from "../../configs/axios.instance.config";
import { IReviewsApiParams } from "../types";
import { reviewRoutes } from "../api.routes";

export const get_reviews_by_product_id = async ({
  pageParams,
  queryParams,
  data = {},
}: IReviewsApiParams) => {
  try {
    const { method, url } = reviewRoutes.getReviewsByProductId;
    const response = await api.request({
      method,
      url: `${url}/${queryParams?.productId}`,
      params: {
        ...pageParams,
        ...queryParams,
        populateFields: data?.populateFields,
      },
    });

    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw error?.response?.data?.message || "API Error occurred";
    }
    throw "Something went wrong!";
  }
};
