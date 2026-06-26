import type {
  TApiMethod,
  TAuthProvider,
  TCategoryLevel,
  TCategoryLevelsMap,
  TRole,
} from '@beautinique/shared-constants';
import type { TRegister } from './schema.type';

export type TFieldErrors = Record<string, string[]>;

export interface IId {
  _id: string;
}

export interface ITimeStamp {
  createdAt: string;
  updatedAt: string;
}

export interface IUser extends Omit<TRegister, 'confirmPassword' | 'password'>, IId, ITimeStamp {
  providers: TAuthProvider[];
  role: TRole;
  avatar?: string;
}

export interface ICreateHeaders {
  user?: Partial<Pick<IUser, '_id' | 'role'>>;
  token?: string;
  loginRole?: TRole;
  contentType?: string;
}

export type TRouteNode = Record<string, unknown> & { base?: string };

export interface IEndpoint {
  path: string;
  method: Lowercase<TApiMethod>;
}

export type TParams = Record<string, string | number>;

type TExtractRouteParams<T extends string> = T extends `${string}:${infer Param}/${infer Rest}`
  ? Record<Param | keyof TExtractRouteParams<`/${Rest}`>, string | number>
  : T extends `${string}:${infer Param}`
    ? Record<Param, string | number>
    : never;

type TUrl<FullPath extends string> =
  TExtractRouteParams<FullPath> extends never
    ? FullPath
    : (params: TExtractRouteParams<FullPath>) => FullPath;

interface IGeneratedEndpoint<T extends IEndpoint, FullPath extends string> {
  method: Uppercase<T['method']>;
  url: TUrl<FullPath>;
}

export type TGenerateRoutes<
  T,
  ParentPath extends string = T extends { base: infer B } ? (B extends string ? B : '') : '',
> = {
  [K in keyof T as K extends 'base' ? never : K]: T[K] extends IEndpoint
    ? IGeneratedEndpoint<T[K], `${ParentPath}${T[K]['path']}`>
    : T[K] extends Record<string, unknown>
      ? TGenerateRoutes<
          T[K],
          `${ParentPath}${T[K] extends {
            base: infer B;
          }
            ? B extends string
              ? B
              : ''
            : ''}`
        >
      : never;
};

type TQueryKey<FullPath extends string, Method extends string> =
  TExtractRouteParams<FullPath> extends never
    ? readonly [Uppercase<Method>, FullPath]
    : (params: TExtractRouteParams<FullPath>) => readonly [Uppercase<Method>, FullPath];

export type TGenerateQueryKeys<
  T,
  ParentPath extends string = T extends { base: infer B } ? (B extends string ? B : '') : '',
> = {
  [K in keyof T as K extends 'base' ? never : K]: T[K] extends IEndpoint
    ? TQueryKey<`${ParentPath}${T[K]['path']}`, T[K]['method']>
    : T[K] extends Record<string, unknown>
      ? TGenerateQueryKeys<
          T[K],
          `${ParentPath}${T[K] extends {
            base: infer B;
          }
            ? B extends string
              ? B
              : ''
            : ''}`
        >
      : never;
};

/* -------------------------------------------------------------------------- */
/*                                  CATEGORY                                  */
/* -------------------------------------------------------------------------- */

export type TLevel1 = TCategoryLevelsMap['L1'];
export type TLevel2 = TCategoryLevelsMap['L2'];
export type TLevel3 = TCategoryLevelsMap['L3'];

type CategoryBase<TLevel extends TCategoryLevel> = IId & {
  name: string;
  slug: string;
  level: TLevel;
  path?: string;
};

export type TL1Category = CategoryBase<TLevel1>;
export type TL2Category = CategoryBase<TLevel2> & { parent: string };
export type TL3Category = CategoryBase<TLevel3> & { parent: string; description: string };

export type TCategory = TL1Category | TL2Category | TL3Category;

export type TCategoryHierarchyNode<TLevel extends TCategoryLevel> = TLevel extends TLevel1
  ? CategoryBase<TLevel1> & { subcategories: TCategoryHierarchyNode<TLevel2>[] }
  : TLevel extends TLevel2
    ? CategoryBase<TLevel2> & {
        parent: string;
        subcategories: TCategoryHierarchyNode<TLevel3>[];
      }
    : CategoryBase<TLevel3> & { parent: string; description: string; subcategories?: never };

export type TCategoryHierarchy = TCategoryHierarchyNode<TLevel1>;
