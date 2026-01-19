import { AuthService } from './Auth';
import { MediaService } from './Media';
import { UserService } from './User';

export const service = {
  auth: new AuthService(),
  user: new UserService(),
  media: new MediaService(),
};
