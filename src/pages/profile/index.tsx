import { Outlet } from 'react-router-dom';

import Sidebar from '@/components/layout/sidebar';

const Account = () => {
  return (
    <div className="mx-auto flex w-full flex-col gap-4 md:flex-row md:items-start md:gap-6">
      <Sidebar />
      <div className="min-w-0 flex-1">
        <Outlet />
      </div>
    </div>
  );
};

export default Account;
