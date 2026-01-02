import z from "zod";
import {
  CareIcon,
  DownloadIcon,
  HandCoinIcon,
  LogoutIcon,
  ReviewIcon,
  ShoppingBag,
  TrackIcon,
  TruckIcon,
  UserCircleIcon,
} from "../icons";
import { TChatData, TPasswordField, TRegexes } from "../types";
import { updateUserSchema } from "../pages/auth/helpers/auth.schema";

export * from "./categories";

export const AUTH_PROVIDERS = ["MANUAL", "GOOGLE"];

export const DEFAULT_FILTER = { name: "All", value: "all", default: true };
export const SORT_BY_OPTIONS = [
  { label: "Featured", value: "featured", disabled: false },
  { label: "Best selling", value: "best-selling", disabled: false },
  { label: "Alphabetically, A-Z", value: "a-z", disabled: false },
  { label: "Alphabetically, Z-A", value: "z-a", disabled: false },
  { label: "Price, low to high", value: "price-asc", disabled: false },
  { label: "Price, high to low", value: "price-desc", disabled: false },
  { label: "Date, old to new", value: "old", disabled: false },
  { label: "Date, new to old", value: "new", disabled: false },
  { label: "Top rated", value: "top-rated", disabled: true }, // Backend Logic has to be changed
];

export const REVIEWS_OPTIONS = [
  { name: "Most Recent", value: "most-recent", disabled: false },
  { name: "Most Early", value: "most-early", disabled: false },
  { name: "Highest Rating", value: "highest-rating", disabled: false },
  { name: "Lowest Rating", value: "lowest-rating", disabled: false },
  { name: "With Videos", value: "with-videos", disabled: false },
  { name: "With Images", value: "with-images", disabled: false },
  { name: "Images & Videos", value: "images-and-videos", disabled: false },
  { name: "Most Helpful", value: "most-helpful", disabled: false },
  { name: "Most Liked", value: "most-liked", disabled: false },
  { name: "Most Disliked", value: "most-disliked", disabled: false },
];

export const ORDER_STATUS_OPTIONS = [
  { name: "All", value: "", disabled: false },
  { name: "Pending", value: "pending", disabled: false },
  { name: "Failed", value: "failed", disabled: false },
  { name: "Confirmed", value: "confirmed", disabled: false },
  { name: "Delivered", value: "delivered", disabled: false },
  { name: "Cancelled", value: "cancelled", disabled: false },
  { name: "Returned", value: "returned", disabled: false },
];

export const CATEGORY_VIDEOS = [
  {
    src: "/videos/product/offers.mp4",
    title: "Product Offers 1",
  },
  {
    src: "/videos/product/offers.mp4",
    title: "Product Offers 2",
  },
  {
    src: "/videos/product/offers.mp4",
    title: "Product Offers 3",
  },
];

export const MB = 1024 ** 2;
export const MAX_IMAGE_FILE_SIZE = 2 * MB; // 2MB
export const MAX_VIDEO_FILE_SIZE = 50 * MB; // 50MB

export const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/jpg",
];

export const PASSWORD_FIELDS: TPasswordField[] = [
  "password",
  "confirmPassword",
] as const;

export const ALLOWED_VIDEO_TYPES = ["video/mp4", "video/webm"];

