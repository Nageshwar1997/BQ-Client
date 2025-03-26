import axios from "axios";
import envs from "../envs/index.env";

const api = axios.create({
  baseURL: `${envs.BACKEND_URL}`,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Enable this if cookies are required (e.g., JWT-based auth)
});

export default api;
