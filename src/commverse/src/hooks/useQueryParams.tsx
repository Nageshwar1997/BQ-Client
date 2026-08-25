import { useNavigate, useSearchParams } from 'react-router';
import type { TQueryParams } from '../types';

const useQueryParams = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const getParams = (): TQueryParams => {
    const params: TQueryParams = {};
    searchParams?.forEach((value, key) => {
      params[key] = value;
    });
    return params;
  };

  const updateParams = ({
    remove = [],
    set = {},
  }: {
    remove?: string[];
    set?: TQueryParams;
  }) => {
    const newParams = new URLSearchParams(searchParams?.toString());

    // remove keys
    remove.forEach((key) => newParams?.delete(key));

    // set keys
    Object.entries(set)?.forEach(
      ([key, value]) => value && newParams?.set(key, value)
    );

    navigate(
      {
        search: `?${newParams.toString()}`,
      },
      { replace: true }
    );
  };

  return {
    queryParams: getParams(),
    updateParams,
  };
};

export default useQueryParams;
