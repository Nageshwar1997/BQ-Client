import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';

import ToastContainer from './components/ui/Toaster';
import { queryClient } from './configs/queryClient';
import envs from './envs';
import router from './router';
import useThemeStore from './stores/theme.store';

function App() {
  const theme = useThemeStore((s) => s.theme);

  useEffect(() => {
    document.documentElement.setAttribute('theme', theme);
  }, [theme]);

  return (
    <div className="bg-primary-invert text-primary h-dvh max-h-dvh min-h-dvh w-full max-w-dvw min-w-dvw overflow-y-scroll">
      <QueryClientProvider client={queryClient}>
        <ToastContainer />
        <div className="mx-auto h-full w-full max-w-480">
          <RouterProvider router={router} />
        </div>
        {/* React Query Devtools */}
        {envs.is_dev && (
          <ReactQueryDevtools
            initialIsOpen={false}
            position="bottom"
            buttonPosition="bottom-right"
          />
        )}
      </QueryClientProvider>
    </div>
  );
}

export default App;
