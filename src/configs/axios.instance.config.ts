import axios from "axios";
import { getBackendURL } from "../utils";

const api = axios.create({ baseURL: `${getBackendURL()}/api` });

export default api;
