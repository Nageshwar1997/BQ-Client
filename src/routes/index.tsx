import { Outlet, type RouteObject } from 'react-router-dom';

import LoadingScreen from '@/components/layout/loaders/LoadingScreen';
import { ROUTES } from '@/constants/common.constants';
import { authenticate } from '@/middlewares';
import ErrorBoundary from '@/pages/error/ErrorBoundary';

const { AUTH, AWARDS, COMPANY, HOME, LEGAL, PRODUCTS, PROFILE, QUICK_LINKS, SERVICES } = ROUTES;

const routes: RouteObject[] = [
  {
    path: HOME,
    HydrateFallback: LoadingScreen,
    ErrorBoundary,
    lazy: async () => {
      const { default: Layout } = await import('@/pages/layout');
      return { Component: Layout };
    },
    children: [
      {
        index: true,
        lazy: async () => {
          const { default: Home } = await import('@/pages/home');
          return { Component: Home };
        },
      },
      {
        path: PRODUCTS.BASE,
        element: <Outlet />,
        children: [
          {
            index: true,
            lazy: async () => {
              const { default: Products } = await import('@/pages/product/Products');
              return { Component: Products };
            },
          },
          {
            path: PRODUCTS.SLUG,
            lazy: async () => {
              const { default: ProductDetails } = await import('@/pages/product/ProductDetails');
              return { Component: ProductDetails };
            },
          },
          {
            path: PRODUCTS.CATEGORY_L1_SLUG,
            lazy: async () => {
              const { default: CategoryProducts } =
                await import('@/pages/product/CategoryProducts');
              return { Component: CategoryProducts };
            },
          },
          {
            path: `${PRODUCTS.CATEGORY_L1_SLUG}/${PRODUCTS.CATEGORY_L2_SLUG}`,
            lazy: async () => {
              const { default: CategoryProducts } =
                await import('@/pages/product/CategoryProducts');
              return { Component: CategoryProducts };
            },
          },
          {
            path: `${PRODUCTS.CATEGORY_L1_SLUG}/${PRODUCTS.CATEGORY_L2_SLUG}/${PRODUCTS.CATEGORY_L3_SLUG}`,
            lazy: async () => {
              const { default: CategoryProducts } =
                await import('@/pages/product/CategoryProducts');
              return { Component: CategoryProducts };
            },
          },
        ],
      },
      {
        path: PROFILE.BASE,
        middleware: [authenticate],
        lazy: async () => {
          const { default: Account } = await import('@/pages/profile');
          return { Component: Account };
        },
        children: [
          {
            index: true,
            lazy: async () => {
              const { default: Profile } = await import('@/pages/profile/Profile');
              return { Component: Profile };
            },
          },
          {
            path: PROFILE.ORDERS,
            element: <Outlet />,
            children: [
              {
                index: true,
                lazy: async () => {
                  const { default: Orders } = await import('@/pages/profile/Orders');
                  return { Component: Orders };
                },
              },
              {
                path: PROFILE.ORDER_RETURN_REFUND,
                lazy: async () => {
                  const { default: OrderReturnRefund } = await import(
                    '@/pages/profile/OrderReturnRefund'
                  );
                  return { Component: OrderReturnRefund };
                },
              },
              {
                path: PROFILE.ORDER_TRACK,
                lazy: async () => {
                  const { default: OrderTrack } = await import('@/pages/profile/OrderTrack');
                  return { Component: OrderTrack };
                },
              },
            ],
          },
          {
            path: PROFILE.ADDRESSES,
            lazy: async () => {
              const { default: Addresses } = await import('@/pages/profile/Addresses');
              return { Component: Addresses };
            },
          },
          {
            path: PROFILE.WISHLIST,
            lazy: async () => {
              const { default: Wishlist } = await import('@/pages/profile/Wishlist');
              return { Component: Wishlist };
            },
          },
          {
            path: PROFILE.REVIEWS,
            lazy: async () => {
              const { default: Reviews } = await import('@/pages/profile/Reviews');
              return { Component: Reviews };
            },
          },
          {
            path: PROFILE.REFER_A_FRIEND,
            lazy: async () => {
              const { default: ReferAFriend } = await import('@/pages/profile/ReferAFriend');
              return { Component: ReferAFriend };
            },
          },
          {
            path: PROFILE.GIFT_CARDS,
            lazy: async () => {
              const { default: GiftCards } = await import('@/pages/profile/GiftCards');
              return { Component: GiftCards };
            },
          },
          {
            path: PROFILE.NOTIFICATIONS,
            lazy: async () => {
              const { default: Notifications } = await import('@/pages/profile/Notifications');
              return { Component: Notifications };
            },
          },
        ],
      },
      {
        path: LEGAL.ACCESSIBILITY,
        lazy: async () => {
          const { default: Accessibility } = await import('@/pages/legal-policies/Accessibility');
          return { Component: Accessibility };
        },
      },
      {
        path: LEGAL.DISCLAIMER,
        lazy: async () => {
          const { default: Disclaimer } = await import('@/pages/legal-policies/Disclaimer');
          return { Component: Disclaimer };
        },
      },
      {
        path: LEGAL.TERMS_CONDITIONS,
        lazy: async () => {
          const { default: TermsAndConditions } = await import(
            '@/pages/legal-policies/TermsAndConditions'
          );
          return { Component: TermsAndConditions };
        },
      },
      {
        path: LEGAL.COOKIE_POLICY,
        lazy: async () => {
          const { default: CookiePolicy } = await import('@/pages/legal-policies/CookiePolicy');
          return { Component: CookiePolicy };
        },
      },
      {
        path: LEGAL.PRIVACY_POLICY,
        lazy: async () => {
          const { default: PrivacyPolicy } = await import('@/pages/legal-policies/PrivacyPolicy');
          return { Component: PrivacyPolicy };
        },
      },
      {
        path: COMPANY.ABOUT_US,
        lazy: async () => {
          const { default: AboutUs } = await import('@/pages/company/AboutUs');
          return { Component: AboutUs };
        },
      },
      {
        path: COMPANY.PARTNER_WITH_US,
        lazy: async () => {
          const { default: PartnerWithUs } = await import('@/pages/company/PartnerWithUs');
          return { Component: PartnerWithUs };
        },
      },
      {
        path: COMPANY.CAREERS,
        lazy: async () => {
          const { default: Careers } = await import('@/pages/company/Careers');
          return { Component: Careers };
        },
      },
      {
        path: COMPANY.SUSTAINABILITY,
        lazy: async () => {
          const { default: Sustainability } = await import('@/pages/company/Sustainability');
          return { Component: Sustainability };
        },
      },
      {
        path: COMPANY.ETHICS,
        lazy: async () => {
          const { default: Ethics } = await import('@/pages/company/Ethics');
          return { Component: Ethics };
        },
      },
      {
        path: COMPANY.PRESS_MEDIA,
        lazy: async () => {
          const { default: PressMedia } = await import('@/pages/company/PressMedia');
          return { Component: PressMedia };
        },
      },
      {
        path: SERVICES.CONTACT,
        lazy: async () => {
          const { default: Contact } = await import('@/pages/services/Contact');
          return { Component: Contact };
        },
      },
      {
        path: SERVICES.HELP_CENTER_FAQ,
        lazy: async () => {
          const { default: HelpCenterFAQ } = await import('@/pages/services/HelpCenterFAQ');
          return { Component: HelpCenterFAQ };
        },
      },
      {
        path: SERVICES.SHIPPING_INFO,
        lazy: async () => {
          const { default: ShippingInfo } = await import('@/pages/services/ShippingInfo');
          return { Component: ShippingInfo };
        },
      },
      {
        path: QUICK_LINKS.STORE_LOCATOR,
        lazy: async () => {
          const { default: StoreLocator } = await import('@/pages/misc/StoreLocator');
          return { Component: StoreLocator };
        },
      },
      {
        path: QUICK_LINKS.BECOME_SELLER,
        middleware: [authenticate],
        lazy: async () => {
          const { default: BecomeSeller } = await import('@/pages/misc/BecomeSeller');
          return { Component: BecomeSeller };
        },
      },
      {
        path: AWARDS,
        lazy: async () => {
          const { default: Awards } = await import('@/pages/misc/Awards');
          return { Component: Awards };
        },
      },
    ],
  },
  {
    path: AUTH.BASE,
    HydrateFallback: LoadingScreen,
    ErrorBoundary: ErrorBoundary,
    lazy: async () => {
      const { default: Auth } = await import('@/pages/auth');
      return { Component: Auth };
    },
    children: [
      {
        index: true,
        lazy: async () => {
          const { default: Login } = await import('@/pages/auth/Login');
          return { Component: Login };
        },
      },

      {
        path: AUTH.REGISTER,
        lazy: async () => {
          const { default: Register } = await import('@/pages/auth/Register');
          return { Component: Register };
        },
      },

      {
        path: AUTH.FORGOT_PASSWORD,
        lazy: async () => {
          const { default: ForgotPassword } = await import('@/pages/auth/ForgotPassword');
          return { Component: ForgotPassword };
        },
      },
      {
        path: AUTH.CHANGE_PASSWORD,
        middleware: [authenticate],
        lazy: async () => {
          const { default: ChangePassword } = await import('@/pages/auth/ChangePassword');

          return { Component: ChangePassword };
        },
      },
      {
        path: AUTH.OAUTH,
        lazy: async () => {
          const { default: OAuth } = await import('@/pages/auth/OAuth');

          return { Component: OAuth };
        },
      },
    ],
  },
  {
    path: '*',
    lazy: async () => {
      const { default: NotFound } = await import('@/pages/error/NotFound');
      return { Component: NotFound };
    },
  },
];

export default routes;
