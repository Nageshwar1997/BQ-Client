import { getUserToken } from '@/utils/common.util';
import axios, { AxiosError, type AxiosInstance, type AxiosRequestConfig } from 'axios';
import { ApiError } from './ApiError';
import envs from '@/envs';
import { API_BASE_URLS, API_METHODS_AND_URLS } from '@/constants/api.constant';
import { ApiSuccess } from './ApiSuccess';

export const SERVICES_BASE_URLS = {
  'user-service': `${envs.urls.gateway}/user-service/api/v1`,
} as const;
export class ApiRequest {
  private baseUrls = API_BASE_URLS;
  private instance: AxiosInstance;

  constructor(key: keyof typeof API_BASE_URLS) {
    const baseURL = this.baseUrls[key];
    this.instance = axios.create({ baseURL });
  }

  protected routes = API_METHODS_AND_URLS;
  protected request = async <T = unknown>(
    config: AxiosRequestConfig,
    options?: { isPrivateRoute?: boolean },
  ): Promise<ApiSuccess<T>> => {
    try {
      if (options?.isPrivateRoute) {
        const token = getUserToken();
        if (token) {
          config.headers = { ...config.headers, Authorization: token };
        }
      }

      const { data } = await this.instance.request(config);

      return new ApiSuccess<T>({
        message: data?.message || 'Success',
        data: data?.data ?? data,
        statusCode: data?.statusCode,
      });
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
