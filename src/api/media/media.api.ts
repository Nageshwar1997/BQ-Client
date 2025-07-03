import { AxiosError } from "axios";
import api from "../../configs/axios.instance.config";
import { mediaRoutes } from "../api.routes";

export const get_home_videos = async () => {
  try {
    const { method, url } = mediaRoutes.getHomeVideos;
    const response = await api.request({ method, url });
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      // If it's an Axios error
      throw error?.response?.data?.message || "API Error occurred";
    }
    throw "Something went wrong!"; // For non-Axios errors
  }
};
