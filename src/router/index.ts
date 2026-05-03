import { authenticate, guestOnly, socialOnly } from '@/middlewares';
import routes from '@/routess';
import type { TRouteAccess, TRouteObject } from '@/types/common.type';
import { createBrowserRouter, type MiddlewareFunction, type RouteObject } from 'react-router-dom';

const ACCESS_MIDDLEWARE_MAP: Record<TRouteAccess, MiddlewareFunction[]> = {
  public: [],
  private: [authenticate],
  guest: [guestOnly],
  social: [authenticate, socialOnly],
};

const applyMiddleware = (routes: TRouteObject[]): RouteObject[] => {
  return routes.map((route) => {
    const { access = 'public', children, index, ...rest } = route;

    const middleware = ACCESS_MIDDLEWARE_MAP[access];

    // 🔥 INDEX ROUTE
    if (index) {
      return { ...rest, index: true, middleware };
    }

    // 🔥 NORMAL ROUTE
    return { ...rest, middleware, children: children ? applyMiddleware(children) : undefined };
  });
};

const router = createBrowserRouter(applyMiddleware(routes));

export default router;
