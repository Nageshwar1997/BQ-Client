import {
  GitHubFillIcon,
  FaceBookFillIcon,
  InstagramFillIcon,
  LinkedInBoxFillIcon,
  YoutubeFillIcon,
  WhatsappFillIcon,
} from "../../icons";

export const awards = [
  {
    name: "Forbes",
    darkImage: "/images/footer/Forbes-dark.webp",
    lightImage: "/images/footer/Forbes-light.webp",
  },
  {
    name: "Talent Award",
    darkImage: "/images/footer/TalentAward-dark.webp",
    lightImage: "/images/footer/TalentAward-light.webp",
  },
];

export const footerCategories = [
  {
    title: "Company",
    options: [
      { title: "About Us", disable: true },
      { title: "Partner With Us", disable: true },
      { title: "Careers", disable: true },
      { title: "Sustainability", disable: true },
      { title: "Ethics", disable: true },
      { title: "Press/Media", disable: true },
    ],
  },
  {
    title: "Quick Links",
    options: [
      { title: "My Account", disable: true },
      { title: "Order History", path: "account/orders" },
      { title: "Wishlist", disable: true },
      { title: "Refer a Friend", disable: true },
      { title: "Store Locator", disable: true },
      { title: "Become a Seller", disable: true },
    ],
  },
  {
    title: "Products",
    options: [
      { title: "For You", path: "products/for_you" },
      { title: "Lip Care", path: "products/lips" },
      { title: "Special Collection", path: "products/collections" },
      { title: "Face Care", path: "products/face" },
      { title: "Skin Care", path: "products/skin" },
      { title: "Eye Care", path: "products/eyes" },
    ],
  },
  {
    title: "Services",
    options: [
      { title: "Contact Us", disable: true },
      { title: "Help Center/FAQ", disable: true },
      { title: "Shipping Info", disable: true },
      { title: "Returns & Refunds", disable: true },
      { title: "Track My Order", disable: true },
    ],
  },
  {
    title: "Legal & Policies",
    options: [
      { title: "Privacy Policy", disable: true },
      { title: "Cookie Policy", disable: true },
      { title: "Terms & Conditions", disable: true },
      { title: "Disclaimer", disable: true },
      { title: "Accessibility", disable: true },
    ],
  },
];

export const socialMediaLinks = [
  {
    id: 1,
    icon: <YoutubeFillIcon />,
    url: "https://www.youtube.com/@nageshpawar1997",
  },
  {
    id: 2,
    icon: <InstagramFillIcon />,
    url: "https://www.instagram.com/aspiring_web_developer",
  },
  {
    id: 3,
    icon: <LinkedInBoxFillIcon />,
    url: "https://www.linkedin.com/in/nageshwar-pawar-a25041289",
  },
  {
    id: 4,
    icon: <FaceBookFillIcon />,
    url: "https://www.facebook.com/nageshwar1997",
  },
  {
    id: 5,
    icon: <GitHubFillIcon />,
    url: "https://github.com/nageshwar1997",
  },
  {
    id: 6,
    icon: <WhatsappFillIcon />,
    url: "https://wa.me/+919730870409",
  },
];
