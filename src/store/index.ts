import { useActionStore } from './action.store';
import { useThemeStore } from './theme.store';
import { useUserStore } from './user.store';

class Store {
  public theme = useThemeStore;
  public action = useActionStore;
  public user = useUserStore;
}

export const store = new Store();
