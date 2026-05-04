import LastRouteTracker from '@/components/LastRouteTracker';
import { Footer } from '@/components/layout/footer';
import AuthModal from '@/components/layout/modals/AuthModal';
import useAutoRetry from '@/hooks/useAutoRetry';
import { Outlet } from 'react-router-dom';

const Layout = () => {
  useAutoRetry(); // It will call api to refresh token when user is online again
  return (
    <>
      <LastRouteTracker />
      <AuthModal />
      <Outlet />
      <Footer />
    </>
  );
};

export default Layout;
