import { AxiosError } from "axios";
import api from "../../configs/axios.instance.config";
import { LoginFormInputProps } from "../../types";
import { authRoutes } from "../api.routes";

// Using Email Id or Phone Number & Password (Type Manually)
export const login_user = async (data: Partial<LoginFormInputProps>) => {
  try {
    const { method, url } = authRoutes.login;
    const response = await api.request({ method, url, data });
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      // If it's an Axios error
      throw error?.response?.data?.message || "API Error occurred";
    }
    throw "Something went wrong!"; // For non-Axios errors
  }
};

// Manually Register
export const register_user = async (data: FormData) => {
  try {
    const { method, url } = authRoutes.login;
    const response = await api.request({ method, url, data });
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      // If it's an Axios error
      throw error?.response?.data?.message || "API Error occurred";
    }
    throw "Something went wrong!"; // For non-Axios errors
  }
};
