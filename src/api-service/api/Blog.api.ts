import type { TPagination } from '../../types';
import { ApiRequest } from '../ApiRequest';

export class BlogApi extends ApiRequest {
  protected get_all_blogs = (params?: TPagination) => {
    return this.request({ ...this.routes.blogs.get_all_blogs, params });
  };
  protected get_blog_by_id = (id: string) => {
    const { method, url } = this.routes.blogs.get_blog_by_id;
    return this.request({ method, url: `${url}/${id}` });
  };
}
