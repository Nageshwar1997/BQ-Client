import LastRouteTracker from '@/componentss/LastRouteTracker';
import AuthModal from '@/componentss/layout/modals/AuthModal';
import useAutoRetry from '@/hooks/useAutoRetry';
import { Outlet } from 'react-router-dom';
import RouteGuard from './RouteGuard';

const Layout = () => {
  useAutoRetry(); // It will call api to refresh token when user is online again
  return (
    <>
      <LastRouteTracker />
      <AuthModal />
      <RouteGuard />
      <Outlet />
    </>
  );
};

export default Layout;
