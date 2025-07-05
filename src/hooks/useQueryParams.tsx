import { useNavigate, useParams } from "react-router-dom";
import { QueryParams } from "../types";

function useQueryParams() {
  const navigate = useNavigate();
  const params = useParams();

  const getParams = (): QueryParams => {
    const searchParams = new URLSearchParams(window.location.search);
    const Q_Params: QueryParams = {};
    for (const [key, value] of searchParams.entries()) {
      Q_Params[key] = value;
    }
    return Q_Params;
  };
  const setParams = (params: QueryParams): void => {
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
    params,
  };
}

export default useQueryParams;
