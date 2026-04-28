import axios, { AxiosError, type AxiosInstance, type AxiosRequestConfig } from 'axios';
import ApiError from './ApiError';
import { API_BASE_URLS, API_METHODS_AND_URLS } from '@/constants/api.constant';

interface AxiosRequestConfigWithRetry extends AxiosRequestConfig {
  _retry?: boolean;
}

type FailedQueueItem = {
  resolve: () => void;
  reject: (error: unknown) => void;
};

let isRefreshing = false;
let failedQueue: FailedQueueItem[] = [];

export class ApiRequest {
  private baseUrls = API_BASE_URLS;
  protected instance: AxiosInstance;

  constructor(key: keyof typeof API_BASE_URLS) {
    const baseURL = this.baseUrls[key];

    this.instance = axios.create({
      baseURL,
      withCredentials: true,
    });

    // 🔥 RESPONSE INTERCEPTOR (AUTO REFRESH + QUEUE)
    this.instance.interceptors.response.use(
      (res) => res,
      async (error: unknown) => {
        if (!axios.isAxiosError(error)) {
          return Promise.reject(error);
        }

        const axiosError = error;

        if (!axiosError.config) {
          return Promise.reject(error);
        }

        const originalRequest = axiosError.config as AxiosRequestConfigWithRetry;

        if (originalRequest.url?.includes('/auth/refresh')) {
          return Promise.reject(error);
        }

        if (axiosError.response?.status === 401 && !originalRequest._retry) {
          if (isRefreshing) {
            return new Promise<void>((resolve, reject) => {
              failedQueue.push({ resolve, reject });
            }).then(() => this.instance.request(originalRequest));
          }

          originalRequest._retry = true;
          isRefreshing = true;

          try {
            await this.instance.request(
              API_METHODS_AND_URLS.gateway.user_service.auth.token.refresh,
            );

            failedQueue.forEach((p) => p.resolve());
            failedQueue = [];

            return this.instance.request(originalRequest);
          } catch (err) {
            failedQueue.forEach((p) => p.reject(err));
            failedQueue = [];

            window.location.href = '/auth';

            return Promise.reject(err);
          } finally {
            isRefreshing = false;
          }
        }

        return Promise.reject(error);
      },
    );
  }

  protected request = async (config: AxiosRequestConfig) => {
    try {
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
