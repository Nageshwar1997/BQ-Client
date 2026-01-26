import { keepPreviousData, useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { BlogApi } from '../api';
import { QUERY_KEYS } from '../../constants';

export class BlogService extends BlogApi {
  public GetBlogs = (limit?: number) => {
    return useInfiniteQuery({
      queryKey: QUERY_KEYS.blogs.get_all_blogs,
      initialPageParam: 1,
      queryFn: ({ pageParam = 1 }) => this.get_all_blogs({ page: pageParam, limit: limit ?? 10 }),
      placeholderData: keepPreviousData,
      staleTime: Infinity,
      gcTime: Infinity,
      retry: false,
      getNextPageParam: (lastPage, allPages) => {
        const hasMore = lastPage.blogs.length === limit;
        return hasMore ? allPages.length + 1 : undefined;
      },
    });
  };

  public GetBlogById = (id: string) => {
    return useQuery({
      queryKey: QUERY_KEYS.blogs.get_blog_by_id,
      queryFn: () => this.get_blog_by_id(id),
    });
  };
}
