import { useLocation, useNavigate } from 'react-router-dom';
import type { TParams } from '../types';

export const useQueryParams = () => {
  const navigate = useNavigate();
  const { hash, pathname, state } = useLocation();
  const paths = pathname.split('/').filter((path) => path !== '');

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
  return { params: getParams(), setParams, removeParam, hash, pathname, state, paths };
};
