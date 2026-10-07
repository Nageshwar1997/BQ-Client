import { usePathParams, useQueryParams } from '@beautinique/frontend-hooks';
import { Icon } from '@iconify/react';
import { Link } from 'react-router-dom';

import { API_METHODS_AND_URLS } from '@/constants/api.constants';
import { OAUTH_REDIRECT_KEY, PROVIDER_ICON_MAP } from '@/constants/common.constants';
import envs from '@/envs';

const OAUTH_DATA = [
  {
    icon: PROVIDER_ICON_MAP.GOOGLE,
    redirectUrl: `${envs.urls.gateway}${API_METHODS_AND_URLS.user_service.auth.login.oauth.google.redirect.url}`,
  },
  {
    icon: PROVIDER_ICON_MAP.GITHUB,
    redirectUrl: `${envs.urls.gateway}${API_METHODS_AND_URLS.user_service.auth.login.oauth.github.redirect.url}`,
  },
  {
    icon: PROVIDER_ICON_MAP.LINKEDIN,
    redirectUrl: `${envs.urls.gateway}${API_METHODS_AND_URLS.user_service.auth.login.oauth.linkedin.redirect.url}`,
  },
] as const;

const SocialAuth = () => {
  const { pathname } = usePathParams();
  const { queryParams } = useQueryParams();

  const handleOAuthStart = () => {
    // A private nav item may have already stashed the exact path it wanted to reach (see
    // useAuthNavigate) before this modal opened — that's the real destination, don't clobber it
    // with this page's own path.
    if (sessionStorage.getItem(OAUTH_REDIRECT_KEY)) return;

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
