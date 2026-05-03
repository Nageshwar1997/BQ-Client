import LoadingScreen from '@/components/layout/loaders/LoadingScreen';
import ErrorBoundary from '@/pagess/error/ErrorBoundary';
import type { TRouteObject } from '@/types/common.type';

const routes: TRouteObject[] = [
  {
    path: '/',
    HydrateFallback: LoadingScreen,
    ErrorBoundary,
    lazy: async () => {
      const { default: Layout } = await import('@/pagess/layout');
      return { Component: Layout };
    },
    children: [
      {
        index: true,
        lazy: async () => {
          const { default: Main } = await import('@/pagess/main');
          return { Component: Main };
        },
      },
    ],
  },
  {
    path: 'auth',
    HydrateFallback: LoadingScreen,
    ErrorBoundary: ErrorBoundary,
    lazy: async () => {
      const { default: Auth } = await import('@/pagess/auth');

      return { Component: Auth };
    },
    children: [
      {
        index: true,
        lazy: async () => {
          const { default: Login } = await import('@/pagess/auth/Login');
          return { Component: Login };
        },
      },
      {
        path: 'register',
        lazy: async () => {
          const { default: Register } = await import('@/pagess/auth/Register');
          return { Component: Register };
        },
      },
      {
        path: 'oauth',
        lazy: async () => {
          const { default: OAuth } = await import('@/pagess/auth/OAuth');
          return { Component: OAuth };
        },
      },
      {
        path: 'forgot-password',
        lazy: async () => {
          const { default: ForgotPassword } = await import('@/pagess/auth/ForgotPassword');
          return { Component: ForgotPassword };
        },
      },
      {
        path: 'change-password',
        lazy: async () => {
          const { default: ChangePassword } = await import('@/pagess/auth/ChangePassword');

          return { Component: ChangePassword };
        },
      },
      {
        path: 'set-password',
        lazy: async () => {
          const { default: SetPassword } = await import('@/pagess/auth/SetPassword');

          return { Component: SetPassword };
        },
      },
    ],
  },
  {
    path: '*',
    lazy: async () => {
      const { default: NotFound } = await import('@/pagess/error/NotFound');
      return { Component: NotFound };
    },
  },
];

export default routes;
