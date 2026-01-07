import { AxiosError } from "axios";
import api from "../../configs/axios.instance.config";
import { getUserToken } from "../../utils";
import { userRoutes } from "../api.routes";
import { TQueryParams } from "../types";

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

export const update_user_details = async (data: FormData) => {
  try {
    const user_token = getUserToken();
    const { method, url } = userRoutes.updateUser;
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

export const change_password = async (data: TQueryParams) => {
  try {
    const user_token = getUserToken();
    const { method, url } = userRoutes.changePassword;
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

export const update_password = async (data: TQueryParams) => {
  try {
    const user_token = getUserToken();
    const { method, url } = userRoutes.updatePassword;
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

export const check_reset_password_token_validity = async (token: string) => {
  try {
    const { method, url } = userRoutes.checkResetPasswordTokenValidity;
    const response = await api.request({
      method,
      url,
      headers: { Authorization: token },
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

export const check_forgot_password_token_validity = async (token: string) => {
  try {
    const { method, url } = userRoutes.checkForgotPasswordTokenValidity;
    const response = await api.request({
      method,
      url,
      headers: { Authorization: token },
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

export const reset_password_send_link = async () => {
  try {
    const user_token = getUserToken();
    const { method, url } = userRoutes.resetPasswordSendLink;
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

export const forgot_password_send_link = async (email: string) => {
  try {
    const { method, url } = userRoutes.forgotPasswordSendLink;
    const response = await api.request({
      method,
      url,
      data: { email },
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

export const forgot_password_resend_link = async (token: string) => {
  try {
    const { method, url } = userRoutes.forgotPasswordResendLink;
    const response = await api.request({
      method,
      url,
      headers: { Authorization: token },
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

export const reset_password = async (data: TQueryParams) => {
  try {
    const { token, ...restData } = data;
    const { method, url } = userRoutes.resetPassword;
    const response = await api.request({
      method,
      url,
      data: restData,
      headers: { Authorization: token },
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
export const forgot_password = async (data: TQueryParams) => {
  try {
    const { token, ...restData } = data;
    const { method, url } = userRoutes.forgotPassword;
    const response = await api.request({
      method,
      url,
      data: restData,
      headers: { Authorization: token },
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
