import { useLocation, useNavigate, useParams } from "react-router-dom";

const usePathParams = () => {
  const navigate = useNavigate();
  const { state, pathname } = useLocation();
  const pathParams = useParams();
  const paths = pathname.split("/").filter((path) => path !== "");

  return { paths, pathname, state, pathParams, navigate };
};

export default usePathParams;
