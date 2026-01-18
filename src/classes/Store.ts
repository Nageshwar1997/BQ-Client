import { useThemeStore } from '../store';
import { useActionStore } from '../store/action.store';
import { useUserStore } from '../store/user.store';

export class Store {
  public theme = useThemeStore;
  public action = useActionStore;
  public user = useUserStore;
}
