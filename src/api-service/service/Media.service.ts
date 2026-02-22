import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { MediaApi } from '../api';
import { QUERY_KEYS } from '@/constants';

export class MediaService extends MediaApi {
  public HomeVideos = () => {
    return useQuery({
      queryKey: QUERY_KEYS.media.video.home_videos,
      queryFn: this.get_home_videos,
      staleTime: Infinity,
      gcTime: Infinity,
      placeholderData: keepPreviousData,
    });
  };
}
