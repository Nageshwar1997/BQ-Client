import { createBrowserRouter, Outlet } from "react-router-dom";
import { lazy, Suspense } from "react";

// Lazy loaded main layout
const Main = lazy(() => import("../pages/main/Main"));

// Pages
import Home from "../pages/home/Home";
import { NotFound, SomethingWentWrong } from "../pages/error";
import LoadingScreen from "../components/loaders/LoadingScreen";
import CategoryProducts from "../pages/product/categoryProducts";
import Offers from "../pages/offers/Offers";
import Blogs from "../pages/blogs/Blogs";
import SearchProducts from "../pages/product/searchProducts/SearchProducts";
import ProductDetails from "../pages/product/productDetails/ProductDetails";
import PrivateRoute from "./PrivateRoute";
import Cart from "../pages/cart/Cart";
import Login from "../pages/auth/Login";
import AuthRedirect from "./AuthRedirect";
import Register from "../pages/auth/Register";
import Address from "../pages/address";
import Payment from "../pages/account/payment/Payment";
import Orders from "../pages/account/order/Orders";
import OrderDetails from "../pages/account/order/OrderDetails";
import Account from "../pages/account";
import AboutUs from "../pages/company/AboutUs";
import PartnerWithUs from "../pages/company/PartnerWithUs";
import Careers from "../pages/company/Careers";
import Sustainability from "../pages/company/Sustainability";
import Ethics from "../pages/company/Ethics";
import PressMedia from "../pages/company/PressMedia";
import Teams from "../pages/company/Teams";
import Wishlist from "../pages/quick-links/Wishlist";
import ReferFriend from "../pages/quick-links/ReferFriend";
import StoreLocator from "../pages/quick-links/StoreLocator";
import BecomeSeller from "../pages/quick-links/BecomeSeller";
import ContactUs from "../pages/services/ContactUs";
import HelpCenterFAQ from "../pages/services/HelpCenterFAQ";
import ShippingInfo from "../pages/services/ShippingInfo";
import OrderReturnRefund from "../pages/account/order/OrderReturnRefund";
import Accessibility from "../pages/legal-policies/Accessibility";
import Disclaimer from "../pages/legal-policies/Disclaimer";
import TermsAndConditions from "../pages/legal-policies/TermsAndConditions";
import CookiePolicy from "../pages/legal-policies/CookiePolicy";
import PrivacyPolicy from "../pages/legal-policies/PrivacyPolicy";
import TrackMyOrders from "../pages/account/order/TrackMyOrders";
import MissionVisionValues from "../pages/company/MissionVisionValues";
import Awards from "../pages/company/Awards";
import ValuesAndCulture from "../pages/company/ValuesAndCulture";
import RetailAndECommerce from "../pages/company/RetailAndECommerce";
import BlogDetails from "../pages/blogs/BlogDetails";
import Profile from "../pages/account/profile";
import MyReviewsAndRating from "../pages/account/reviews-and-ratings";
import TrackOrder from "../pages/account/order/TrackOrder";
import OAuthSuccess from "../pages/auth/OAuthSuccess";
import ResetPassword from "../pages/account/profile/ResetPassword";
import ForgotPassword from "../pages/account/profile/ForgotPassword";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Suspense fallback={<LoadingScreen />}>
        <Main />
      </Suspense>
    ),
    errorElement: <SomethingWentWrong />,
    children: [
      { index: true, element: <Home /> },
      { path: "offers", element: <Offers /> },
      {
        path: "blogs",
        element: <Outlet />,
        children: [
          { index: true, element: <Blogs /> },
          { path: ":blogId", element: <BlogDetails /> },
        ],
      },
      { path: "search", element: <SearchProducts /> },
      { path: "product/:productId", element: <ProductDetails /> },
      { path: "products/:levelOneCategory", element: <CategoryProducts /> },
      {
        path: "products/:levelOneCategory/:levelTwoCategory",
        element: <CategoryProducts />,
      },
      {
        path: "products/:levelOneCategory/:levelTwoCategory/:levelThreeCategory",
        element: <CategoryProducts />,
      },
      { path: "refer", element: <PrivateRoute children={<ReferFriend />} /> }, // Todo: Refer Part is Pending
      { path: "cart", element: <PrivateRoute children={<Cart />} /> },
      { path: "address", element: <PrivateRoute children={<Address />} /> },
      { path: "wishlist", element: <PrivateRoute children={<Wishlist />} /> },
      {
        path: "become-seller",
        element: <PrivateRoute children={<BecomeSeller />} />,
      },
      {
        path: "orders",
        element: <PrivateRoute children={<Outlet />} />,
        children: [
          { index: true, element: <Orders /> },
          { path: ":orderId", element: <OrderDetails /> }, // Todo: Cancel Order and Return Order Pending
          { path: "return-refund", element: <OrderReturnRefund /> }, // Todo: Pending
          {
            path: "track",
            element: <Outlet />,
            children: [
              { index: true, element: <TrackMyOrders /> },
              { path: ":orderId", element: <TrackOrder /> },
            ],
          },
          { path: "payment", element: <Payment /> },
        ],
      },
      {
        path: "account",
        element: <PrivateRoute children={<Account />} />,
        children: [
          {
            index: true,
            element: <Profile />,
          }, // Todo: Pending
          { path: "contact", element: <ContactUs /> },
          { path: "cart", element: <Cart /> },
          { path: "reviews-and-ratings", element: <MyReviewsAndRating /> },
          {
            path: "track",
            element: <Outlet />,
            children: [
              { index: true, element: <TrackMyOrders /> },
              { path: ":orderId", element: <TrackOrder /> },
            ],
          },
          {
            path: "orders",
            element: <PrivateRoute children={<Outlet />} />,
            children: [
              { index: true, element: <Orders /> },
              { path: ":orderId", element: <OrderDetails /> }, // Todo: Cancel Order and Return Order Pending
              { path: "return-refund", element: <OrderReturnRefund /> }, // Todo: Pending
            ],
          },
        ],
      },
      // Company Pages
      { path: "about-us", element: <AboutUs /> },
      { path: "partner-with-us", element: <PartnerWithUs /> },
      { path: "careers", element: <Careers /> },
      { path: "mission-vision", element: <MissionVisionValues /> },
      { path: "sustainability", element: <Sustainability /> },
      { path: "ethics", element: <Ethics /> },
      { path: "teams", element: <Teams /> },
      { path: "press-media", element: <PressMedia /> },
      { path: "awards", element: <Awards /> },
      { path: "values-and-culture", element: <ValuesAndCulture /> },
      { path: "retail-and-e-commerce", element: <RetailAndECommerce /> },

      // Quick Link Pages
      { path: "store-locator", element: <StoreLocator /> },
      // Services Pages
      { path: "contact", element: <ContactUs /> },
      { path: "help-center-faq", element: <HelpCenterFAQ /> },
      { path: "shipping-info", element: <ShippingInfo /> },
      // Legal Policies Pages
      { path: "privacy-policy", element: <PrivacyPolicy /> },
      { path: "cookie-policy", element: <CookiePolicy /> },
      { path: "terms-conditions", element: <TermsAndConditions /> },
      { path: "disclaimer", element: <Disclaimer /> },
      { path: "accessibility", element: <Accessibility /> },
    ],
  },
  { path: "register", element: <AuthRedirect children={<Register />} /> },
  { path: "login", element: <AuthRedirect children={<Login />} /> },
  {
    path: "forgot-password",
    element: <AuthRedirect children={<ForgotPassword />} />,
  },
  { path: "oauth-success", element: <OAuthSuccess /> },
  { path: "reset-password", element: <ResetPassword /> },
  { path: "*", element: <NotFound /> },
]);

export default router;
