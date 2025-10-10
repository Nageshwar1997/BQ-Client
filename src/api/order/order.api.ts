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
      data: { addresses },
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

export const verify_payment = async (data: any) => {
  try {
    const user_token = getUserToken();

    const { method, url } = orderRoutes.verifyPayment;
    const response = await api.request({
      method,
      url,
      data: {
        razorpay_order_id: data.razorpay_order_id,
        razorpay_payment_id: data.razorpay_payment_id,
        razorpay_signature: data.razorpay_signature,
        orderDBId: data.order._id,
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
