import axios, { AxiosError, type AxiosInstance, type AxiosRequestConfig } from 'axios';
import { apiRoutes, BACKEND_URL } from '@/Constants';
import { getUserToken } from '@/Utils';

export class ApiRequest {
  private baseUrl = `${BACKEND_URL}/api`;
  private instance: AxiosInstance;

  constructor(url?: string) {
    const baseURL = url ?? this.baseUrl;
    this.instance = axios.create({ baseURL });
  }

  protected routes = apiRoutes;
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
      let message = 'Something went wrong!';
      if (error instanceof AxiosError) {
        message = error.response?.data?.message || 'API Error occurred';
      } else if (error instanceof Error) {
        message = error.message;
      }
      throw new Error(message);
    }
  };
}
