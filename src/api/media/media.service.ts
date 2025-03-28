import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { get_home_videos } from "./media.api";

export const useGetHomeVideos = () => {
  return useQuery({
    queryKey: ["get_home_videos"],
    queryFn: get_home_videos,
    retry: false,
    staleTime: Infinity,
    gcTime: Infinity,
    placeholderData: keepPreviousData,
  });
};
