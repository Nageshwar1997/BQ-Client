import { useActionStore } from './action';
import { useThemeStore } from './theme';
import { useUserStore } from './user';

class Store {
  public theme = useThemeStore;
  public action = useActionStore;
  public user = useUserStore;
}

export const store = new Store();
