import { SORT_MAP } from '@beautinique/frontend-constants';
import type { TSort } from '@beautinique/frontend-types';

import type ApiError from '@/classes/ApiError';
import type {
  IEndpoint,
  TCategory,
  TGenerateQueryKeys,
  TGenerateRoutes,
  TParams,
  TRouteNode,
} from '@/types/api.type';

import { toaster } from './common.util';

export const handleApiErrorToaster = ({ message, globalErrors }: ApiError, title = 'Error') => {
  if (globalErrors?.length) {
    globalErrors.forEach((error) => {
      if (error) {
        toaster.error({ title, description: error });
      }
    });
  } else if (message) {
    toaster.error({ title, description: message });
  }
};

export const handleApiSuccessToaster = (message: string, title = 'Success') => {
  toaster.success({ title, description: message });
};

export const getFilteredAndSortedCats = (categories: TCategory[], search: string, sort?: TSort) => {
  const value = search.toLowerCase().trim();
  const filtered = value
    ? categories.filter((category) =>
        [category.name, category.slug].join(' ').toLowerCase().includes(value),
      )
    : categories;

  if (!sort) return filtered;

  return [...filtered].sort((a, b) => {
    const direction = sort === SORT_MAP.desc ? -1 : 1;
    return a.name.localeCompare(b.name) * direction;
  });
};

const joinPaths = (...paths: (string | undefined)[]) =>
  paths.filter(Boolean).join('/').replace(/\/+/g, '/').replace(/\/$/, '');

const isEndpoint = (value: unknown): value is IEndpoint => {
  return typeof value === 'object' && value !== null && 'path' in value && 'method' in value;
};

const buildDynamicUrl = <TPath extends string>(path: TPath, params?: TParams): TPath => {
  if (!params) {
    return path;
  }

  let result = path as string;

  Object.entries(params).forEach(([key, value]) => {
    result = result.replace(`:${key}`, String(value));
  });

  return result as TPath;
};

export const createRouteHelper = <T extends Record<string, unknown>>(
  config: T,
): TGenerateRoutes<T> => {
  const build = (node: TRouteNode, parents: string[] = []): Record<string, unknown> => {
    const currentBase = node.base ? [...parents, node.base] : parents;

    const result: Record<string, unknown> = {};

    Object.entries(node).forEach(([key, value]) => {
      if (isEndpoint(value)) {
        const fullPath = joinPaths(...currentBase, value.path);

        const hasParams = fullPath.includes(':');

        result[key] = {
          method: value.method.toUpperCase(),
          url: hasParams ? (params: TParams) => buildDynamicUrl(fullPath, params) : fullPath,
        };

        return;
      }

      if (typeof value === 'object' && value !== null) {
        result[key] = build(value as TRouteNode, currentBase);
      }
    });

    return result;
  };

  return build(config) as TGenerateRoutes<T>;
};

export const createQueryKeys = <T extends Record<string, unknown>>(
  config: T,
): TGenerateQueryKeys<T> => {
  const build = (node: TRouteNode, parents: string[] = []): Record<string, unknown> => {
    const currentBase = node.base ? [...parents, node.base] : parents;

    const result: Record<string, unknown> = {};

    Object.entries(node).forEach(([key, value]) => {
      if (isEndpoint(value)) {
        const fullPath = joinPaths(...currentBase, value.path);

        const hasParams = fullPath.includes(':');

        result[key] = hasParams
          ? (params: TParams) => [value.method.toUpperCase(), buildDynamicUrl(fullPath, params)]
          : [value.method.toUpperCase(), fullPath];

        return;
      }

      if (typeof value === 'object' && value !== null) {
        result[key] = build(value as TRouteNode, currentBase);
      }
    });

    return result;
  };

  return build(config) as TGenerateQueryKeys<T>;
};
