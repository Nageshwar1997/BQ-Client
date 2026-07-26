import { Outlet, type RouteObject } from 'react-router-dom';

import LoadingScreen from '@/components/layout/loaders/LoadingScreen';
import { ROUTES } from '@/constants/common.constants';
import { authenticate } from '@/middlewares';
import ErrorBoundary from '@/pages/error/ErrorBoundary';

const { AUTH, HOME, PRODUCTS } = ROUTES;

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
