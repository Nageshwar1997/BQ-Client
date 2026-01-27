import { useAuthCheck } from './useAuthCheck';
import { useIsMobile } from './useIsMobile';
import { useOutsideClick } from './useOutsideClick';
import { usePathParams, useQueryParams } from './useParams';
import { useRequireAuth } from './useRequireAuth';
import { useScrollable } from './useScrollable';

class Hooks {
  public AuthCheck = useAuthCheck;
  public IsMobile = useIsMobile;
  public OutsideClick = useOutsideClick;
  public QueryParams = useQueryParams;
  public PathParams = usePathParams;
  public RequireAuth = useRequireAuth;
  public Scrollable = useScrollable;
}

export const customHooks = new Hooks();
