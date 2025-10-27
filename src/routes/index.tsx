import { createBrowserRouter, Outlet } from "react-router-dom";
import { lazy, Suspense } from "react";

// Lazy load route components
const Main = lazy(() => import("../pages/main/Main"));

import Home from "../pages/home/Home";
import NotFound from "../pages/error/NotFound";
import SomethingWentWrong from "../pages/error/SomethingWentWrong";
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

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Suspense fallback={<LoadingScreen />}>
        <Main />
      </Suspense>
    ),
    children: [
      { index: true, element: <Home /> },
      { path: "offers", element: <Offers /> },
      { path: "blogs", element: <Blogs /> },
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
      { path: "cart", element: <PrivateRoute children={<Cart />} /> },
      { path: "address", element: <PrivateRoute children={<Address />} /> },
      {
        path: "account",
        element: <PrivateRoute children={<Outlet />} />,
        children: [
          { index: true, element: <Account /> },
          {
            path: "orders",
            element: <Outlet />,
            children: [
              { index: true, element: <Orders /> },
              { path: ":orderId", element: <OrderDetails /> },
              { path: "payment", element: <Payment /> },
            ],
          },
        ],
      },
      {
        path: "company",
        element: <Outlet />,
        children: [
          { index: true, path: "about", element: <AboutUs /> },
          { path: "partner-with-us", element: <PartnerWithUs /> },
          { path: "careers", element: <Careers /> },
          { path: "sustainability", element: <Sustainability /> },
          { path: "ethics", element: <Ethics /> },
          { path: "teams", element: <Teams /> },
          { path: "press-media", element: <PressMedia /> },
        ],
      },
    ],
  },
  {
    path: "register",
    element: <AuthRedirect children={<Register />} />,
  },
  {
    path: "login",
    element: <AuthRedirect children={<Login />} />,
  },
  {
    path: "error",
    element: <SomethingWentWrong />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default router;
