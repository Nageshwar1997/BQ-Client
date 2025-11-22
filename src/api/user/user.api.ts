import { AxiosError } from "axios";
import api from "../../configs/axios.instance.config";
import { getUserToken } from "../../utils";
import { userRoutes } from "../api.routes";

export const get_user_details = async () => {
  try {
    const user_token = getUserToken();
    const { method, url } = userRoutes.getUser;
    const response = await api.request({
      method,
      url,
      headers: { Authorization: user_token },
    });
    return response.data;
  } catch (error) {
    const user = sessionStorage.getItem("user");
    if (user) {
      sessionStorage.removeItem("user");
    }
    if (error instanceof AxiosError) {
      // If it's an Axios error
      throw error?.response?.data?.message || "API Error occurred";
    }
    throw "Something went wrong!"; // For non-Axios errors
  }
};

export const create_seller_request = async (data: FormData) => {
  try {
    const user_token = getUserToken();
    const { method, url } = userRoutes.createSeller;
    const response = await api.request({
      method,
      url,
      data,
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

export const get_user_wishlist = async () => {
  try {
    const user_token = getUserToken();
    const { method, url } = userRoutes.wishlist;
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

export const add_wishlist_product = async (productId: string) => {
  try {
    const user_token = getUserToken();
    const { method, url } = userRoutes.addWishlistProduct;
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

export const remove_wishlist_product = async (productId: string) => {
  try {
    const user_token = getUserToken();
    const { method, url } = userRoutes.removeWishlistProduct;
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
