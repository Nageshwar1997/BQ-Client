export * from "./categories";
export const DEFAULT_FILTER = { name: "All", value: "all", default: true };
export const SORT_BY_OPTIONS = [
  { label: "Featured", value: "featured" },
  { label: "Best selling", value: "best-selling" },
  { label: "Alphabetically, A-Z", value: "a-z" },
  { label: "Alphabetically, Z-A", value: "z-a" },
  { label: "Price, low to high", value: "price-low-high" },
  { label: "Price, high to low", value: "price-high-low" },
  { label: "Date, old to new", value: "date-old-new" },
  { label: "Date, new to old", value: "date-new-old" },
];
