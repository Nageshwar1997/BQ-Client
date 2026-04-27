import LoadingScreen from '@/components/layout/loaders/LoadingScreen';
import ErrorBoundary from '@/pages/error/ErrorBoundary';
import { createBrowserRouter } from 'react-router-dom';

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
    ErrorBoundary,
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
        index: true,
        lazy: async () => {
          const { default: Register } = await import('@/pages/auth/Register');
          return { Component: Register };
        },
      },
    ],
  },
]);

export default router;
