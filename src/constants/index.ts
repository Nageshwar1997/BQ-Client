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

export const ORDER_STATUS_OPTIONS = [
  { name: "All", value: "", disabled: false },
  { name: "Pending", value: "pending", disabled: false },
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
  validGST: /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/i, // Check valid GST number
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
  "PAID",
  "FAILED",
  "REFUNDED",
  "CANCELLED",
];

export const ORDER_STATUS_CLASSES: Record<
  (typeof ORDER_STATUS)[number],
  string
> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  CONFIRMED: "bg-blue-100 text-blue-800",
  DELIVERED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
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

export const DEPARTMENTS = [
  {
    name: "Executive / Leadership",
    value: "executive_or_leadership",
    roles: [
      {
        name: "Founder / Co-Founder",
        value: "founder_or_co-founder",
        employees: [],
      },
      { name: "CEO (Chief Executive Officer)", value: "ceo", employees: [] },
      { name: "COO (Chief Operating Officer)", value: "coo", employees: [] },
      { name: "CFO (Chief Financial Officer)", value: "cfo", employees: [] },
      { name: "CMO (Chief Marketing Officer)", value: "cmo", employees: [] },
      { name: "CTO (Chief Technology Officer)", value: "cto", employees: [] },
      { name: "CPO (Chief Product Officer)", value: "cpo", employees: [] },
    ],
  },
  {
    name: "Product & Merchandising",
    value: "product_and_merchandising",
    roles: [
      {
        name: "Head of Product / VP of Product",
        value: "head_of_product_or_vp_of_product",
        employees: [],
      },
      { name: "Category Manager", value: "category_manager", employees: [] },
      { name: "Merchandiser", value: "merchandiser", employees: [] },
      {
        name: "Product Analyst / Specialist",
        value: "product_analyst_or_specialist",
        employees: [],
      },
    ],
  },
  {
    name: "Technology / Engineering",
    value: "technology_or_engineering",
    roles: [
      {
        name: "VP / Head of Engineering",
        value: "vp_or_head_of_engineering",
        employees: [],
      },
      {
        name: "Tech Lead / Engineering Manager",
        value: "tech_lead_or_engineering_manager",
        employees: [],
      },
      {
        name: "Frontend Developer",
        value: "frontend_developer",
        employees: [],
      },
      { name: "Backend Developer", value: "backend_developer", employees: [] },
      {
        name: "Full-stack Developer",
        value: "full-stack_developer",
        employees: [],
      },
      {
        name: "Mobile App Developer",
        value: "mobile_app_developer",
        employees: [],
      },
      {
        name: "DevOps / Cloud Engineer",
        value: "devops_or_cloud_engineer",
        employees: [],
      },
      {
        name: "QA Engineer / Tester",
        value: "qa_engineer_or_tester",
        employees: [],
      },
      { name: "UI/UX Designer", value: "ui-ux_designer", employees: [] },
    ],
  },
  {
    name: "Marketing & Growth",
    value: "marketing_and_growth",
    roles: [
      {
        name: "Head of Marketing / Growth",
        value: "head_of_marketing_or_growth",
        employees: [],
      },
      {
        name: "Digital Marketing Manager",
        value: "digital_marketing_manager",
        employees: [],
      },
      {
        name: "Content Writer / Copywriter",
        value: "content_writer_or_copywriter",
        employees: [],
      },
      {
        name: "SEO / SEM Specialist",
        value: "seo_or_sem_specialist",
        employees: [],
      },
      {
        name: "Social Media Manager / Specialist",
        value: "social_media_manager_or_specialist",
        employees: [],
      },
      {
        name: "Email Marketing Specialist",
        value: "email_marketing_specialist",
        employees: [],
      },
      {
        name: "Affiliate / Influencer Manager",
        value: "affiliate_or_influencer_manager",
        employees: [],
      },
      {
        name: "Graphic Designer / Video Creator",
        value: "graphic_designer_or_video_creator",
        employees: [],
      },
    ],
  },
  {
    name: "Sales & Customer Engagement",
    value: "sales_and_customer_engagement",
    roles: [
      {
        name: "Head / VP of Sales",
        value: "head_or_vp_of_sales",
        employees: [],
      },
      {
        name: "Business Development Manager",
        value: "business_development_manager",
        employees: [],
      },
      {
        name: "Account Manager / Client Success Manager",
        value: "account_manager_or_client_success_manager",
        employees: [],
      },
      {
        name: "Sales Executive / Associate",
        value: "sales_executive_or_associate",
        employees: [],
      },
      {
        name: "Customer Support / Customer Service Representative",
        value: "customer_support_or_representative",
        employees: [],
      },
      {
        name: "Chat / Email Support Specialist",
        value: "chat_or_email_support_specialist",
        employees: [],
      },
    ],
  },
  {
    name: "Operations & Logistics",
    value: "operations_and_logistics",
    roles: [
      {
        name: "Head of Operations / Supply Chain",
        value: "head_of_operations_or_supply_chain",
        employees: [],
      },
      {
        name: "Inventory Manager / Stock Controller",
        value: "inventory_manager_or_stock_controller",
        employees: [],
      },
      {
        name: "Warehouse Manager / Supervisor",
        value: "warehouse_manager_or_supervisor",
        employees: [],
      },
      {
        name: "Logistics / Delivery Coordinator",
        value: "logistics_or_delivery_coordinator",
        employees: [],
      },
      {
        name: "Procurement / Vendor Manager",
        value: "procurement_or_vendor_manager",
        employees: [],
      },
      {
        name: "Packaging / Fulfillment Staff",
        value: "packaging_or_fulfillment_staff",
        employees: [],
      },
    ],
  },
  {
    name: "Finance & Admin",
    value: "finance_and_admin",
    roles: [
      {
        name: "Finance Manager / Controller",
        value: "finance_manager_or_controller",
        employees: [],
      },
      {
        name: "Accountant / Bookkeeper",
        value: "accountant_or_bookkeeper",
        employees: [],
      },
      {
        name: "Payroll Specialist",
        value: "payroll_specialist",
        employees: [],
      },
      {
        name: "HR Manager / Recruiter",
        value: "hr_manager_or_recruiter",
        employees: [],
      },
      {
        name: "Office Administrator / Executive Assistant",
        value: "office_admin_or_executive_assistant",
        employees: [],
      },
    ],
  },
  {
    name: "Data & Analytics",
    value: "data_and_analytics",
    roles: [
      {
        name: "Head of Data / Analytics",
        value: "head_of_data_or_analytics",
        employees: [],
      },
      { name: "Data Analyst", value: "data_analyst", employees: [] },
      {
        name: "Business Intelligence (BI) Analyst",
        value: "business_intelligence_analyst",
        employees: [],
      },
      { name: "Data Scientist", value: "data_scientist", employees: [] },
      { name: "Marketing Analyst", value: "marketing_analyst", employees: [] },
    ],
  },
  {
    name: "Specialized Roles",
    value: "specialized_roles",
    roles: [
      {
        name: "Legal Counsel / Compliance Officer",
        value: "legal_counsel_or_compliance_officer",
        employees: [],
      },
      {
        name: "Cybersecurity Specialist / Engineer",
        value: "cybersecurity_specialist_or_engineer",
        employees: [],
      },
      {
        name: "Photographer / Videographer",
        value: "photographer_or_videographer",
        employees: [],
      },
      { name: "Content Moderator", value: "content_moderator", employees: [] },
    ],
  },
];
