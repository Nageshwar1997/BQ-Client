import { AxiosError } from "axios";
import api from "../../configs/axios.instance.config";
import { getUserToken } from "../../utils";
import { orderRoutes } from "../api.routes";
import { TPageParams, TQueryParams } from "../types";

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

export const get_all_orders = async (params: {
  queryParams: TQueryParams;
  pageParams?: TPageParams;
}) => {
  try {
    const user_token = getUserToken();

    const { method, url } = orderRoutes.getAllOrder;
    const response = await api.request({
      method,
      url,
      params: {
        ...params.pageParams,
        ...params.queryParams,
      },
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

export const get_order_by_id = async (orderId: string) => {
  try {
    const user_token = getUserToken();

    const { method, url } = orderRoutes.getOrderById;
    const response = await api.request({
      method,
      url: `${url}/${orderId}`,
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

export const cancel_order = async (orderId: string) => {
  try {
    const user_token = getUserToken();

    const { method, url } = orderRoutes.cancelOrder;
    const response = await api.request({
      method,
      url: `${url}/${orderId}`,
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
