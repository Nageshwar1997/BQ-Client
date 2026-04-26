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
]);

export default router;
