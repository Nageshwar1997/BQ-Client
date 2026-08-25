import { useCallback, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { updateProductCMS } from '../../../services/api';
import type { TFashionTryOnForm } from '../../../types';

const getProductLinkSnapshot = (products?: TFashionTryOnForm['products']) =>
  Object.fromEntries(
    (products ?? []).map((item) => [item._id, item.url?.trim() ?? ''])
  );

export const useSyncFashionProductLinks = () => {
  const queryClient = useQueryClient();
  const productLinkSnapshotRef = useRef<Record<string, string>>({});

  const resetProductLinkSnapshot = useCallback(
    (products?: TFashionTryOnForm['products']) => {
      productLinkSnapshotRef.current = getProductLinkSnapshot(products);
    },
    []
  );

  const rememberProductLink = useCallback((productId: string, productLink?: string) => {
    productLinkSnapshotRef.current = {
      ...productLinkSnapshotRef.current,
      [productId]: productLink?.trim() ?? '',
    };
  }, []);

  const syncProductLinks = useCallback(
    async (products?: TFashionTryOnForm['products']) => {
      const changedProducts = (products ?? []).filter((item) => {
        const nextUrl = item.url?.trim() ?? '';
        const previousUrl = productLinkSnapshotRef.current[item._id] ?? '';
        return nextUrl !== previousUrl;
      });

      if (!changedProducts.length) return;

      await Promise.all(
        changedProducts.map(async (item) => {
          const formData = new FormData();
          formData.append(
            'productDetails',
            JSON.stringify({
              productLink: item.url?.trim() ? item.url.trim() : null,
            })
          );
          await updateProductCMS(item._id, formData);
        })
      );

      queryClient.invalidateQueries({ queryKey: ['get-product-cms'] });
      changedProducts.forEach((item) => {
        queryClient.invalidateQueries({
          queryKey: ['get-product-cms-by-id', item._id],
        });
      });

      productLinkSnapshotRef.current = getProductLinkSnapshot(products);
    },
    [queryClient]
  );

  return {
    rememberProductLink,
    resetProductLinkSnapshot,
    syncProductLinks,
  };
};
