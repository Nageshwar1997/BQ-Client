import { ApiRequest } from '../ApiRequest';

export class MediaApi extends ApiRequest {
  protected get_home_videos = () => {
    return this.request(this.routes.media.video.home_videos);
  };
}
