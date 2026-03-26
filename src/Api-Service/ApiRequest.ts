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
        const errors = error.response?.data?.errors;
        throw new ApiError(message, errors);
      }
      if (error instanceof Error) {
        throw new ApiError(error.message);
      }
      throw new ApiError('Something went wrong!');
    }
  };
}
