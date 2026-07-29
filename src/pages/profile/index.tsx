import { Outlet } from 'react-router-dom';

import Sidebar from '@/components/layout/sidebar';

const Account = () => {
  return (
    <div className="mx-auto flex w-full flex-col md:flex-row md:items-start">
      <Sidebar />
      <div className="min-w-0 grow md:flex-1">
        <Outlet />
      </div>
    </div>
  );
};

export default Account;
