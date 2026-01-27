import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { MutationCache, QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'react-hot-toast';
import { router } from './routes';
import { store } from './store';
import { VITE_IS_DEV } from './envs';

function App() {
  const { theme } = store.theme();
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { refetchOnWindowFocus: false, retry: (failureCount) => failureCount < 3 },
      mutations: { retry: (failureCount) => failureCount < 3 },
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
      <div className="bg-primary-invert text-primary h-full max-h-dvh min-h-dvh w-full max-w-dvw min-w-dvw overflow-y-scroll">
        <div className="mx-auto h-full w-full max-w-480">
          <RouterProvider router={router} />
        </div>
      </div>
      {/* React Query Devtools */}
      {VITE_IS_DEV === 'true' && (
        <ReactQueryDevtools initialIsOpen={false} position="bottom" buttonPosition="bottom-left" />
      )}
    </QueryClientProvider>
  );
}

export default App;
