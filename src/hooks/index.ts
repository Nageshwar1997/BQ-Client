import { useAuthCheck } from './useAuthCheck';
import { useIsMobile } from './useIsMobile';
import { useOutsideClick } from './useOutsideClick';
import { usePathParams, useQueryParams } from './useParams';
import { useRequireAuth } from './useRequireAuth';
import { useScrollable } from './useScrollable';
import { useSocket } from './useSocket';
import { useUserCart } from './useUserCart';
import { useUserWishlist } from './useUserWishlist';

class CustomHooks {
  public AuthCheck = useAuthCheck;
  public IsMobile = useIsMobile;
  public OutsideClick = useOutsideClick;
  public QueryParams = useQueryParams;
  public PathParams = usePathParams;
  public RequireAuth = useRequireAuth;
  public Scrollable = useScrollable;
  public Socket = useSocket;
  public UserCart = useUserCart;
  public UserWishlist = useUserWishlist;
}

export const Hook = new CustomHooks();
