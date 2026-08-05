import { Outlet } from 'react-router-dom';

import Sidebar from '@/components/layout/sidebar';

const Account = () => {
  return (
    <div className="mx-auto flex w-full flex-col md:flex-row md:items-start">
      <Sidebar />
      <main className="md:border-l-silver/30 min-w-0 grow p-4 sm:p-6 md:flex-1 md:border-l">
        <Outlet />
      </main>
    </div>
  );
};

export default Account;
