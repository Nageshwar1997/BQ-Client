import { useActionStore } from './Action.store';
import { useCartStore } from './Cart.store';
import { useThemeStore } from './Theme.store';
import { useUserStore } from './User.store';
import { useWishlistStore } from './Wishlist.store';

export const ThemeStore = useThemeStore;
export const ActionStore = useActionStore;
export const UserStore = useUserStore;
export const WishlistStore = useWishlistStore;
export const CartStore = useCartStore;
