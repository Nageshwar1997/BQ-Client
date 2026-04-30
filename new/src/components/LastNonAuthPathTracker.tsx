import { LAST_NON_AUTH_PATH_KEY } from '@/constants/common.constant';
import usePathParams from '@/hooks/usePathParams';
import { getSafeNonAuthPath } from '@/utils/common.util';
import { useEffect } from 'react';

const LastNonAuthPathTracker = () => {
  const { pathname, search = '', hash = '' } = usePathParams();

  useEffect(() => {
    const path = `${pathname}${search}${hash}`;

    if (getSafeNonAuthPath(path)) {
      sessionStorage.setItem(LAST_NON_AUTH_PATH_KEY, path);
    }
  }, [location]);

  return null;
};

export default LastNonAuthPathTracker;
