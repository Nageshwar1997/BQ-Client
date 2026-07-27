import { Icon } from '@iconify/react';
import { Link } from 'react-router-dom';

import { ACCOUNT_SIDEBAR_DATA } from '@/constants/account.constants';
import usePathParams from '@/hooks/usePathParams';

const AccountSidebar = () => {
  const { pathname } = usePathParams();

  return (
    <aside className="border-primary/10 bg-secondary-invert w-full shrink-0 rounded-xl border p-2 lg:w-64">
      <nav className="flex gap-1 overflow-x-auto lg:flex-col lg:overflow-visible">
        {ACCOUNT_SIDEBAR_DATA.map((item) => {
          const isActive = pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex shrink-0 items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium whitespace-nowrap transition-colors ${
                isActive ? 'bg-accent-duo text-white' : 'text-secondary hover:bg-primary-invert/60'
              }`}
            >
              <Icon icon={item.icon} className="size-5 shrink-0" />
              {item.title}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default AccountSidebar;
