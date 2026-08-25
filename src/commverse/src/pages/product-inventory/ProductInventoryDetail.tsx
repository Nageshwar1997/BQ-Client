import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router';
import ProductDetailSidebar from './components/ProductDetailSidebar';
import ProductDetailContent from './components/ProductDetailContent';
import { useGetProductCMSById } from '../../services/product-service';
import type { ProductCMSItem } from '../../types/api.types';

const ProductInventoryDetail = () => {
  const { id } = useParams();
  const productByIdQuery = useGetProductCMSById(id);
  const [selectedProduct, setSelectedProduct] = useState<ProductCMSItem>();

  const selectedProductFromRoute = useMemo(
    () => productByIdQuery.data?.data as ProductCMSItem | undefined,
    [productByIdQuery.data?.data]
  );

  useEffect(() => {
    if (!selectedProductFromRoute) return;
    setSelectedProduct(selectedProductFromRoute);
  }, [selectedProductFromRoute]);

  const resolvedSelectedProduct = selectedProduct ?? selectedProductFromRoute;
  const isProductSummaryLoading =
    productByIdQuery.isLoading && !resolvedSelectedProduct;

  return (
    <div className="flex h-full min-h-0 overflow-hidden">
      <ProductDetailSidebar
        setSelectedProduct={setSelectedProduct}
        selectedProduct={resolvedSelectedProduct}
      />
      <ProductDetailContent
        selectedProduct={resolvedSelectedProduct as ProductCMSItem}
        isProductSummaryLoading={isProductSummaryLoading}
      />
    </div>
  );
};

export default ProductInventoryDetail;
