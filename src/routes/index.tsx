import LoadingScreen from '@/components/layout/loaders/LoadingScreen';
import ErrorBoundary from '@/pages/error/ErrorBoundary';
import type { TRouteObject } from '@/types/common.type';

const routes: TRouteObject[] = [
  {
    path: '/',
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
    path: 'auth',
    HydrateFallback: LoadingScreen,
    ErrorBoundary: ErrorBoundary,
    lazy: async () => {
      const { default: Auth } = await import('@/pages/auth');

      return { Component: Auth };
    },
    children: [
      {
        index: true,
        access: 'guest-only',
        lazy: async () => {
          const { default: Login } = await import('@/pages/auth/Login');
          return { Component: Login };
        },
      },
      {
        path: 'register',
        access: 'guest-only',
        lazy: async () => {
          const { default: Register } = await import('@/pages/auth/Register');
          return { Component: Register };
        },
      },
      {
        path: 'oauth',
        access: 'guest-only',
        lazy: async () => {
          const { default: OAuth } = await import('@/pages/auth/OAuth');
          return { Component: OAuth };
        },
      },
      {
        path: 'forgot-password',
        access: 'guest-only',
        lazy: async () => {
          const { default: ForgotPassword } = await import('@/pages/auth/ForgotPassword');
          return { Component: ForgotPassword };
        },
      },
      {
        path: 'change-password',
        access: 'private',
        lazy: async () => {
          const { default: ChangePassword } = await import('@/pages/auth/ChangePassword');

          return { Component: ChangePassword };
        },
      },
      {
        path: 'set-password',
        access: 'social-only',
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
