import { AxiosError } from "axios";
import api from "../../configs/axios.instance.config";

export const get_home_videos = async () => {
  try {
    const response = await api.get("/", {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      // If it's an Axios error
      throw error?.response?.data?.message || "API Error occurred";
    }
    throw "Something went wrong!"; // For non-Axios errors
  }
};
