import type { TParams } from '@/types/hook.type';
import usePathParams from './usePathParams';

const useQueryParams = () => {
  const { navigate, search, pathname } = usePathParams();

  const getParams = (): TParams => {
    const searchParams = new URLSearchParams(search);
    const params: TParams = {};

    for (const [key, value] of searchParams.entries()) {
      params[key] = value;
    }

    return params;
  };

  const setParams = (params: TParams): void => {
    const searchParams = new URLSearchParams(search);

    Object.entries(params).forEach(([key, value]) => {
      if (value === undefined || value === null || value === '') {
        searchParams.delete(key);
      } else {
        searchParams.set(key, value);
      }
    });

    navigate({ pathname, search: searchParams.toString() });
  };

  const removeParams = (keys: string | string[]): void => {
    const searchParams = new URLSearchParams(search);

    (Array.isArray(keys) ? keys : [keys]).forEach((key) => {
      searchParams.delete(key);
    });

    navigate({ pathname, search: searchParams.toString() });
  };

  const clearParams = (): void => {
    navigate({ pathname, search: '' });
  };

  return {
    queryParams: getParams(),
    setParams,
    removeParams,
    clearParams,
  };
};

export default useQueryParams;
