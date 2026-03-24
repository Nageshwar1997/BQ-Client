import { useAuthCheck } from './AuthCheck.hook';
import { useIsMobile } from './IsMobile.hook';
import { useOutsideClick } from './OutsideClick.hook';
import { usePathParams, useQueryParams } from './Params.hook';
import { useRequireAuth } from './RequireAuth.hook';
import { useScrollable } from './Scrollable.hook';
import { useSocket } from './Socket.hook';
import { useCart } from './Cart.hook';
import { useWishlist } from './Wishlist.hook';
import { useForgotPasswordFlow } from './ForgotPasswordFlow';

class CustomHooks {
  public AuthCheck = useAuthCheck;
  public IsMobile = useIsMobile;
  public OutsideClick = useOutsideClick;
  public QueryParams = useQueryParams;
  public PathParams = usePathParams;
  public RequireAuth = useRequireAuth;
  public Scrollable = useScrollable;
  public Socket = useSocket;
  public Cart = useCart;
  public Wishlist = useWishlist;
  public ForgotPasswordFlow = useForgotPasswordFlow;
}

export const Hook = new CustomHooks();
