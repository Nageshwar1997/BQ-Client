import { AuthService, MediaService, UserService } from './service';

export const service = {
  auth: new AuthService(),
  user: new UserService(),
  media: new MediaService(),
};
