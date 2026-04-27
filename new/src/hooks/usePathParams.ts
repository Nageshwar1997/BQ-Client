import { useLocation, useNavigate, useParams } from 'react-router-dom';

const usePathParams = () => {
  const navigate = useNavigate();
  const pathParams = useParams();
  const { pathname, ...restLocation } = useLocation();
  const paths = pathname.split('/').filter((path) => path !== '');

  return { pathParams, pathname, ...restLocation, paths, navigate };
};

export default usePathParams;
