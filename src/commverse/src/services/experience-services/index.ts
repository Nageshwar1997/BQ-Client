import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createExperience,
  deleteExperience,
  deleteExperienceImage,
  getExperienceById,
  getExperiences,
  publishExperience,
  updateExperience,
  uploadExperienceImages,
  type ExperienceFilters,
  type ExperienceStatus,
  type PaginationQuery,
} from '../api';

export const useCreateExperience = () => {
  return useMutation({
    mutationKey: ['create-experience'],
    mutationFn: createExperience,
  });
};

export const useGetExperiences = (
  filters?: ExperienceFilters,
  pagination?: PaginationQuery
) => {
  return useQuery({
    queryKey: ['get-experiences', filters, pagination],
    queryFn: () => getExperiences(filters, pagination),
  });
};

export const useGetExperienceById = (id: string) => {
  return useQuery({
    queryKey: ['get-experience-by-id', id],
    queryFn: () => getExperienceById(id),
    refetchOnWindowFocus: false,
    staleTime: 0,
    enabled: !!id,
  });
};

export const useDeleteExperience = () => {
  return useMutation({
    mutationKey: ['delete-experience'],
    mutationFn: deleteExperience,
  });
};

export const useUpdateExperience = () => {
  const queryClient = useQueryClient();

  const isTitleOnlyUpdate = (data: {
    title?: string;
    draftData?: string;
    assetIds?: string[];
    siteInfo?: { siteId: string; slug: string };
  }) => {
    return (
      data.title !== undefined &&
      data.draftData === undefined &&
      data.assetIds === undefined &&
      data.siteInfo === undefined
    );
  };

  return useMutation({
    mutationKey: ['update-experience'],
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: {
        title?: string;
        draftData?: string;
        assetIds?: string[];
        siteInfo?: { siteId: string; slug: string };
      };
    }) => updateExperience(id, data),
    onSuccess: (_data, variables) => {
      if (!variables?.id) return;

      if (isTitleOnlyUpdate(variables.data)) {
        const patchTitle = (current: any) => {
          if (!current?.data) return current;
          return {
            ...current,
            data: {
              ...current.data,
              title: variables.data.title,
            },
          };
        };

        queryClient.setQueryData(
          ['get-experience-by-id', variables.id],
          patchTitle
        );
        queryClient.setQueryData(['experience', variables.id], patchTitle);
        return;
      }

      queryClient.invalidateQueries({
        queryKey: ['get-experience-by-id', variables.id],
      });
      queryClient.invalidateQueries({
        queryKey: ['experience', variables.id],
      });
    },
    // const queryClient = useQueryClient();

    // return useMutation({
    //   mutationKey: ['update-experience'],
    //   mutationFn: updateExperience,
    //   onSuccess: (_data, variables) => {
    //     if (!variables?.id) return;

    //     queryClient.invalidateQueries({
    //       queryKey: ['get-experience-by-id', variables.id],
    //     });
    //   },
  });
};

export const usePublishExperience = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['update-experience-status'],
    mutationFn: ({ id, status }: { id: string; status: ExperienceStatus }) =>
      publishExperience(id, status),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['get-experience-by-id', variables.id],
      });
      queryClient.invalidateQueries({
        queryKey: ['experience', variables.id],
      });
    },
  });
};

export const useUploadExperienceImages = () => {
  return useMutation({
    mutationKey: ['upload-experience-images'],
    mutationFn: (formData: FormData) => uploadExperienceImages(formData),
  });
};

export const useDeleteExperienceImage = () => {
  return useMutation({
    mutationKey: ['delete-experience-image'],
    mutationFn: (keys: string[]) => deleteExperienceImage(keys),
  });
};
