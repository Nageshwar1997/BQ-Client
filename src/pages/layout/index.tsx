import LastRouteTracker from '@/components/LastRouteTracker';
import { Footer } from '@/components/layout/footer';
import AuthModal from '@/components/layout/modals/AuthModal';
import { Navbar } from '@/components/layout/navbar';
import ScrollToTop from '@/components/ScrollToTop';
import useAutoRetry from '@/hooks/useAutoRetry';
import { Outlet } from 'react-router-dom';

const Layout = () => {
  useAutoRetry(); // It will call api to refresh token when user is online again
  return (
    <div id="main" className="min-h-full w-full flex flex-col">
      <ScrollToTop />
      <LastRouteTracker />
      {/* If the user isn't logged in, show the auth modal. just add queryParams.login = "true" to the url */}
      <AuthModal />
      <Navbar />
      <main className="w-full grow">
        <Outlet />
      </main>
      <Footer />
      {/* <Chatbot /> */}
    </div>
  );
};

export default Layout;
