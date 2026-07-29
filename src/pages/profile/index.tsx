import { Outlet } from 'react-router-dom';

import Sidebar from '@/components/layout/sidebar';

const Account = () => {
  return (
    <div className="mx-auto flex w-full flex-col md:flex-row md:items-start">
      <Sidebar />
      <div className="md:border-l-silver/30 min-w-0 grow md:flex-1 md:border-l">
        <Outlet />
      </div>
    </div>
  );
};

export default Account;
