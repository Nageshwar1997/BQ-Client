import axios from "axios";
import { BACKEND_URL } from "../envs/index.env";

const api = axios.create({
  baseURL: `${BACKEND_URL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
  // withCredentials: true, // Enable this if cookies are required (e.g., JWT-based auth)
});

export default api;
