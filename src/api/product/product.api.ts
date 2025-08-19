import { AxiosError } from "axios";
import api from "../../configs/axios.instance.config";
import { productRoutes } from "../api.routes";
import { TGetProductsParams } from "../types";

export const get_all_products = async ({
  data,
  pageParams,
  queryParams,
}: TGetProductsParams) => {
  try {
    const { method, url } = productRoutes.getAllProducts;
    const response = await api.request({
      method,
      url,
      params: {
        ...pageParams,
        ...queryParams,
        populateFields: data?.populateFields,
        requiredFields: data?.requiredFields,
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

export const get_product_by_id = async ({
  data,
  queryParams,
}: TGetProductsParams) => {
  try {
    const { method, url } = productRoutes.getProductById;
    const response = await api.request({
      method,
      url: `${url}/${queryParams?.productId}`,
      params: {
        ...queryParams,
        populateFields: data?.populateFields,
        requiredFields: data?.requiredFields,
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
