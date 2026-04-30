import { createBrowserRouter } from 'react-router-dom';
import LoadingScreen from '@/components/layout/loaders/LoadingScreen';
import ErrorBoundary from '@/pages/error/ErrorBoundary';
import { authRedirect } from './middlewares';

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
    middleware: [authRedirect],
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
        path: 'register',
        lazy: async () => {
          const { default: Register } = await import('@/pages/auth/Register');
          return { Component: Register };
        },
      },
      {
        path: 'oauth',
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
]);

export default router;