export const regexes: Record<TRegexes, RegExp> = {
  noSpace: /^\S+$/, // No spaces allowed
  singleSpace: /^(?!.* {2,}).*$/s, // Single space allowed
  hexCode: /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/, // Hex color code
  date: /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(?:\.\d+)?(Z|([+-]\d{2}:\d{2}))?)?$/, // Date e.g. 2022-01-01T12:00:00Z
  validName: /^(?!.*\d)(?!.* {2})([A-Za-z]+( [A-Za-z]+)*)$/, // Only letters & single space
  password: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&#])(?=\S.*$).{6,20}$/, // Password must contain at least one uppercase letter, one lowercase letter, one number, one special character, and be at least 6 characters long
  validEmail:
    /^[a-zA-Z0-9]+([._%+-]?[a-zA-Z0-9]+)*@[a-zA-Z0-9]+(-?[a-zA-Z0-9]+)*(\.[a-zA-Z]{2,})+$/, // Email e.g. 3oYQK@example.com
  phoneStart: /^[6-9]/, // Starts with 6, 7, 8, or 9
  phoneExactLength: /^\d{10}$/, // Exactly 10 digits
  validPhone: /^[6-9][0-9]{9}$/, // Phone number e.g. 9876543210
  atLeastOneUppercaseLetter: /[A-Z]/, // At least one uppercase letter
  atLeastOneLowercaseLetter: /[a-z]/, // At least one lowercase letter
  atLeastOneDigit: /\d/, // At least one digit
  atLeastOneSpecialCharacter: /[@$!%*?&#]/, // At least one special character
  onlyDigits: /^\d+$/, // All characters are digits
  onlyUppercase: /^[A-Z]+$/, // All characters are uppercase
  onlyLowercase: /^[a-z]+$/, // All characters are lowercase
  onlyLetters: /^[a-zA-Z]+$/, // All characters are letters
  onlyLettersAndSpaces: /^[a-zA-Z\s]+$/, // All characters are letters and spaces
  onlyLettersAndSpacesAndDots: /^[a-zA-Z\s.]+$/, // Only letters, spaces, and dots
  validPinCode: /^[1-9][0-9]{5}$/, // Check valid pin code
  validOTP: /^[0-9]{6}$/,
  validGST: /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/i, // Check valid GST number
  validUrl:
    /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/[\w\-._~:/?#[\]@!$&'()*+,;=%]*)?$/i,
  validPan: /^[A-Za-z]{5}[0-9]{4}[A-Za-z]$/,
};

export const reviewInitialValues = {
  title: "",
  comment: "",
  rating: 1,
  media: [],
};

export const ADDRESS_TYPES = ["shipping", "billing", "both"];
export const STATES_AND_UNION_TERRITORIES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  // Union Territories
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi (National Capital Territory of Delhi)",
  "Jammu and Kashmir",
  "Ladakh",
  "Lakshadweep",
  "Puducherry",
];

export const ALLOWED_COUNTRIES = ["India"];

export const ALLOWED_PAYMENT_MODE = ["ONLINE"];

export const ORDER_STATUS = [
  "PENDING",
  "PROCESSING",
  "FAILED",
  "CONFIRMED",
  "DELIVERED",
  "CANCELLED",
  "RETURNED",
];

export const ALLOWED_CURRENCIES = ["INR"];

export const RAZORPAY_PAYMENT_METHODS = [
  "CARD",
  "UPI",
  "NETBANKING",
  "WALLET",
  // "PAYLATER", // *LINK - Not Implemented yet in FRONTEND & BACKEND
  // "EMI", // *LINK - Not Implemented yet in FRONTEND & BACKEND
  "OTHER",
];

export const RAZORPAY_PAYMENT_STATUS = [
  "UNPAID",
  "CAPTURED",
  "PAID",
  "FAILED",
  "REFUNDED",
];

export const RAZORPAY_REFUND_PAYMENT_STATUS = [
  "REQUESTED",
  "APPROVED",
  "REFUNDED",
  "FAILED",
];

export const ORDER_STATUS_CLASSES: Record<
  (typeof ORDER_STATUS)[number],
  string
> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  PROCESSING: "bg-violet-100 text-violet-800",
  FAILED: "bg-red-100 text-red-800",
  CONFIRMED: "bg-blue-100 text-blue-800",
  DELIVERED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-200 text-red-900",
  RETURNED: "bg-purple-100 text-purple-800",
};

