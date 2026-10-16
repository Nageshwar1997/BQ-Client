import { NetworkStatusToaster, ToastContainer } from '@beautinique/frontend-components';
import { LoadingScreen, WakeUpProgress } from '@beautinique/frontend-components/loading-screen';
import { useOnlineStatus } from '@beautinique/frontend-hooks';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';

import { queryClient } from './configs/queryClient';
import envs from './envs';
import useWakeUp, { WAKE_UP_SERVICES } from './hooks/useWakeUp';
import router from './router';
import useThemeStore from './stores/theme.store';
import useToastStore from './stores/toast.store';
import { toaster } from './utils/toaster';

function App() {
  const theme = useThemeStore((s) => s.theme);
  // Wakes the gateway first, then every service at once, on boot - so a cold Render instance is
  // already awake before the user's first real request hits it. See useWakeUp.
  const { phase: wakeUpPhase, awakeServices } = useWakeUp();
  const { status: networkStatus } = useOnlineStatus();

  useEffect(() => {
    document.documentElement.setAttribute('theme', theme);
  }, [theme]);

  return (
    <div className="bg-primary-invert text-primary h-dvh max-h-dvh min-h-dvh w-full max-w-dvw min-w-dvw overflow-y-scroll">
      {wakeUpPhase !== 'done' ? (
        <LoadingScreen>
          <WakeUpProgress
            phase={wakeUpPhase}
            services={WAKE_UP_SERVICES}
            awakeServices={awakeServices}
          />
        </LoadingScreen>
      ) : (
        <QueryClientProvider client={queryClient}>
          <ToastContainer store={useToastStore} />
          {/* Toasts "You're offline" / "Connecting to internet..." / "Back online" */}
          <NetworkStatusToaster status={networkStatus} toaster={toaster} />
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
      )}
    </div>
  );
}

export default App;
