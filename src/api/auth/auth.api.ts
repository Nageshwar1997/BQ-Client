import { AxiosError } from 'axios';
import api from '../../configs/axios.instance.config';
import { LoginFormInputProps, type TLogin, type TParams } from '../../types';
import { authRoutes } from '../api.routes';

// Using Email Id or Phone Number & Password (Type Manually)
export const login_user = async (data: TLogin) => {
  try {
    const { method, url } = authRoutes.login;
    const response = await api.request({ method, url, data });
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      // If it's an Axios error
      throw error?.response?.data?.message || 'API Error occurred';
    }
    throw 'Something went wrong!'; // For non-Axios errors
  }
};

export const logout_user = async (userId: string) => {
  try {
    const { method, url } = authRoutes.logout;

    const response = await api.request({ method, url: `${url}/${userId}` });
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      // If it's an Axios error
      throw error?.response?.data?.message || 'API Error occurred';
    }
    throw 'Something went wrong!'; // For non-Axios errors
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
      throw error?.response?.data?.message || 'API Error occurred';
    }
    throw 'Something went wrong!'; // For non-Axios errors
  }
};

export const register_user_resend_otp = async (data: TParams) => {
  try {
    const { method, url } = authRoutes.register_resend_otp;
    const response = await api.request({ method, url, params: data });
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      // If it's an Axios error
      throw error?.response?.data?.message || 'API Error occurred';
    }
    throw 'Something went wrong!'; // For non-Axios errors
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
      throw error?.response?.data?.message || 'API Error occurred';
    }
    throw 'Something went wrong!'; // For non-Axios errors
  }
};
