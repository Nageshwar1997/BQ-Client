import { useInfiniteQuery, useMutation, useQuery } from '@tanstack/react-query';
import {
  delete3DAsset,
  get3DAssetId,
  get3DAssets,
  update3DAsset,
  upload3DAsset,
} from '../api';
import { useParams } from 'react-router';

interface UseGet3DAssetsParams {
  searchTerm?: string;
  categoryId?: string;
  productId?: string;
  sortOrder?: 'asc' | 'desc';
  experienceType?: string;
  fileType?: string;
  assetType?: string;
  enabled?: boolean;
}

export const useGet3DAssets = (params: UseGet3DAssetsParams | string = {}) => {
  const resolvedParams =
    typeof params === 'string' ? { searchTerm: params } : params;
  const resolvedSearchTerm = resolvedParams?.searchTerm ?? '';
  const resolvedCategoryId = resolvedParams?.categoryId;
  const resolvedSortOrder = resolvedParams?.sortOrder ?? 'desc';
  const resolvedExperienceType = resolvedParams?.experienceType;
  const resolvedFileType = resolvedParams?.fileType ?? '';
  const resolvedAssetType = resolvedParams?.assetType ?? '';
  const resolvedproductId = resolvedParams?.productId ?? '';
  const isEnabled = resolvedParams?.enabled ?? true;

  return useInfiniteQuery({
    queryKey: [
      'get-3d-assets',
      resolvedSearchTerm,
      resolvedCategoryId,
      resolvedSortOrder,
      resolvedExperienceType,
      resolvedFileType,
      resolvedAssetType,
      resolvedproductId,
    ],
    queryFn: ({ pageParam }) =>
      get3DAssets({
        page: pageParam as number,
        search: resolvedSearchTerm,
        categoryId: resolvedCategoryId,
        sortOrder: resolvedSortOrder,
        experienceType: resolvedExperienceType,
        fileType: resolvedFileType,
        assetType: resolvedAssetType,
        productId: resolvedproductId,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const currentPage = lastPage?.pagination?.page;
      const totalPages = lastPage?.pagination?.totalPages;

      if (
        typeof currentPage === 'number' &&
        typeof totalPages === 'number' &&
        currentPage < totalPages
      ) {
        return currentPage + 1;
      }

      return lastPage?.data?.length ? allPages.length + 1 : undefined;
    },
    getPreviousPageParam: (firstPage) => firstPage.prevCursor,
    select: (data) => {
      if (!data?.pages) return undefined;

      const allItems = data.pages.flatMap((page) => page?.data || []);
      const totalResults = data.pages[0]?.pagination?.total;

      return {
        data: allItems,
        totalResults,
      };
    },
    enabled: isEnabled,
  });
};

export const useGet3DAssetById = () => {
  const { id } = useParams();

  return useQuery({
    queryKey: ['get-3d-asset', id],
    queryFn: () => get3DAssetId(id!),
    enabled: !!id,
  });
};

export const useUpload3DAsset = () => {
  return useMutation({
    mutationKey: ['upload-3d-asset'],
    mutationFn: (data: FormData) => upload3DAsset(data),
  });
};

export const useUpdate3DAsset = (assetId?: string) => {
  const { id: paramId } = useParams();
  const id = assetId ?? paramId;

  return useMutation({
    mutationKey: ['update-3d-asset', id],
    mutationFn: (data: FormData) => {
      if (!id) throw new Error('Asset id is required');
      return update3DAsset(id, data);
    },
  });
};

export const useDelete3DAsset = () => {
  return useMutation({
    mutationKey: ['delete-3d-asset'],
    mutationFn: (id: string) => delete3DAsset(id),
  });
};
