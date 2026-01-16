import axios, { AxiosError, type AxiosInstance, type AxiosRequestConfig } from 'axios';
import { apiRoutes, BACKEND_URL } from '../constants';

class Request {
  private baseUrl = `${BACKEND_URL}/api`;
  private instance: AxiosInstance = axios.create({ baseURL: this.baseUrl });
  protected routes = apiRoutes;
  protected request = async (config: AxiosRequestConfig) => {
    try {
      const { data } = await this.instance.request(config);
      return data;
    } catch (error) {
      let message = 'Something went wrong!';
      if (error instanceof AxiosError) {
        message = error.response?.data?.message || 'API Error occurred';
      } else if (error instanceof Error) {
        message = error.message;
      }
      throw message;
    }
  };
}

export default Request;
