import type { DOMRouterOpts, RouteObject } from 'react-router-dom';

export type TRouteAccess = 'public' | 'private' | 'guest-only' | 'social-only';

export type TRouteObject = Omit<RouteObject, 'children'> & {
  access?: TRouteAccess;
  children?: TRouteObject[]; // recursive override
};

export type TRoutes = { routes: TRouteObject[]; opts?: DOMRouterOpts };
