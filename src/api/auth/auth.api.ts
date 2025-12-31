import { AxiosError } from "axios";
import api from "../../configs/axios.instance.config";
import { LoginFormInputProps } from "../../types";
import { authRoutes } from "../api.routes";
import { TQueryParams } from "../types";

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
export const register_user_send_otp = async (email: string) => {
  try {
    const { method, url } = authRoutes.register_send_otp;
    const response = await api.request({ method, url, params: { email } });
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      // If it's an Axios error
      throw error?.response?.data?.message || "API Error occurred";
    }
    throw "Something went wrong!"; // For non-Axios errors
  }
};

export const register_user_resend_otp = async (data: TQueryParams) => {
  try {
    const { method, url } = authRoutes.register_resend_otp;
    const response = await api.request({ method, url, params: data });
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      // If it's an Axios error
      throw error?.response?.data?.message || "API Error occurred";
    }
    throw "Something went wrong!"; // For non-Axios errors
  }
};

export const register_user_verify_otp = async ({
  otpToken,
  data,
}: {
  otpToken: string;
  data: FormData;
}) => {
  try {
    const { method, url } = authRoutes.register_verify_otp;
    const response = await api.request({
      method,
      url,
      data,
      params: { otpToken },
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
