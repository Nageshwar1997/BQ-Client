import { createBrowserRouter } from "react-router-dom";
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

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Suspense fallback={<LoadingScreen />}>
        <Main />
      </Suspense>
    ),
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "offers",
        element: <Offers />,
      },
      {
        path: "blogs",
        element: <Blogs />,
      },
      {
        path: "search",
        element: <SearchProducts />,
      },
      {
        path: "product/:productId",
        element: <ProductDetails />,
      },
      {
        path: "products/:levelOneCategory",
        element: <CategoryProducts />,
      },
      {
        path: "products/:levelOneCategory/:levelTwoCategory",
        element: <CategoryProducts />,
      },
      {
        path: "products/:levelOneCategory/:levelTwoCategory/:levelThreeCategory",
        element: <CategoryProducts />,
      },
      {
        path: "cart",
        element: (
          <PrivateRoute>
            <Cart />
          </PrivateRoute>
        ),
      },
    ],
  },
  {
    path: "register",
    element: (
      <AuthRedirect>
        <Register />
      </AuthRedirect>
    ),
  },
  {
    path: "login",
    element: (
      <AuthRedirect>
        <Login />
      </AuthRedirect>
    ),
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
