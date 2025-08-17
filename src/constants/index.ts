import { TPasswordField, TRegexes } from "../types";

export * from "./categories";
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
  name: /^(?!.*\d)(?!.* {2})([A-Za-z]+( [A-Za-z]+)*)$/, // Only letters & single space
  password: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&#])(?=\S.*$).{6,20}$/, // Password must contain at least one uppercase letter, one lowercase letter, one number, one special character, and be at least 6 characters long
  email:
    /^[a-zA-Z0-9]+([._%+-]?[a-zA-Z0-9]+)*@[a-zA-Z0-9]+(-?[a-zA-Z0-9]+)*(\.[a-zA-Z]{2,})+$/, // Email e.g. 3oYQK@example.com
  phoneStart: /^[6-9]/, // Starts with 6, 7, 8, or 9
  phoneExactLength: /^\d{10}$/, // Exactly 10 digits
  phone: /^[6-9][0-9]{9}$/, // Phone number e.g. 9876543210
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
};

export const reviewInitialValues = {
  title: "",
  comment: "",
  rating: undefined,
  media: [],
};
