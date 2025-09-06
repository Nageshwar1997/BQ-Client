import { AxiosError } from "axios";
import api from "../../configs/axios.instance.config";
import { cartRoutes } from "../api.routes";
import { getUserToken } from "../../utils";
import { TQueryParams } from "../types";

export const add_product_to_cart = async (data: TQueryParams) => {
  try {
    const user_token = getUserToken();

    const { method, url } = cartRoutes.addProductToCart;
    const response = await api.request({
      method,
      url: `${url}/${data.productId}`,
      params: { ...(data.shadeId && { shadeId: data.shadeId }) },
      headers: { Authorization: user_token },
    });
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      // If it's an Axios error
      throw error?.response?.data?.message || "API Error occurred";
    }
    throw "Something went wrong!"; // For non-Axios errors
  }
};

export const get_user_cart = async () => {
  try {
    const user_token = getUserToken();

    const { method, url } = cartRoutes.getUserCart;
    const response = await api.request({
      method,
      url,
      headers: { Authorization: user_token },
    });
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      // If it's an Axios error
      throw error?.response?.data?.message || "API Error occurred";
    }
    throw "Something went wrong!"; // For non-Axios errors
  }
};
