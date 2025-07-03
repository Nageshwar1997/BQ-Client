import CryptoJS from "crypto-js";
import {
  dummyFeedbacks,
  highlightedCategoryOptions,
} from "../components/navbar/data";
import { envs } from "../envs/index.env";
const TOKEN_KEY = "user_token";
const SECRET_KEY = envs.ENCRYPTION_SECRET_KEY;

// --- Encrypt/Decrypt Utility ---
export const encryptData = (data: object | string): string => {
  const stringData = typeof data === "string" ? data : JSON.stringify(data);
  return CryptoJS.AES.encrypt(stringData, SECRET_KEY).toString();
};

export const decryptData = (encrypted: string): string | null => {
  try {
    const bytes = CryptoJS.AES.decrypt(encrypted, SECRET_KEY);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    return decrypted || null;
  } catch (err) {
    console.error("Decryption failed:", err);
    return null;
  }
};

// --- Save Token ---
export const saveLocalToken = (data: string) => {
  removeSessionToken();
  localStorage.setItem(TOKEN_KEY, encryptData(data));
};

export const saveSessionToken = (data: string) => {
  removeLocalToken();
  sessionStorage.setItem(TOKEN_KEY, encryptData(data));
};

// --- Get Raw Token ---
export const getStorageToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
};

export const getUserToken = () => {
  const token = getStorageToken();
  if (!token) return null;

  const decrypted = decryptData(token);
  if (!decrypted) return null;

  try {
    return JSON.parse(decrypted);
  } catch (err) {
    console.error("JSON parsing failed:", err);
    return null;
  }
};

// --- Clear Token ---
export const removeLocalToken = () => localStorage.removeItem(TOKEN_KEY);
export const removeSessionToken = () => sessionStorage.removeItem(TOKEN_KEY);
export const removeStorageUser = () => {
  removeLocalToken();
  removeSessionToken();
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
