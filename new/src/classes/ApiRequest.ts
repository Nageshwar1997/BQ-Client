import { getUserToken } from '@/utils/common.util';
import axios, { AxiosError, type AxiosInstance, type AxiosRequestConfig } from 'axios';
import ApiError from './ApiError';
import { API_BASE_URLS } from '@/constants/api.constant';

export class ApiRequest {
  private baseUrls = API_BASE_URLS;
  private instance: AxiosInstance;

  constructor(key: keyof typeof API_BASE_URLS) {
    const baseURL = this.baseUrls[key];
    this.instance = axios.create({ baseURL });
  }

  protected request = async (
    config: AxiosRequestConfig,
    options?: { isPrivateRoute?: boolean },
  ) => {
    try {
      if (options?.isPrivateRoute) {
        const token = getUserToken();
        if (token) {
          config.headers = { ...config.headers, Authorization: token };
        }
      }
      const { data } = await this.instance.request(config);
      return data;
    } catch (error) {
      if (error instanceof AxiosError) {
        const message = error.response?.data?.message || 'API Error occurred';
        const globalErrors = error.response?.data?.globalErrors;
        const fieldErrors = error.response?.data?.fieldErrors;
        const statusCode = error.response?.status;

        throw new ApiError({ message, globalErrors, fieldErrors, statusCode });
      }

      if (error instanceof Error) {
        throw new ApiError({ message: error.message });
      }

      throw new ApiError({ message: 'Something went wrong!' });
    }
  };
}
