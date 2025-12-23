import CryptoJS from "crypto-js";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
dayjs.extend(localizedFormat);
import {
  dummyFeedbacks,
  highlightedCategoryOptions,
} from "../components/navbar/data";
import { envs } from "../envs/index.env";
import { FetchedReviewType, IOrder, TPossibleTimeFormats } from "../types";
import { ORDER_STATUS, ORDER_STATUS_CLASSES } from "../constants";
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

export const getUserToken = (): string | null => {
  try {
    const raw_token = getStorageToken();
    if (!raw_token) return null;

    const token = decryptData(raw_token) as string | null;
    if (!token) return null;

    return token;
  } catch (err) {
    console.error("Error fetching token:", err);
    return null;
  }
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

const defaultPoster = "/images/logo/BQ_gradient_logo.webp";

export function convertVideoToPoster(videoUrl: string): Promise<string> {
  return new Promise((resolve) => {
    if (!videoUrl) {
      resolve(defaultPoster);
      return;
    }

    try {
      // Case 1: Cloudinary URL → instant
      if (videoUrl.includes("/upload/")) {
        const [base, versionAndPath] = videoUrl.split("/upload/");
        const cleanedPath = versionAndPath.replace(/^.*?(\/v\d+)/, "$1");
        const posterPath = cleanedPath.replace(/\.(m3u8|mp4|webm)$/, ".webp");
        resolve(`${base}/upload/so_0${posterPath}`);
        return;
      }

      // Case 2: Blob URL or direct video file → async extract
      if (videoUrl.startsWith("blob:") || /\.(mp4|webm|ogg)$/i.test(videoUrl)) {
        getPosterFromBlobVideo(videoUrl)
          .then((poster) => resolve(poster || defaultPoster))
          .catch(() => resolve(defaultPoster));
        return;
      }

      // Fallback
      resolve(defaultPoster);
    } catch (error) {
      console.error("Failed to create poster URL", error);
      resolve(defaultPoster);
    }
  });
}

function getPosterFromBlobVideo(
  blobVideoUrl: string,
  timeInSeconds = 0
): Promise<string> {
  return new Promise((resolve) => {
    let posterCreated = false;
    let isCancelled = false;

    const video = document.createElement("video");
    video.src = blobVideoUrl;
    video.crossOrigin = "anonymous";
    video.muted = true;
    video.playsInline = true;

    video.addEventListener("loadeddata", () => {
      if (!isCancelled) video.currentTime = timeInSeconds;
    });

    video.addEventListener("seeked", () => {
      if (isCancelled) return;
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        resolve(defaultPoster);
        return;
      }

      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      posterCreated = true;
      resolve(canvas.toDataURL("image/png"));
      video.src = "";
    });

    video.addEventListener("error", () => {
      if (!posterCreated && !isCancelled) {
        resolve(defaultPoster); // no console.error to avoid noise
      }
    });

    // Cancel function for cleanup
    return () => {
      isCancelled = true;
      video.src = "";
    };
  });
}

export const formatDate = (
  date: Date | string | number | undefined | null,
  format: TPossibleTimeFormats = "DD-MM-YYYY"
) => {
  if (!date) return null;
  return dayjs(date).format(format);
};

export const getAvgRating = (reviews: FetchedReviewType[] = []) => {
  if (reviews.length === 0 || !reviews) return 0; // Return 0 if no reviews
  const totalRating = reviews.reduce(
    (acc, review) => acc + review?.rating || 0,
    0
  );
  const avgRating = totalRating / reviews.length;
  return avgRating;
};

export const formatPhoneNumber = (phone: string | number): string => {
  // Convert to string
  let num = String(phone).replace(/\D/g, ""); // remove non-digit chars

  // Check if number has country code
  if (num.length === 12 && num.startsWith("91")) {
    num = num.slice(2); // remove country code
  } else if (num.length === 13 && num.startsWith("+91")) {
    num = num.slice(3); // remove leading 0
  } else if (num.length === 11 && num.startsWith("0")) {
    num = num.slice(1); // remove leading 0
  }
  if (num.length !== 10) return phone.toString();

  return `+91 ${num.slice(0, 5)} ${num.slice(5)}`;
};

