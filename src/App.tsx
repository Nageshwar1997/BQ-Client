import { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "react-hot-toast";
import router from "./routes";
import useThemeStore from "./store/theme.store";

function App() {
  const { theme } = useThemeStore();
  const queryClient = new QueryClient();

  useEffect(() => {
    document.body.setAttribute("theme", theme);
  }, [theme]);

  return (
    <QueryClientProvider client={queryClient}>
      <Toaster position="top-center" />
      <div className="max-w-dvw max-h-dvh min-w-dvw min-h-dvh w-full h-full overflow-y-scroll bg-primary-inverted text-primary">
        <div className="max-w-[1920px] w-full h-full mx-auto">
          <RouterProvider router={router} />
        </div>
      </div>
      {/* React Query Devtools */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
