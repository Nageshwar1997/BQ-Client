import {
  keepPreviousData,
  useInfiniteQuery,
  useQuery,
} from "@tanstack/react-query";
import { get_all_blogs, get_blog_by_id } from "./blog.api";

export const useGetAllBlogs = (limit?: number) => {
  return useInfiniteQuery({
    queryKey: ["get_all_blogs"],
    initialPageParam: 1,
    queryFn: ({ pageParam = 1 }) =>
      get_all_blogs({ page: pageParam, limit: limit ?? 10 }),
    placeholderData: keepPreviousData,
    staleTime: Infinity,
    gcTime: Infinity,
    enabled: true,
    retry: false,
    refetchOnWindowFocus: false,
    getNextPageParam: (lastPage, allPages) => {
      const hasMore = lastPage.blogs.length === limit;
      return hasMore ? allPages.length + 1 : undefined;
    },
  });
};

export const useGetBlogById = (blogId: string) => {
  return useQuery({
    queryKey: ["get_blog_by_id"],
    queryFn: () => get_blog_by_id(blogId),
    enabled: true,
    refetchOnWindowFocus: false,
  });
};
