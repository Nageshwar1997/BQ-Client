export * from "./categories";
export const DEFAULT_FILTER = { name: "All", value: "all", default: true };
export const SORT_BY_OPTIONS = [
  { label: "Featured", value: "featured", disabled: false },
  { label: "Best selling", value: "best-selling", disabled: true },
  { label: "Top rated", value: "top-rated", disabled: false },
  { label: "Alphabetically, A-Z", value: "a-z", disabled: false },
  { label: "Alphabetically, Z-A", value: "z-a", disabled: false },
  { label: "Price, low to high", value: "price-low-high", disabled: false },
  { label: "Price, high to low", value: "price-high-low", disabled: false },
  { label: "Date, old to new", value: "date-old-new", disabled: false },
  { label: "Date, new to old", value: "date-new-old", disabled: false },
];
