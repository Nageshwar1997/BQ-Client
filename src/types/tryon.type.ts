// Temporary local mirror of `@beautinique/shared-types`' `product-service/tryon.types.ts`,
// pointed at the extended `TRY_ON_MAP` in `@/constants/temp.constants` instead of the one
// currently published in `@beautinique/shared-constants`. Delete this file (and go back to
// importing `TTryOnSelection` from `@beautinique/frontend-types` in `api.type.ts`) once the
// shared package is republished with the extended taxonomy.
import type { TRY_ON_MAP } from '@/constants/temp.constants';

export type TTryOnMap = typeof TRY_ON_MAP;

export type TTryOnCategory = keyof TTryOnMap;

export type TTryOnSubCategory<TCategory extends TTryOnCategory = TTryOnCategory> =
  TTryOnMap[TCategory][number];

export type TTryOnSelection = {
  [K in TTryOnCategory]: { category: K; subCategory: TTryOnSubCategory<K> };
}[TTryOnCategory];

export interface IObjectFitContentRect {
  leftPercent: number;
  widthPercent: number;
}