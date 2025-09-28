import { AxiosError } from "axios";
import api from "../../configs/axios.instance.config";
import { getUserToken } from "../../utils";
import { addressRoutes } from "../api.routes";
import { IAddress, IBaseAddress } from "../../types";

export const get_user_addresses = async () => {
  try {
    const user_token = getUserToken();

    const { method, url } = addressRoutes.getUserAddresses;
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

export const add_address = async (data: IBaseAddress) => {
  try {
    const user_token = getUserToken();

    const { method, url } = addressRoutes.addAddress;
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

export const update_address = async (data: Partial<IAddress>) => {
  const { _id, ...restBody } = data;
  try {
    const user_token = getUserToken();

    const { method, url } = addressRoutes.updateAddress;
    const response = await api.request({
      method,
      url: `${url}/${_id}`,
      data: restBody,
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
