import { Icon } from '@iconify/react';
import { Link } from 'react-router-dom';

import { OAUTH_DATA, OAUTH_REDIRECT_KEY } from '@/constants/common.constants';
import usePathParams from '@/hooks/usePathParams';
import useQueryParams from '@/hooks/useQueryParams';

const SocialAuth = () => {
  const { pathname } = usePathParams();
  const { queryParams } = useQueryParams();

  const handleOAuthStart = () => {
    // OAuth is a full page redirect away from the SPA, so stash where the user was
    // (minus the `login` modal flag) to send them back once the callback succeeds.
    const { login: _login, redirect, ...paramsToKeep } = queryParams;
    const querystring = new URLSearchParams(paramsToKeep).toString();
    const fallbackPath = `${pathname}${querystring ? `?${querystring}` : ''}`;

    // If a private route already bounced the user here (?redirect=...), that's the real
    // destination — prefer it over this auth page itself.
    sessionStorage.setItem(OAUTH_REDIRECT_KEY, redirect ?? fallbackPath);
  };

  return (
    <div className="flex items-center justify-center gap-4">
      {OAUTH_DATA.map(({ icon, redirectUrl }, index) => (
        <Link key={index} to={redirectUrl} className="block" onClick={handleOAuthStart}>
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
