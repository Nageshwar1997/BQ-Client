import { useEffect, useState } from 'react';
import { RouterProvider } from 'react-router-dom';
import { MutationCache, QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import router from './router';
import envs from './envs';
import ToastContainer from './components/ui/Toaster';
import useThemeStore from './stores/theme.store';
function App() {
  const { theme } = useThemeStore();
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            retry: (failureCount) => failureCount < 3,
          },
          mutations: { retry: false },
        },
        queryCache: new QueryCache({
          onSuccess: (data, query) => {
            console.log('✅ Query Success:', {
              queryKey: query.queryKey,
              data,
            });
          },
          onError: (error, query) => {
            console.error('❌ Query Error:', {
              queryKey: query.queryKey,
              error,
            });
          },
          onSettled: (data, error, query) => {
            console.log('📦 Query Settled:', {
              queryKey: query.queryKey,
              hasData: !!data,
              hasError: !!error,
            });
          },
        }),

        mutationCache: new MutationCache({
          onSuccess: (data, variables, _context, mutation) => {
            console.log('✅ Mutation Success:', {
              mutationKey: mutation.options.mutationKey,
              variables,
              data,
            });
          },
          onError: (error, variables, _context, mutation) => {
            console.error('❌ Mutation Error:', {
              mutationKey: mutation.options.mutationKey,
              variables,
              error,
            });
          },
          onSettled: (data, error, _variables, _context, mutation) => {
            console.log('📦 Mutation Settled:', {
              mutationKey: mutation.options.mutationKey,
              hasData: !!data,
              hasError: !!error,
            });
          },
        }),
      }),
  );

  useEffect(() => {
    document.documentElement.setAttribute('theme', theme);
  }, [theme]);

  return (
    <QueryClientProvider client={queryClient}>
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
