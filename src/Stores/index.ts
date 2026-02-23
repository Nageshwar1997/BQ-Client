import { useActionStore } from './Action.store';
import { useCartStore } from './Cart.store';
import { useThemeStore } from './Theme.store';
import { useUserStore } from './User.store';
import { useWishlistStore } from './Wishlist.store';

class StoreClass {
  public Theme = useThemeStore;
  public Action = useActionStore;
  public User = useUserStore;
  public Wishlist = useWishlistStore;
  public Cart = useCartStore;
}

export const Store = new StoreClass();
