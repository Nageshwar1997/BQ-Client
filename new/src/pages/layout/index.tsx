import AuthModal from '@/components/layout/modals/AuthModal';
import { Outlet } from 'react-router-dom';
import GlobalAuthHandler from '../auth/components/GlobalAuthHandler';

const Layout = () => {
  return (
    <>
      <AuthModal />
      <GlobalAuthHandler />
      <Outlet />
    </>
  );
};

export default Layout;
