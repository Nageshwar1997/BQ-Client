import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from 'react-router/dom';
import { router } from './router';
import { useUIStore } from './lib/store';
import MobileBlocker from './components/MobileBlocker';

const queryClient = new QueryClient();

const App = () => {
  const { isLoggingOut } = useUIStore();

  return (
    <MobileBlocker breakpoint={1024}>
      <QueryClientProvider client={queryClient}>
        {isLoggingOut && (
          <div className="fixed inset-0 z-9999 flex flex-col items-center justify-center bg-white">
            <div
              className="text-neutral-gray-900 inline-block size-8 animate-spin rounded-[999px] border-4 border-current border-t-transparent"
              role="status"
              aria-label="loading"
            >
              <span className="sr-only">Logging out...</span>
            </div>
          </div>
        )}
        <RouterProvider router={router} />
        {/* <ReactQueryDevtools
          initialIsOpen={false}
          buttonPosition="bottom-left"
        /> */}
      </QueryClientProvider>
    </MobileBlocker>
  );
};

export default App;
