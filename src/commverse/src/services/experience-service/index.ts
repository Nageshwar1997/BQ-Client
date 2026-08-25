import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import {
  handleListExperiences,
  type GetExperiencesParams,
  getExperienceById,
  updateExperience,
  getManageExperiences,
  publishExperience,
} from '../api';
import type { GetManageExperiencesParams } from '../../types';

export const useGetExperiences = (params: GetExperiencesParams = {}) => {
  return useInfiniteQuery({
    queryKey: ['get-experiences', params],
    queryFn: ({ pageParam }) =>
      handleListExperiences({ ...params, page: Number(pageParam) }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage?.data?.length) return undefined;
      return allPages.length + 1;
    },
    select: (data) => {
      if (!data?.pages) return undefined;
      const allItems = data.pages.flatMap((page) => page?.data || []);
      return {
        data: allItems,
        totalResults: data.pages[0]?.pagination?.total,
      };
    },
  });
};

export const useGetExperienceById = (id?: string) => {
  return useQuery({
    queryKey: ['experience', id],
    queryFn: () => getExperienceById(id as string),
    staleTime: 0,
    enabled: !!id,
  });
};

export const useUpdateExperience = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { id: string; data: Parameters<typeof updateExperience>[1] }) =>
      updateExperience(data.id, data.data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['experience', variables.id] });
      queryClient.invalidateQueries({
        queryKey: ['get-experience-by-id', variables.id],
      });
      queryClient.invalidateQueries({ queryKey: ['get-experiences'] });
      queryClient.invalidateQueries({ queryKey: ['get-manage-experiences'] });
    },
  });
};

export const usePublishExperience = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { id: string; status: 'published' | 'draft' }) =>
      publishExperience(data.id, data.status),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['experience', variables.id] });
      queryClient.invalidateQueries({
        queryKey: ['get-experience-by-id', variables.id],
      });
      queryClient.invalidateQueries({ queryKey: ['get-experiences'] });
    },
  });
};

export const useGetManageExperiences = (
  params: GetManageExperiencesParams = {}
) => {
  return useInfiniteQuery({
    queryKey: ['get-manage-experiences', params],
    queryFn: ({ pageParam }) =>
      getManageExperiences({ ...params, page: Number(pageParam) }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { pagination } = lastPage || {};
      if (!pagination || pagination.currentPage >= pagination.totalPages) {
        return undefined;
      }
      return pagination.currentPage + 1;
    },
    select: (data) => {
      if (!data?.pages) return undefined;
      const allItems = data.pages.flatMap((page) => page?.data || []);
      return {
        data: allItems,
        pagination: data.pages[0]?.pagination,
      };
    },
  });
};
