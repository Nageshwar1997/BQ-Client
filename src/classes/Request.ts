import axios, { AxiosError, type AxiosInstance, type AxiosRequestConfig } from 'axios';
import { apiRoutes, BACKEND_URL } from '../constants';
import toast from 'react-hot-toast';

class Request {
  private baseUrl = `${BACKEND_URL}/api`;
  private instance: AxiosInstance = axios.create({ baseURL: this.baseUrl });
  protected routes = apiRoutes;
  private notify(message: string, type: 'success' | 'error' = 'success') {
    if (type === 'error') toast.error(message);
    else toast.success(message);
  }
  protected _toast(error: unknown, type: 'success' | 'error' = 'success') {
    const message = error instanceof Error ? error.message : String(error);
    this.notify(message, type);
  }
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
