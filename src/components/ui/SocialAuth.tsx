import { SocialAuth as SocialAuthLinks } from '@beautinique/frontend-components/auth';
import { usePathParams, useQueryParams } from '@beautinique/frontend-hooks';

import { API_METHODS_AND_URLS } from '@/constants/api.constants';
import { OAUTH_REDIRECT_KEY, PROVIDER_ICON_MAP } from '@/constants/common.constants';
import envs from '@/envs';

const OAUTH_PROVIDERS = [
  {
    name: 'Google',
    icon: PROVIDER_ICON_MAP.GOOGLE,
    href: `${envs.urls.gateway}${API_METHODS_AND_URLS.user_service.auth.login.oauth.google.redirect.url}`,
  },
  {
    name: 'GitHub',
    icon: PROVIDER_ICON_MAP.GITHUB,
    href: `${envs.urls.gateway}${API_METHODS_AND_URLS.user_service.auth.login.oauth.github.redirect.url}`,
  },
  {
    name: 'LinkedIn',
    icon: PROVIDER_ICON_MAP.LINKEDIN,
    href: `${envs.urls.gateway}${API_METHODS_AND_URLS.user_service.auth.login.oauth.linkedin.redirect.url}`,
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

  return <SocialAuthLinks providers={OAUTH_PROVIDERS} onProviderClick={handleOAuthStart} />;
};

export default SocialAuth;
