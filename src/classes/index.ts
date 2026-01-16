import { AuthService } from './Auth';
import { Store } from './Store';

export const store = new Store();
export const service = {
  auth: new AuthService(),
};
