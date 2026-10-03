import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';

import Footer from '@/components/layout/footer';
import AuthModal from '@/components/layout/modals/AuthModal';
import { Navbar } from '@/components/layout/navbar';
import ScrollToTop from '@/components/ScrollToTop';
import useAuthLogoutListener from '@/hooks/useAuthLogoutListener';
import useAutoRefreshAccessToken from '@/hooks/useAutoRefreshAccessToken';
import useAutoRetry from '@/hooks/useAutoRetry';
import { useGetCategoriesHierarchy } from '@/services/product-service/category.service.query';
import { toaster } from '@/utils/common.util';

const Layout = () => {
  const { data: categories, isError, error } = useGetCategoriesHierarchy();

  useAutoRetry(); // It will call api to refresh token when user is online again
  useAutoRefreshAccessToken(); // Proactively refreshes the access token every ~13 min while logged in
  useAuthLogoutListener(); // Clears user state and redirects to /auth when the session ends

  useEffect(() => {
    if (isError) {
      toaster.error({ title: 'Oops! Error', description: error.message });
    }
  }, [isError, error]);

  return (
    <div id="main" className="flex min-h-full w-full flex-col">
      <ScrollToTop />
      {/* If the user isn't logged in, show the auth modal. just add queryParams.login = "true" to the url */}
      <AuthModal />
      <Navbar categories={categories} />
      <main className="h-full max-w-full min-w-0 flex-1 grow">
        <Outlet />
      </main>
      <Footer
        categories={categories?.map((c) => ({
          _id: c._id,
          level: 1,
          name: c.name,
          slug: c.slug,
          path: c.path,
        }))}
      />
      {/* <Chatbot /> */}
    </div>
  );
};

export default Layout;
