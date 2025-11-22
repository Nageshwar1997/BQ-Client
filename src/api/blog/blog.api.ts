import { AxiosError } from "axios";
import api from "../../configs/axios.instance.config";
import { blogROutes } from "../api.routes";
import { TPageParams } from "../types";

export const get_all_blogs = async (pageParams: TPageParams) => {
  try {
    const { method, url } = blogROutes.getAllBlogs;
    const response = await api.request({ method, url, params: pageParams });
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      // If it's an Axios error
      throw error?.response?.data?.message || "API Error occurred";
    }
    throw "Something went wrong!"; // For non-Axios errors
  }
};

export const get_blog_by_id = async (id: string) => {
  try {
    const { method, url } = blogROutes.getBlogById;
    const response = await api.request({ method, url: `${url}/${id}` });
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      // If it's an Axios error
      throw error?.response?.data?.message || "API Error occurred";
    }
    throw "Something went wrong!"; // For non-Axios errors
  }
};
