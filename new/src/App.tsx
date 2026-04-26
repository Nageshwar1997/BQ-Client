import { useEffect } from 'react';
import { RouterProvider } from 'react-router';
import { MutationCache, QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'react-hot-toast';
import { router } from './router';
import { envs } from './envs';
import { ToastContainer } from './components';
import { useThemeStore } from './stores';

function App() {
  const { theme } = useThemeStore();
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { refetchOnWindowFocus: false, retry: (failureCount) => failureCount < 3 },
      mutations: { retry: false },
    },
    queryCache: new QueryCache({ onSuccess: () => console.log('Query success') }),
    mutationCache: new MutationCache({ onSuccess: () => console.log('Mutation success') }),
  });

  useEffect(() => {
    document.documentElement.setAttribute('theme', theme);
  }, [theme]);

  return (
    <QueryClientProvider client={queryClient}>
      <Toaster position="top-center" />
      <ToastContainer />
      <div className="bg-primary-invert text-primary h-full max-h-dvh min-h-dvh w-full max-w-dvw min-w-dvw overflow-y-scroll">
        <div className="mx-auto h-full w-full max-w-480">
          <RouterProvider router={router} />
        </div>
      </div>
      {/* React Query Devtools */}
      {envs.is_dev && (
        <ReactQueryDevtools initialIsOpen={false} position="bottom" buttonPosition="bottom-left" />
      )}
    </QueryClientProvider>
  );
}

export default App;
