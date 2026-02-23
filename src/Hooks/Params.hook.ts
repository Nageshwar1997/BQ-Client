import type { TParams } from '@/Types';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

export const usePathParams = () => {
  const navigate = useNavigate();
  const pathParams = useParams();
  const location = useLocation();
  const paths = location.pathname.split('/').filter((path) => path !== '');

  return { pathParams, ...location, paths, navigate };
};

export const useQueryParams = () => {
  const { navigate } = usePathParams();

  const getParams = (): TParams => {
    const searchParams = new URLSearchParams(window.location.search);
    const Q_Params: TParams = {};
    for (const [key, value] of searchParams.entries()) {
      Q_Params[key] = value;
    }
    return Q_Params;
  };
  const setParams = (params: TParams): void => {
    const searchParams = new URLSearchParams(window.location.search);
    const newSearchParams = new URLSearchParams(searchParams.toString());
    for (const key in params) {
      if (Object.prototype.hasOwnProperty.call(params, key)) {
        newSearchParams.set(key, params[key]);
      }
    }
    navigate({ search: newSearchParams.toString() });
  };
  const removeParam = (paramKey: string): void => {
    const searchParams = new URLSearchParams(window.location.search);
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.delete(paramKey);
    navigate({ search: newSearchParams.toString() });
  };
  return {
    queryParams: getParams(),
    setParams,
    removeParam,
  };
};
