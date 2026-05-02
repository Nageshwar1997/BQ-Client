import LoadingScreen from '@/components/layout/loaders/LoadingScreen';
import ErrorBoundary from '@/pages/error/ErrorBoundary';
import { createBrowserRouter } from 'react-router-dom';
import { authCheck, authRedirect } from './middlewares';

const router = createBrowserRouter([
  {
    path: '/',
    HydrateFallback: LoadingScreen,
    ErrorBoundary,
    lazy: async () => {
      const { default: Main } = await import('@/pages/main');
      return { Component: Main };
    },
    children: [],
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
        middleware: [authRedirect],
        lazy: async () => {
          const { default: Login } = await import('@/pages/auth/Login');
          return { Component: Login };
        },
      },
      {
        path: 'register',
        lazy: async () => {
          const { default: Register } = await import('@/pages/auth/Register');
          return { Component: Register };
        },
      },
      {
        path: 'oauth',
        middleware: [authRedirect],
        lazy: async () => {
          const { default: OAuth } = await import('@/pages/auth/OAuth');
          return { Component: OAuth };
        },
      },
      {
        path: 'forgot-password',
        middleware: [authRedirect],
        lazy: async () => {
          const { default: ForgotPassword } = await import('@/pages/auth/ForgotPassword');
          return { Component: ForgotPassword };
        },
      },
      {
        path: 'change-password',
        middleware: [authCheck],
        lazy: async () => {
          const { default: ChangePassword } = await import('@/pages/auth/ChangePassword');
          return { Component: ChangePassword };
        },
      },
      {
        path: 'set-password',
        middleware: [authCheck],
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
]);

export default router;
