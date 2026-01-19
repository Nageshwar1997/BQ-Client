import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { ApiRequest } from '../classes';

class MediaApi extends ApiRequest {
  protected get_home_videos = () => {
    return this.request(this.routes.media.video.home_videos);
  };
}

export class MediaService extends MediaApi {
  public HomeVideos = () => {
    return useQuery({
      queryKey: ['get_home_videos'],
      queryFn: this.get_home_videos,
      staleTime: Infinity,
      gcTime: Infinity,
      refetchOnWindowFocus: false,
      placeholderData: keepPreviousData,
    });
  };
}
