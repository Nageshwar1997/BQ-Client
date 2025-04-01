import { createBrowserRouter } from "react-router-dom";
import { lazy, Suspense } from "react";

// Lazy load route components
const Main = lazy(() => import("../pages/main/Main"));

import Home from "../pages/home/Home";
import RegisterRedirect from "./RegisterRedirect";
import LoginRedirect from "./LoginRedirect";
import NotFound from "../pages/error/NotFound";
import SomethingWentWrong from "../pages/error/SomethingWentWrong";
import LoadingScreen from "../components/loaders/LoadingScreen";
import CategoryProducts from "../pages/product/categoryProducts/CategoryProducts";
import Offers from "../pages/offers/Offers";
import Blogs from "../pages/blogs/Blogs";

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
    ],
  },
  {
    path: "register",
    element: <RegisterRedirect />,
  },
  {
    path: "login",
    element: <LoginRedirect />,
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
