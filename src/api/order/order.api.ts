import { AxiosError } from "axios";
import api from "../../configs/axios.instance.config";
import { getUserToken } from "../../utils";
import { orderRoutes } from "../api.routes";
import { TQueryParams } from "../types";

export const create_order = async (addresses: TQueryParams) => {
  try {
    const user_token = getUserToken();

    const { method, url } = orderRoutes.createOrder;
    const response = await api.request({
      method,
      url,
      params: addresses,
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

export const verify_payment = async (data: TQueryParams) => {
  try {
    const user_token = getUserToken();

    const { method, url } = orderRoutes.verifyPayment;
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

export const cancel_payment = async (data: TQueryParams) => {
  try {
    const user_token = getUserToken();

    const { method, url } = orderRoutes.cancelPayment;
    const response = await api.request({
      method,
      url: `${url}/${data.orderId}`,
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
