import { API_ROUTES_AND_METHODS, BACKEND_URL } from '@/Constants';
import { getUserToken } from '@/Utils/Storage.util';
import axios, { AxiosError, type AxiosInstance, type AxiosRequestConfig } from 'axios';
import { ApiError } from './ApiError';

export class ApiRequest {
  private baseUrl = `${BACKEND_URL}/api`;
  private instance: AxiosInstance;

  constructor(url?: string) {
    const baseURL = url ?? this.baseUrl;
    this.instance = axios.create({ baseURL });
  }

  protected routes = API_ROUTES_AND_METHODS;
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
        throw new ApiError({ message: error.message, statusCode: 500 });
      }
      throw new ApiError({ message: 'Something went wrong!', statusCode: 500 });
    }
  };
}
