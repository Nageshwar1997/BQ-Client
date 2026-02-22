import { useActionStore } from './action.store';
import { useCartStore } from './cart.store';
import { useThemeStore } from './theme.store';
import { useUserStore } from './user.store';
import { useWishlistStore } from './wishlist.store';

class StoreClass {
  public Theme = useThemeStore;
  public Action = useActionStore;
  public User = useUserStore;
  public Wishlist = useWishlistStore;
  public Cart = useCartStore;
}

export const Store = new StoreClass();
