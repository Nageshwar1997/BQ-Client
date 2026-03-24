import { LoadingScreen } from '@/Components/Layout';
import ForgotPassword from '@/Pages/Auth/ForgotPassword';
import OAuth from '@/Pages/Auth/OAuth';
import Main from '@/Pages/Main';
import { lazy, Suspense } from 'react';
import { createBrowserRouter, Outlet } from 'react-router-dom';

const AuthRedirect = lazy(() => import('./AuthRedirect'));
const PrivateRoute = lazy(() => import('./PrivateRoute'));

const Auth = lazy(() => import('@/Pages/Auth'));
const Login = lazy(() => import('@/Pages/Auth/Login'));
const Register = lazy(() => import('@/Pages/Auth/Register'));

export const Routes = createBrowserRouter([
  {
    path: '/',
    element: (
      <Suspense fallback={<LoadingScreen />}>
        <Main />
      </Suspense>
    ),
    errorElement: <div>Error Page</div>,
    children: [
      { index: true, element: <div>Home</div> },
      { path: 'offers', element: <div>Offers</div> },
      {
        path: 'blogs',
        element: <Outlet />,
        children: [
          { index: true, element: <div>Blogs</div> },
          { path: ':blogId', element: <div>Blog Details</div> },
        ],
      },
      { path: 'search', element: <div>Search Products</div> },
      { path: 'product/:productId', element: <div>Product Details</div> },
      { path: 'products/:levelOneCategory', element: <div>Category Products</div> },
      {
        path: 'products/:levelOneCategory/:levelTwoCategory',
        element: <div>Category Products</div>,
      },
      {
        path: 'products/:levelOneCategory/:levelTwoCategory/:levelThreeCategory',
        element: <div>Category Products</div>,
      },
      { path: 'refer', element: <PrivateRoute children={<div>Refer Friend</div>} /> }, // Todo: Refer Part is Pending
      { path: 'cart', element: <PrivateRoute children={<div>Cart</div>} /> },
      { path: 'address', element: <PrivateRoute children={<div>Address</div>} /> },
      { path: 'wishlist', element: <PrivateRoute children={<div>Wishlist</div>} /> },
      {
        path: 'become-seller',
        element: <PrivateRoute children={<div>Become Seller</div>} />,
      },
      {
        path: 'orders',
        element: <PrivateRoute children={<Outlet />} />,
        children: [
          { index: true, element: <div>Orders</div> },
          { path: ':orderId', element: <div>Order Details</div> }, // Todo: Cancel Order and Return Order Pending
          { path: 'return-refund', element: <div>Order Return Refund</div> }, // Todo: Pending
          {
            path: 'track',
            element: <Outlet />,
            children: [
              { index: true, element: <div>TrackMyOrders</div> },
              { path: ':orderId', element: <div>TrackOrder</div> },
            ],
          },
          { path: 'payment', element: <div>Payment</div> },
        ],
      },
      {
        path: 'account',
        element: <PrivateRoute children={<div>Account</div>} />,
        children: [
          {
            index: true,
            element: <div>Profile</div>,
          }, // Todo: Pending
          { path: 'contact', element: <div>ContactUs</div> },
          { path: 'cart', element: <div>Cart</div> },
          { path: 'reviews-and-ratings', element: <div>MyReviewsAndRating</div> },
          {
            path: 'track',
            element: <Outlet />,
            children: [
              { index: true, element: <div>TrackMyOrders</div> },
              { path: ':orderId', element: <div>TrackOrder</div> },
            ],
          },
          {
            path: 'orders',
            element: <PrivateRoute children={<Outlet />} />,
            children: [
              { index: true, element: <div>Orders</div> },
              { path: ':orderId', element: <div>Order Details</div> }, // Todo: Cancel Order and Return Order Pending
              { path: 'return-refund', element: <div>Order Return Refund</div> }, // Todo: Pending
            ],
          },
        ],
      },
      // Company Pages
      { path: 'about-us', element: <div>AboutUs</div> },
      { path: 'partner-with-us', element: <div>PartnerWithUs</div> },
      { path: 'careers', element: <div>Careers</div> },
      { path: 'mission-vision', element: <div>MissionVisionValues</div> },
      { path: 'sustainability', element: <div>Sustainability</div> },
      { path: 'ethics', element: <div>Ethics</div> },
      { path: 'teams', element: <div>Teams</div> },
      { path: 'press-media', element: <div>PressMedia</div> },
      { path: 'awards', element: <div>Awards</div> },
      { path: 'values-and-culture', element: <div>ValuesAndCulture</div> },
      { path: 'retail-and-e-commerce', element: <div>RetailAndECommerce</div> },

      // Quick Link Pages
      { path: 'store-locator', element: <div>StoreLocator</div> },
      // Services Pages
      { path: 'contact', element: <div>ContactUs</div> },
      { path: 'help-center-faq', element: <div>HelpCenterFAQ</div> },
      { path: 'shipping-info', element: <div>ShippingInfo</div> },
      // Legal Policies Pages
      { path: 'privacy-policy', element: <div>PrivacyPolicy</div> },
      { path: 'cookie-policy', element: <div>CookiePolicy</div> },
      { path: 'terms-conditions', element: <div>TermsAndConditions</div> },
      { path: 'disclaimer', element: <div>Disclaimer</div> },
      { path: 'accessibility', element: <div>Accessibility</div> },
    ],
  },
  {
    path: 'auth',
    element: (
      <Suspense fallback={<LoadingScreen />}>
        <Auth />
      </Suspense>
    ),
    children: [
      {
        index: true,
        element: (
          <AuthRedirect>
            <Login />
          </AuthRedirect>
        ),
      },
      {
        path: 'register',
        element: (
          <AuthRedirect>
            <Register />
          </AuthRedirect>
        ),
      },
      {
        path: 'oauth',
        element: (
          <AuthRedirect>
            <OAuth />
          </AuthRedirect>
        ),
      },
      {
        path: 'forgot-password',
        element: (
          <AuthRedirect>
            <ForgotPassword />
          </AuthRedirect>
        ),
      },
    ],
  },
]);
