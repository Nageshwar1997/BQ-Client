import { AxiosError } from "axios";
import api from "../../configs/axios.instance.config";
import { cartRoutes } from "../api.routes";
import { getUserToken } from "../../utils";

export const add_product_to_cart = async (productId: string) => {
  try {
    const user_token = getUserToken();

    const { method, url } = cartRoutes.addProductToCart;
    const response = await api.request({
      method,
      url: `${url}/${productId}`,
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
