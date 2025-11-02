import { IDepartment, TPasswordField, TRegexes } from "../types";

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

export const DEPARTMENT_AND_TEAMS_DATA: IDepartment[] = [
  {
    title: "Executive / Leadership",
    value: "executive_or_leadership",
    employees: [
      {
        name: "Shah Rukh Khan",
        role: "Founder",
        gender: "Male",
        image: "",
        description: {
          title: "Vision Beyond Beauty",
          description:
            "Just like every business built websites and came online, very soon, each one will have immersive beauty experiences. What we’re building today will shape how the world explores, feels, and enjoys beauty tomorrow.",
        },
      },
      { name: "Aamir Khan", role: "Co-Founder", gender: "Male", image: "" },
      {
        name: "Deepika Padukone",
        role: "CEO (Chief Executive Officer)",
        gender: "Female",
        image: "",
      },
      {
        name: "Akshay Kumar",
        role: "COO (Chief Operating Officer)",
        gender: "Male",
        image: "",
      },
      {
        name: "Kareena Kapoor",
        role: "CFO (Chief Financial Officer)",
        gender: "Female",
        image: "",
      },
      {
        name: "Ranveer Singh",
        role: "CMO (Chief Marketing Officer)",
        gender: "Male",
        image: "",
      },
      {
        name: "Priyanka Chopra",
        role: "CTO (Chief Technology Officer)",
        gender: "Female",
        image: "",
      },
      {
        name: "Hrithik Roshan",
        role: "CPO (Chief Product Officer)",
        gender: "Male",
        image: "",
      },
    ],
  },
  {
    title: "Product & Merchandising",
    value: "product_and_merchandising",
    employees: [
      {
        name: "Alia Bhatt",
        role: "Head of Product",
        gender: "Female",
        image: "",
        description: {
          title: "Crafting Icons",
          description:
            "Just like the world shifted from basic products to thoughtful experiences, beauty will move toward personalized science-led creation. We are designing formulas and innovation that redefine what true premium care feels like.",
        },
      },
      {
        name: "Varun Dhawan",
        role: "Category Manager",
        gender: "Male",
        image: "",
      },
      {
        name: "Kriti Sanon",
        role: "Merchandiser",
        gender: "Female",
        image: "",
      },
      {
        name: "Vicky Kaushal",
        role: "Product Analyst",
        gender: "Male",
        image: "",
      },
    ],
  },
  {
    title: "Technology / Engineering",
    value: "technology_or_engineering",
    employees: [
      {
        name: "Ranbir Kapoor",
        role: "Head of Engineering",
        gender: "Male",
        image: "",
        description: {
          title: "Engineering Tomorrow",
          description:
            "Just like every major innovation reshaped how we live, tech will re-invent how beauty interacts with people. We build intelligent systems that make beauty smarter, simpler, and deeply personal for everyone.",
        },
      },
      {
        name: "Anushka Sharma",
        role: "Engineering Manager",
        gender: "Female",
        image: "",
      },
      {
        name: "Tiger Shroff",
        role: "Frontend Developer",
        gender: "Male",
        image: "",
      },
      {
        name: "Sara Ali Khan",
        role: "Backend Developer",
        gender: "Female",
        image: "",
      },
      {
        name: "Ayushmann Khurrana",
        role: "Full-stack Developer",
        gender: "Male",
        image: "",
      },
      {
        name: "Shraddha Kapoor",
        role: "Android/IOS Developer",
        gender: "Female",
        image: "",
      },
      {
        name: "Sidharth Malhotra",
        role: "DevOps Engineer",
        gender: "Male",
        image: "",
      },
      {
        name: "Taapsee Pannu",
        role: "QA Engineer",
        gender: "Female",
        image: "",
      },
      {
        name: "Rajkummar Rao",
        role: "UI/UX Designer",
        gender: "Male",
        image: "",
      },
    ],
  },
  {
    title: "Marketing & Growth",
    value: "marketing_and_growth",
    employees: [
      {
        name: "Katrina Kaif",
        role: "Head of Marketing",
        gender: "Female",
        image: "",
        description: {
          title: "Redefining Influence",
          description:
            "Just like storytelling evolved from print to screens and now to immersive experiences, beauty influence will transform too. We craft narratives that inspire confidence, culture, and meaningful connection.",
        },
      },
      {
        name: "Shahid Kapoor",
        role: "Digital Marketing Manager",
        gender: "Male",
        image: "",
      },
      {
        name: "Kiara Advani",
        role: "Content Writer",
        gender: "Female",
        image: "",
      },
      {
        name: "Nawazuddin Siddiqui",
        role: "SEO Specialist",
        gender: "Male",
        image: "",
      },
      {
        name: "Parineeti Chopra",
        role: "Social Media Manager",
        gender: "Female",
        image: "",
      },
      {
        name: "John Abraham",
        role: "Email Specialist",
        gender: "Male",
        image: "",
      },
      {
        name: "Madhuri Dixit",
        role: "Influencer Manager",
        gender: "Female",
        image: "",
      },
      {
        name: "Saif Ali Khan",
        role: "Graphic Designer",
        gender: "Male",
        image: "",
      },
    ],
  },
  {
    title: "Sales & Customer Engagement",
    value: "sales_and_customer_engagement",
    employees: [
      {
        name: "Ajay Devgn",
        role: "Head of Sales",
        gender: "Male",
        image: "",
        description: {
          title: "Relationships First",
          description:
            "Just like commerce evolved from shops to hyper-personal digital touchpoints, customer trust is evolving too. We are building a system where every interaction feels human, honest, and emotionally connected.",
        },
      },
      {
        name: "Jacqueline Fernandez",
        role: "BD Manager",
        gender: "Female",
        image: "",
      },
      {
        name: "Farhan Akhtar",
        role: "Client Success Manager",
        gender: "Male",
        image: "",
      },
      {
        name: "Disha Patani",
        role: "Sales Associate",
        gender: "Female",
        image: "",
      },
      {
        name: "Arjun Kapoor",
        role: "Customer Support",
        gender: "Male",
        image: "",
      },
      {
        name: "Vidya Balan",
        role: "Chat Support",
        gender: "Female",
        image: "",
      },
    ],
  },
  {
    title: "Operations & Logistics",
    value: "operations_and_logistics",
    employees: [
      {
        name: "Salman Khan",
        role: "Head of Operations",
        gender: "Male",
        image: "",
        description: {
          title: "Operational Mastery",
          description:
            "Just like global supply systems reinvented speed and quality, beauty logistics is entering a precision era. We ensure every product reaches with care, commitment, and seamless reliability.",
        },
      },
      {
        name: "Sonakshi Sinha",
        role: "Inventory Manager",
        gender: "Female",
        image: "",
      },
      {
        name: "Abhishek Bachchan",
        role: "Warehouse Manager",
        gender: "Male",
        image: "",
      },
      {
        name: "Sonam Kapoor",
        role: "Logistics Coordinator",
        gender: "Female",
        image: "",
      },
      {
        name: "R. Madhavan",
        role: "Vendor Manager",
        gender: "Male",
        image: "",
      },
      {
        name: "Radhika Apte",
        role: "Packaging Staff",
        gender: "Female",
        image: "",
      },
    ],
  },
  {
    title: "Finance & Admin",
    value: "finance_and_admin",
    employees: [
      {
        name: "Kartik Aaryan",
        role: "Finance Manager",
        gender: "Male",
        image: "",
        description: {
          title: "Strategic Stability",
          description:
            "Just like strong foundations built iconic companies, future-beauty brands need disciplined boldness. We balance smart risk with sustainable growth to create a brand built to last decades.",
        },
      },
      {
        name: "Bhumika Pednekar",
        role: "Accountant",
        gender: "Female",
        image: "",
      },
      {
        name: "Dulquer Salmaan",
        role: "Payroll Specialist",
        gender: "Male",
        image: "",
      },
      { name: "Nora Fatehi", role: "HR Manager", gender: "Female", image: "" },
      {
        name: "Dev Patel",
        role: "Office Administrator",
        gender: "Male",
        image: "",
      },
    ],
  },
  {
    title: "Data & Analytics",
    value: "data_and_analytics",
    employees: [
      {
        name: "Aishwarya Rai",
        role: "Head of Data",
        gender: "Female",
        image: "",
        description: {
          title: "Insights Into Action",
          description:
            "Just like data reshaped world-changing industries, beauty is stepping into an intelligent era. We turn numbers into intuition, enabling better products, deeper loyalty, and limitless innovation.",
        },
      },
      { name: "Raj Patel", role: "Data Analyst", gender: "Male", image: "" },
      { name: "Kajol Devgn", role: "BI Analyst", gender: "Female", image: "" },
      {
        name: "Kunal Kapoor",
        role: "Data Scientist",
        gender: "Male",
        image: "",
      },
      {
        name: "Urvashi Rautela",
        role: "Marketing Analyst",
        gender: "Female",
        image: "",
      },
    ],
  },
  {
    title: "Specialized Roles",
    value: "specialized_roles",
    employees: [
      {
        name: "Sridevi Kapoor",
        role: "Legal Counsel",
        gender: "Female",
        image: "",
        description: {
          title: "Ethics & Trust",
          description:
            "Just like the future demands transparency and fairness in all innovation, beauty needs legal integrity. We protect our mission with clarity, compliance, and responsibility at every step.",
        },
      },
      {
        name: "Vivek Oberoi",
        role: "Cybersecurity Engineer",
        gender: "Male",
        image: "",
      },
      { name: "Aditi Sen", role: "Photographer", gender: "Female", image: "" },
      {
        name: "Manoj Bajpayee",
        role: "Content Moderator",
        gender: "Male",
        image: "",
      },
    ],
  },
];
export const ONLY_DEPARTMENTS: Omit<IDepartment, "employees">[] =
  DEPARTMENT_AND_TEAMS_DATA.map(({ title, value }) => ({ title, value }));
