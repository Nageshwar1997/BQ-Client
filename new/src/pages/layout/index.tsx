import AuthModal from '@/components/layout/modals/AuthModal';
import { Outlet } from 'react-router-dom';
import RouteGuard from './RouteGuard';

const Layout = () => {
  return (
    <>
      <AuthModal />
      <RouteGuard />
      <Outlet />
    </>
  );
};

export default Layout;
