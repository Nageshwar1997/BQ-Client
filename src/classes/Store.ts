import { useThemeStore } from '../store';
import { useActionStore } from '../store/action.store';

export class Store {
  public theme = useThemeStore;
  public action = useActionStore;
}
