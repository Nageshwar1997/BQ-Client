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
      { title: "About Us", path: "about-us" },
      { title: "Partner With Us", path: "partner-with-us" },
      { title: "Careers", path: "careers" },
      { title: "Sustainability", path: "sustainability" },
      { title: "Ethics", path: "ethics" },
      { title: "Press/Media", path: "press-media" },
    ],
  },
  {
    title: "Quick Links",
    options: [
      { title: "My Account", path: "account", private: true },
      { title: "Order History", path: "orders", private: true },
      { title: "Wishlist", path: "wishlist", private: true },
      { title: "Refer a Friend", path: "refer", private: true },
      { title: "Store Locator", path: "store-locator" },
      {
        title: "Become a Seller",
        path: "become-seller",
        private: true,
      },
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
      { title: "Contact Us", path: "contact" },
      { title: "Help Center/FAQ", path: "help-center-faq" },
      { title: "Shipping Info", path: "shipping-info" },
      {
        title: "Returns & Refunds",
        path: "orders/return-refund",
        private: true,
      },
      { title: "Track My Order", path: "orders/track", private: true },
    ],
  },
  {
    title: "Legal & Policies",
    options: [
      { title: "Privacy Policy", path: "privacy-policy" },
      { title: "Cookie Policy", path: "cookie-policy" },
      { title: "Terms & Conditions", path: "terms-conditions" },
      { title: "Disclaimer", path: "disclaimer" },
      { title: "Accessibility", path: "accessibility" },
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
