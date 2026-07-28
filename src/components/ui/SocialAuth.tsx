import { Icon } from '@iconify/react';
import { Link } from 'react-router-dom';

import { OAUTH_DATA } from '@/constants/common.constants';

const SocialAuth = () => {
  return (
    <div className="flex items-center justify-center gap-4">
      {OAUTH_DATA.map(({ icon, redirectUrl }, index) => (
        <Link key={index} to={redirectUrl} className="block">
          <Icon
            icon={icon}
            className="border-primary/40 shadow-primary/50 h-12 w-12 shrink-0 rounded-xl border bg-white/90 p-2.5 shadow-sm backdrop-blur-sm transition-transform duration-500 hover:scale-110"
          />
        </Link>
      ))}
    </div>
  );
};

export default SocialAuth;
