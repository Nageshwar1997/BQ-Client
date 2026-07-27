import { Outlet } from 'react-router-dom';

import AccountSidebar from './children/AccountSidebar';

const Account = () => {
  return (
    <div className="mx-auto flex w-full flex-col gap-6 lg:flex-row lg:items-start lg:gap-8">
      <AccountSidebar />
      <div className="min-w-0 flex-1">
        <Outlet />
      </div>
    </div>
  );
};

export default Account;
