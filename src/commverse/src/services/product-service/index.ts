import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import {
  createProductCMS,
  deleteProductCMS,
  deleteProductCMSMediaFiles,
  getProductAssets,
  getProductCMS,
  getProductCMSById,
  link3DAssetToProduct,
  unlink3DAssetFromProduct,
  updateProductCMS,
  type DeleteProductCMSMediaFilesBody,
  type GetProductCMSParams,
} from '../api';

export const useGetProductCMS = (params: GetProductCMSParams = {}) => {
  return useInfiniteQuery({
    queryKey: ['get-product-cms', params],
    queryFn: ({ pageParam }) =>
      getProductCMS({
        ...params,
        page: Number(pageParam),
      }),
    initialPageParam: params.page ?? 1,
    getNextPageParam: (lastPage) => {
      const pagination = lastPage?.pagination;
      if (!pagination) return undefined;

      if (pagination.hasNextPage === true) {
        return (pagination.currentPage ?? 1) + 1;
      }

      if (
        typeof pagination.currentPage === 'number' &&
        typeof pagination.totalPages === 'number' &&
        pagination.currentPage < pagination.totalPages
      ) {
        return pagination.currentPage + 1;
      }

      return undefined;
    },
  });
};

export const useCreateProductCMS = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['create-product-cms'],
    mutationFn: (data: FormData) => createProductCMS(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['get-product-cms'] });
    },
  });
};

export const useGetProductCMSById = (id?: string) => {
  return useQuery({
    queryKey: ['get-product-cms-by-id', id],
    queryFn: () => getProductCMSById(id as string),
    enabled: Boolean(id),
  });
};

export const useUpdateProductCMS = (id?: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['update-product-cms', id],
    mutationFn: (data: FormData) => updateProductCMS(id as string, data),
    onSuccess: (response) => {
      if (!response?.success) return;
      queryClient.invalidateQueries({ queryKey: ['get-product-cms'] });
      queryClient.invalidateQueries({
        queryKey: ['get-product-cms-by-id', id],
      });
    },
  });
};

export const useDeleteProductCMS = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['delete-product-cms'],
    mutationFn: (id: string) => deleteProductCMS(id),
    onSuccess: (response) => {
      if (!response?.success) return;
      queryClient.invalidateQueries({ queryKey: ['get-product-cms'] });
    },
  });
};

export const useDeleteProductCMSMediaFiles = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['delete-product-cms-media-files'],
    mutationFn: ({
      id,
      bodyData,
    }: {
      id: string;
      bodyData: DeleteProductCMSMediaFilesBody;
    }) => deleteProductCMSMediaFiles(id, bodyData),
    onSuccess: (response) => {
      if (!response?.success) return;
      queryClient.invalidateQueries({ queryKey: ['get-product-cms'] });
      queryClient.invalidateQueries({ queryKey: ['get-product-assets'] });
    },
  });
};
export const useLink3DAssetToProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['link-3d-asset-to-product'],
    mutationFn: (data: { productId: string; assetId: string }) =>
      link3DAssetToProduct(data),
    onSuccess: (response) => {
      if (!response?.success) return;
      queryClient.invalidateQueries({ queryKey: ['get-product-cms'] });
    },
  });
};
export const useUnlink3DAssetFromProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['unlink-3d-asset-from-product'],
    mutationFn: (data: { productId: string; assetId: string }) =>
      unlink3DAssetFromProduct(data),
    onSuccess: (response) => {
      if (!response?.success) return;
      queryClient.invalidateQueries({ queryKey: ['get-product-cms'] });
    },
  });
};

export const useGetProductAssets = (
  id?: string,
  options: { enabled?: boolean; section?: string } = {}
) => {
  return useQuery({
    queryKey: ['get-product-assets', id, options.section],
    queryFn: () => getProductAssets(id as string),
    enabled: Boolean(id) && (options.enabled ?? true),
  });
};
