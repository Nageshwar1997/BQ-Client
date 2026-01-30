import { useActionStore } from './action.store';
import { useCartStore } from './cart.store';
import { useThemeStore } from './theme.store';
import { useUserStore } from './user.store';
import { useWishlistStore } from './wishlist.store';

class Store {
  public theme = useThemeStore;
  public action = useActionStore;
  public user = useUserStore;
  public wishlist = useWishlistStore;
  public cart = useCartStore;
}

export const store = new Store();
