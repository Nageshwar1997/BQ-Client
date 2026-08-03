import { type ComponentType } from 'react';
import { Outlet, type RouteObject } from 'react-router-dom';

import LoadingScreen from '@/components/layout/loaders/LoadingScreen';
import { ROUTES } from '@/constants/routes.constants';
import { authenticate, guestOnly } from '@/middlewares';
import ErrorBoundary from '@/pages/error/ErrorBoundary';

const { AUTH, AWARDS, COMPANY, DISCOVER, HOME, LEGAL, PRODUCTS, PROFILE, QUICK_LINKS, SERVICES } =
  ROUTES;

// Wraps a page's dynamic import into the function react-router's `lazy` route property expects.
// The import itself must stay a literal `() => import('@/path')` callback (not a variable path)
// so Vite can statically split each page into its own chunk.
const loadPage = (loader: () => Promise<{ default: ComponentType }>) => async () => {
  const { default: Component } = await loader();
  return { Component };
};

const routes: RouteObject[] = [
  {
    path: HOME,
    HydrateFallback: LoadingScreen,
    ErrorBoundary,
    lazy: loadPage(() => import('@/pages/layout')),
    children: [
      {
        index: true,
        lazy: loadPage(() => import('@/pages/home')),
      },
      {
        path: PRODUCTS.BASE,
        element: <Outlet />,
        children: [
          {
            index: true,
            lazy: loadPage(() => import('@/pages/product/Products')),
          },
          {
            path: `${PRODUCTS.PRODUCT.BASE}/${PRODUCTS.PRODUCT.SLUG}`,
            lazy: loadPage(() => import('@/pages/product/ProductDetails')),
          },
          {
            path: PRODUCTS.CATEGORY_L1_SLUG,
            lazy: loadPage(() => import('@/pages/product/CategoryProducts')),
          },
          {
            path: `${PRODUCTS.CATEGORY_L1_SLUG}/${PRODUCTS.CATEGORY_L2_SLUG}`,
            lazy: loadPage(() => import('@/pages/product/CategoryProducts')),
          },
          {
            path: `${PRODUCTS.CATEGORY_L1_SLUG}/${PRODUCTS.CATEGORY_L2_SLUG}/${PRODUCTS.CATEGORY_L3_SLUG}`,
            lazy: loadPage(() => import('@/pages/product/CategoryProducts')),
          },
        ],
      },
      {
        path: PROFILE.BASE,
        middleware: [authenticate],
        lazy: loadPage(() => import('@/pages/profile')),
        children: [
          {
            index: true,
            lazy: loadPage(() => import('@/pages/profile/Profile')),
          },
          {
            path: PROFILE.ORDERS,
            element: <Outlet />,
            children: [
              {
                index: true,
                lazy: loadPage(() => import('@/pages/profile/Orders')),
              },
              {
                path: PROFILE.ORDER_RETURN_REFUND,
                lazy: loadPage(() => import('@/pages/profile/OrderReturnRefund')),
              },
              {
                path: PROFILE.ORDER_TRACK,
                lazy: loadPage(() => import('@/pages/profile/OrderTrack')),
              },
            ],
          },
          {
            path: PROFILE.ADDRESSES,
            lazy: loadPage(() => import('@/pages/profile/Addresses')),
          },
          {
            path: PROFILE.WISHLIST,
            lazy: loadPage(() => import('@/pages/profile/Wishlist')),
          },
          {
            path: PROFILE.REVIEWS,
            lazy: loadPage(() => import('@/pages/profile/Reviews')),
          },
          {
            path: PROFILE.REFER_A_FRIEND,
            lazy: loadPage(() => import('@/pages/profile/ReferAFriend')),
          },
          {
            path: PROFILE.GIFT_CARDS,
            lazy: loadPage(() => import('@/pages/profile/GiftCards')),
          },
          {
            path: PROFILE.NOTIFICATIONS,
            lazy: loadPage(() => import('@/pages/profile/Notifications')),
          },
        ],
      },
      {
        path: LEGAL.ACCESSIBILITY,
        lazy: loadPage(() => import('@/pages/legal-policies/Accessibility')),
      },
      {
        path: LEGAL.DISCLAIMER,
        lazy: loadPage(() => import('@/pages/legal-policies/Disclaimer')),
      },
      {
        path: LEGAL.TERMS_CONDITIONS,
        lazy: loadPage(() => import('@/pages/legal-policies/TermsAndConditions')),
      },
      {
        path: LEGAL.COOKIE_POLICY,
        lazy: loadPage(() => import('@/pages/legal-policies/CookiePolicy')),
      },
      {
        path: LEGAL.PRIVACY_POLICY,
        lazy: loadPage(() => import('@/pages/legal-policies/PrivacyPolicy')),
      },
      {
        path: LEGAL.COMPLIANCE,
        lazy: loadPage(() => import('@/pages/legal-policies/Compliance')),
      },
      {
        path: COMPANY.ABOUT_US,
        lazy: loadPage(() => import('@/pages/company/AboutUs')),
      },
      {
        path: COMPANY.TEAM,
        lazy: loadPage(() => import('@/pages/company/Team')),
      },
      {
        path: COMPANY.MISSION_VISION_VALUES,
        lazy: loadPage(() => import('@/pages/company/MissionVisionValues')),
      },
      {
        path: COMPANY.PARTNER_WITH_US,
        lazy: loadPage(() => import('@/pages/company/PartnerWithUs')),
      },
      {
        path: COMPANY.CAREERS,
        lazy: loadPage(() => import('@/pages/company/Careers')),
      },
      {
        path: COMPANY.VALUES_CULTURE,
        lazy: loadPage(() => import('@/pages/company/ValuesCulture')),
      },
      {
        path: COMPANY.RETAIL_ECOMMERCE,
        lazy: loadPage(() => import('@/pages/company/RetailEcommerce')),
      },
      {
        path: COMPANY.SUSTAINABILITY,
        lazy: loadPage(() => import('@/pages/company/Sustainability')),
      },
      {
        path: COMPANY.ETHICS,
        lazy: loadPage(() => import('@/pages/company/Ethics')),
      },
      {
        path: COMPANY.PRESS_MEDIA,
        lazy: loadPage(() => import('@/pages/company/PressMedia')),
      },
      {
        path: COMPANY.NEWSROOM,
        lazy: loadPage(() => import('@/pages/company/Newsroom')),
      },
      {
        path: SERVICES.CONTACT,
        lazy: loadPage(() => import('@/pages/services/Contact')),
      },
      {
        path: SERVICES.HELP_CENTER_FAQ,
        lazy: loadPage(() => import('@/pages/services/HelpCenterFAQ')),
      },
      {
        path: SERVICES.SHIPPING_INFO,
        lazy: loadPage(() => import('@/pages/services/ShippingInfo')),
      },
      {
        path: QUICK_LINKS.STORE_LOCATOR,
        lazy: loadPage(() => import('@/pages/misc/StoreLocator')),
      },
      {
        path: QUICK_LINKS.BECOME_SELLER,
        middleware: [authenticate],
        lazy: loadPage(() => import('@/pages/misc/BecomeSeller')),
      },
      {
        path: AWARDS,
        lazy: loadPage(() => import('@/pages/misc/Awards')),
      },
      {
        path: DISCOVER.NEW_ARRIVALS,
        lazy: loadPage(() => import('@/pages/misc/NewArrivals')),
      },
      {
        path: DISCOVER.SPECIAL_COLLECTION,
        lazy: loadPage(() => import('@/pages/misc/SpecialCollection')),
      },
      {
        path: DISCOVER.OFFERS_AND_DISCOUNTS,
        lazy: loadPage(() => import('@/pages/misc/OffersAndDiscounts')),
      },
      {
        path: DISCOVER.BLOGS,
        lazy: loadPage(() => import('@/pages/misc/Blogs')),
      },
    ],
  },
  {
    path: AUTH.BASE,
    HydrateFallback: LoadingScreen,
    ErrorBoundary: ErrorBoundary,
    lazy: loadPage(() => import('@/pages/auth')),
    children: [
      {
        index: true,
        middleware: [guestOnly],
        lazy: loadPage(() => import('@/pages/auth/Login')),
      },

      {
        path: AUTH.REGISTER,
        middleware: [guestOnly],
        lazy: loadPage(() => import('@/pages/auth/Register')),
      },

      {
        path: AUTH.FORGOT_PASSWORD,
        middleware: [guestOnly],
        lazy: loadPage(() => import('@/pages/auth/ForgotPassword')),
      },
      {
        path: AUTH.CHANGE_PASSWORD,
        middleware: [authenticate],
        lazy: loadPage(() => import('@/pages/auth/ChangePassword')),
      },
      {
        path: AUTH.OAUTH,
        lazy: loadPage(() => import('@/pages/auth/OAuth')),
      },
    ],
  },
  {
    path: '*',
    lazy: loadPage(() => import('@/pages/error/NotFound')),
  },
];

export default routes;
