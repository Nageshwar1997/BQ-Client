import { useLocation } from "react-router-dom";

const CategoryProducts = () => {
  const { pathname } = useLocation();
  return <div>CategoryProducts {pathname}</div>;
};

export default CategoryProducts;
