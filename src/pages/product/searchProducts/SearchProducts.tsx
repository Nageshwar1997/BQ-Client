import useQueryParams from "../../../hooks/useQueryParams";

const SearchProducts = () => {
  const { queryParams } = useQueryParams();

  console.log("queryParams", queryParams);
  return <div>SearchProducts</div>;
};

export default SearchProducts;
