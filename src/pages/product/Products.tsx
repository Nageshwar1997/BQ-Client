import { useGetCategoriesHierarchy } from '@/services/product-service/category.service.query';

import ProductListing from './children/ProductListing';

/** The page of all products: `/products` (search, order and filters are in its query: `?search=lip&brand=...`). */
const Products = () => {
  const { data: categories } = useGetCategoriesHierarchy();

  return (
    <ProductListing
      title="All products"
      description="Discover the whole Beautinique collection - search it, filter it and try shades on before you buy."
      categories={categories}
    />
  );
};

export default Products;
