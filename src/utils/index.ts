import CryptoJS from "crypto-js";
import {
  dummyFeedbacks,
  highlightedCategoryOptions,
} from "../components/navbar/data";
import { envs } from "../envs/index.env";

export const encryptData = (data: string): string => {
  return CryptoJS.AES.encrypt(data, envs.ENCRYPTION_SECRET_KEY).toString();
};

export const decryptData = (data: string): string => {
  return CryptoJS.AES.decrypt(data, envs.ENCRYPTION_SECRET_KEY).toString(
    CryptoJS.enc.Utf8
  );
};

export const saveUserLocal = (data: string) => {
  removeUserSession();
  localStorage.setItem("user_token", encryptData(JSON.stringify(data)));
};

export const saveUserSession = (data: string) => {
  removeUserLocal();
  sessionStorage.setItem("user_token", encryptData(JSON.stringify(data)));
};

export const getUserLocal = () => {
  const user_token = localStorage.getItem("user_token");
  if (user_token) {
    const decryptedData = decryptData(user_token);
    return JSON.parse(decryptedData);
  }
  return null;
};

export const getUserSession = () => {
  const userToken = localStorage.getItem("user_token");
  if (userToken) {
    const decryptedData = decryptData(userToken);
    return JSON.parse(decryptedData);
  }
  return null;
};

export const removeUserLocal = () => {
  localStorage.removeItem("user_token");
};

export const removeUserSession = () => {
  sessionStorage.removeItem("user_token");
};

export const getUserToken = () => {
  const user_token =
    localStorage.getItem("user_token") || sessionStorage.getItem("user_token");

  if (!user_token) {
    throw new Error("No Token found");
  }
  const decryptedData = decryptData(user_token);
  return JSON.parse(decryptedData);
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
