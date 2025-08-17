import { AxiosError } from "axios";
import api from "../../configs/axios.instance.config";
import { IReviewsApiParams } from "../types";
import { reviewRoutes } from "../api.routes";
import { getUserToken } from "../../utils";

export const add_review = async (data: FormData, productId: string) => {
  const user_token = getUserToken();

  try {
    const { method, url } = reviewRoutes.addReview;
    const response = await api.request({
      method,
      url: `${url}/${productId}`,
      data,
      headers: {
        Authorization: user_token,
        "Content-Type": "multipart/form-data",
      },
    });

    console.log("response", response.data);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw error?.response?.data?.message || "API Error occurred";
    }
    throw "Something went wrong!";
  }
};

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
