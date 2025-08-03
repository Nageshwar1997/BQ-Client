import CryptoJS from "crypto-js";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
dayjs.extend(localizedFormat);
import {
  dummyFeedbacks,
  highlightedCategoryOptions,
} from "../components/navbar/data";
import { envs } from "../envs/index.env";
import { TPossibleTimeFormats } from "../types";
const TOKEN_KEY = "user_token";
const SECRET_KEY = envs.ENCRYPTION_SECRET_KEY;

export const encryptData = (data: object | string) => {
  const stringData = typeof data === "string" ? data : JSON.stringify(data);
  const encrypted = CryptoJS.AES.encrypt(stringData, SECRET_KEY);
  return encrypted.toString();
};

export const decryptData = (
  encryptedData: string | null
): object | string | null => {
  if (!encryptedData) return null;

  const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
  const decrypted = bytes.toString(CryptoJS.enc.Utf8);

  if (decrypted) {
    try {
      return JSON.parse(decrypted);
    } catch {
      return decrypted;
    }
  }

  return null;
};

const getLocalToken = () => localStorage.getItem(TOKEN_KEY);
const getSessionToken = () => sessionStorage.getItem(TOKEN_KEY);

const removeLocalToken = () => localStorage.removeItem(TOKEN_KEY);
const removeSessionToken = () => sessionStorage.removeItem(TOKEN_KEY);

export const saveLocalToken = (token: string) => {
  const encryptedToken = encryptData(token);
  localStorage.setItem(TOKEN_KEY, encryptedToken);
  removeSessionToken();
};
export const saveSessionToken = (token: string) => {
  const encryptedToken = encryptData(token);
  sessionStorage.setItem(TOKEN_KEY, encryptedToken);
  removeLocalToken();
};

const getStorageToken = () => {
  let token: string | null = null;
  const LToken = getLocalToken();
  const SToken = getSessionToken();
  if (LToken) {
    token = LToken;
  } else if (SToken) {
    token = SToken;
  }

  return token;
};

export const removeStorageToken = (): void => {
  removeLocalToken();
  removeSessionToken();
};

export const getUserToken = () => {
  const raw_token = getStorageToken();
  if (!raw_token) {
    throw new Error("No Token found");
  }

  const token = decryptData(raw_token) as string | null;
  if (!token) {
    throw new Error("No Token found");
  }
  return token;
};

export const getTodaysFeedback = (
  forwardIndex: 0 | 1 | 2 | 3 | 4 | 5 | 6 = 0
) => {
  // Get the current date
  const today = new Date();
  // Get the day of the month (1 to 31)
  const day = today.getDate();
  // Calculate the feedback index for today
  const feedbackIndex = (day + forwardIndex) % dummyFeedbacks.length;
  // Get the feedback for today
  const todayFeedback = dummyFeedbacks[feedbackIndex];

  return todayFeedback;
};

// It return a boolean value is level 3 category option is highlighted or not
export const isHighlightedOption = (option: string) =>
  highlightedCategoryOptions.includes(option);

export const debounce = <Args extends unknown[]>(
  fn: (...args: Args) => void,
  delay = 300
): ((...args: Args) => void) => {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: Args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};

export const toINRCurrency = (amount: number): string =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(amount);

export const getCurrentViewers = () => {
  const today = new Date();

  const day = today.getDate();
  const month = today.getMonth() + 1;
  const year = today.getFullYear();

  const total = day + month + year;

  return total;
};

export const convertVideoToPoster = (videoUrl: string) => {
  const defaultPoster = "/images/logo/BQ_gradient_logo.webp";
  if (!videoUrl) return defaultPoster;
  try {
    // Remove `/sp_auto/` or any transformation between `/upload/` and `/v...`
    const [base, versionAndPath] = videoUrl.split("/upload/");
    const cleanedPath = versionAndPath.replace(/^.*?(\/v\d+)/, "$1"); // Keep version and path

    // Replace .m3u8 or any extension with .jpg
    const posterPath = cleanedPath.replace(/\.(m3u8|mp4|webm)$/, ".webp");

    // Inject transformation `so_0` (seek to second 0)
    const finalUrl = `${base}/upload/so_0${posterPath}`;
    return finalUrl;
  } catch (error) {
    console.error("Failed to create poster URL", error);
    return defaultPoster;
  }
};

export const formatDate = (
  date: Date | string | number,
  format: TPossibleTimeFormats = "DD-MM-YYYY"
) => {
  return dayjs(date).format(format);
};