export const deepEqual = <T>(obj1: T, obj2: T): boolean => {
  if (obj1 === obj2) return true;

  if (
    typeof obj1 !== "object" ||
    typeof obj2 !== "object" ||
    obj1 === null ||
    obj2 === null
  ) {
    return false;
  }

  const keys1 = Object.keys(obj1) as (keyof T)[];
  const keys2 = Object.keys(obj2) as (keyof T)[];

  if (keys1.length !== keys2.length) return false;

  return keys1.every((key) => deepEqual(obj1[key], obj2[key]));
};

export const hexToRgba = (hex: string, alphaOverride?: number) => {
  const cleanHex = hex.replace("#", "");

  let r: number, g: number, b: number, a: number;

  if (cleanHex.length === 3) {
    // #abc → #aabbcc
    r = parseInt(cleanHex[0] + cleanHex[0], 16);
    g = parseInt(cleanHex[1] + cleanHex[1], 16);
    b = parseInt(cleanHex[2] + cleanHex[2], 16);
    a = 1;
  } else if (cleanHex.length === 4) {
    // #abcd → #aabbcc + alpha
    r = parseInt(cleanHex[0] + cleanHex[0], 16);
    g = parseInt(cleanHex[1] + cleanHex[1], 16);
    b = parseInt(cleanHex[2] + cleanHex[2], 16);
    a = parseInt(cleanHex[3] + cleanHex[3], 16) / 255;
  } else if (cleanHex.length === 6) {
    r = parseInt(cleanHex.substring(0, 2), 16);
    g = parseInt(cleanHex.substring(2, 4), 16);
    b = parseInt(cleanHex.substring(4, 6), 16);
    a = 1;
  } else if (cleanHex.length === 8) {
    r = parseInt(cleanHex.substring(0, 2), 16);
    g = parseInt(cleanHex.substring(2, 4), 16);
    b = parseInt(cleanHex.substring(4, 6), 16);
    a = parseInt(cleanHex.substring(6, 8), 16) / 255;
  } else {
    throw new Error(`Invalid hex color: ${hex}`);
  }

  if (typeof alphaOverride === "number") {
    a = alphaOverride;
  }

  return `rgba(${r}, ${g}, ${b}, ${a})`;
};

export const getOrderTrackStatus = (status: (typeof ORDER_STATUS)[number]) => {
  switch (status) {
    case "PENDING":
    case "PROCESSING":
      return [
        "PENDING",
        "PROCESSING",
        "PROCESSED",
        "CONFIRMED",
        "SHIPPED",
        "DELIVERED",
      ];
    case "FAILED":
      return ["PENDING", "PROCESSING", "FAILED"];
    case "CONFIRMED":
    case "DELIVERED":
      return [
        "PENDING",
        "PROCESSING",
        "PROCESSED",
        "CONFIRMED",
        "SHIPPED",
        "DELIVERED",
      ];
    case "CANCELLED":
      return ["PENDING", "PROCESSING", "PROCESSED", "CONFIRMED", "CANCELLED"];
    case "RETURNED":
      return [
        "PENDING",
        "PROCESSING",
        "PROCESSED",
        "CONFIRMED",
        "SHIPPED",
        "DELIVERED",
        "CANCELLED",
        "RETURNED",
      ];
    default:
      return ORDER_STATUS;
  }
};

export const getOrderSummaryFields = (order: IOrder) => {
  return [
    {
      field: "Status",
      value: order.status,
      className: `[&>span:nth-child(2)]:${
        ORDER_STATUS_CLASSES[order.status]
      } [&>span:nth-child(1)]:text-primary bg-transparent`,
    },
    {
      field: "Payment Mode",
      value: order?.payment.mode,
    },
    {
      field: "Order Receipt",
      value: order.payment.rzp_order_receipt?.replace("order_receipt_", ""), //LINK - To Remove "order_receipt" text
    },
    {
      field: "Payment Receipt",
      value: order.payment.rzp_payment_receipt?.replace("payment_receipt_", ""), //LINK - To Remove "payment_receipt" text
    },
    { field: "Total Price", value: toINRCurrency(order.payment.amount) },
    {
      field: "Discount",
      value: order?.discount > 0 ? `${order?.discount?.toFixed(2)}%` : null,
    },
    {
      field: "Del. Charges",
      value: order?.charges > 0 ? toINRCurrency(order.charges) : null,
    },
  ];
};
