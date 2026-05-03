import LoadingScreen from '@/components/layout/loaders/LoadingScreen';
import { ACCESS, ROUTES } from '@/constants/common.constants';
import ErrorBoundary from '@/pages/error/ErrorBoundary';
import type { TRouteObject } from '@/types/common.type';

const { AUTH, HOME } = ROUTES;
const { GUEST_ONLY, PRIVATE, SOCIAL_ONLY } = ACCESS;

const routes: TRouteObject[] = [
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
          const { default: Main } = await import('@/pages/main');
          return { Component: Main };
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
        access: GUEST_ONLY,
        lazy: async () => {
          const { default: Login } = await import('@/pages/auth/Login');
          return { Component: Login };
        },
      },
      {
        path: AUTH.REGISTER,
        access: GUEST_ONLY,
        lazy: async () => {
          const { default: Register } = await import('@/pages/auth/Register');
          return { Component: Register };
        },
      },
      {
        path: AUTH.OAUTH,
        access: GUEST_ONLY,
        lazy: async () => {
          const { default: OAuth } = await import('@/pages/auth/OAuth');
          return { Component: OAuth };
        },
      },
      {
        path: AUTH.FORGOT_PASSWORD,
        access: GUEST_ONLY,
        lazy: async () => {
          const { default: ForgotPassword } = await import('@/pages/auth/ForgotPassword');
          return { Component: ForgotPassword };
        },
      },
      {
        path: AUTH.CHANGE_PASSWORD,
        access: PRIVATE,
        lazy: async () => {
          const { default: ChangePassword } = await import('@/pages/auth/ChangePassword');

          return { Component: ChangePassword };
        },
      },
      {
        path: AUTH.SET_PASSWORD,
        access: SOCIAL_ONLY,
        lazy: async () => {
          const { default: SetPassword } = await import('@/pages/auth/SetPassword');

          return { Component: SetPassword };
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