export const BRAND_FEATURE_HIGHLIGHTS = [
  {
    title: "Times Lifestyle Feature",
    description:
      "Interview with our founder on ethical beauty & clean formulas.",
    image: "Times-Lifestyle-Feature.webp",
  },
  {
    title: "Vogue India Special Edition",
    description:
      "Beautinique named as one of the top emerging beauty brands to watch.",
    image: "Vogue-India-Special-Edition.webp",
  },
  {
    title: "ELLE India Award",
    description:
      "Beautinique featured in ELLE India for redefining modern clean beauty standards.",
    image: "ELLE-India-Award.webp",
  },
  {
    title: "Cosmopolitan Beauty Awards",
    description: "Award nominee for Best Natural Skincare Line 2025.",
    image: "Cosmopolitan-Beauty-Awards.webp",
  },
];

export const ALLOWED_BUSINESSES = [
  "Individual",
  "Freelance Seller",
  "Small Business",
  "Home-based Seller",
  "Retail Store",
  "Salon",
  "Wholesale Distributor",
];

export const SIDEBAR_DATA = [
  {
    id: 1,
    label: "Account",
    icon: UserCircleIcon,
    path: "/account",
    className: "stroke-tertiary group-hover:stroke-primary",
  },
  {
    id: 2,
    label: "Cart",
    icon: ShoppingBag,
    path: "/account/cart",
    className: "stroke-tertiary group-hover:stroke-primary",
  },
  {
    id: 3,
    label: "Orders",
    icon: TruckIcon,
    path: "/account/orders",
    className: "stroke-tertiary group-hover:stroke-primary",
  },
  {
    id: 4,
    label: "Track Orders",
    icon: TrackIcon,
    path: "/account/track",
    className: "stroke-tertiary group-hover:stroke-primary",
  },
  {
    id: 5,
    label: "Refunds & Returns",
    icon: HandCoinIcon,
    path: "/account/orders/return-refund",
    className: "stroke-tertiary group-hover:stroke-primary",
  },
  {
    id: 6,
    label: "Reviews & Ratings",
    icon: ReviewIcon,
    path: "/account/reviews-and-ratings",
    className: "stroke-tertiary group-hover:stroke-primary",
  },
  {
    id: 7,
    label: "Customer Support",
    icon: CareIcon,
    path: "/account/contact",
    className: "fill-tertiary group-hover:fill-primary",
  },
  {
    id: 8,
    label: "Change Password",
    icon: DownloadIcon,
    path: "",
    className: "-rotate-90 stroke-tertiary group-hover:stroke-primary",
  },
  {
    id: 9,
    label: "Logout",
    icon: LogoutIcon,
    className: "stroke-tertiary group-hover:stroke-primary",
  },
];

export const CHAT_DEFAULT_DATA: TChatData[] = [
  {
    context: "products",
    description: "Ask about our products, their features, and details.",
    message:
      "Hello! Sir/Ma'am 👋 I can help you check your orders and deliveries.",
    suggestions: [
      "Can you recommend products based on my skin type?",
      "Which products are popular right now?",
      "Can you help me find a product within my budget?",
    ],
  },
  {
    context: "orders",
    description: "Check your order status or track your deliveries.",
    message:
      "Welcome! Sir/Ma'am 👋 You can ask me anything about our products.",
    suggestions: [
      "Where is my current order right now?",
      "Can you show me all my past orders?",
      "Can you help me track my recent order?",
    ],
  },
];

export const ORDER_CANCEL_REASONS = [
  "Changed my mind",
  "Ordered by mistake",
  "Found a better price elsewhere",
  "Product didn't meet my expectations",
  "Delivery would take too long",
  "Found a better alternative",
  "Issue with payment",
  "Bought the wrong product",
  "Other",
];

export const UPDATE_PROFILE_FIELDS: {
  name: keyof z.infer<typeof updateUserSchema>;
  label: string;
  placeholder: string;
  type?: string;
}[] = [
  { name: "firstName", label: "First Name", placeholder: "Enter first name" },
  { name: "lastName", label: "Last Name", placeholder: "Enter last name" },
  { name: "email", label: "Email", placeholder: "Enter email address" },
  {
    name: "phoneNumber",
    label: "Phone Number",
    placeholder: "Enter phone number",
    type: "number",
  },
];
