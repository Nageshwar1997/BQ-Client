import type { TTryOnSubCategory } from '@beautinique/frontend-types';

import type { IMakeupState } from '.';

export type TLipFinish = TTryOnSubCategory<'LIP'>;
export type ILipTryOnState = IMakeupState<TLipFinish>;

export interface ILipAssets {
  glossUpper: HTMLImageElement;
  glossLower: HTMLImageElement;
  crayon: HTMLImageElement;
  shimmer: HTMLImageElement;
  oilUpper: HTMLImageElement;
  oilLower: HTMLImageElement;
  metallicUpper: HTMLImageElement;
  metallicLower: HTMLImageElement;
  plumperUpper: HTMLImageElement;
  plumperLower: HTMLImageElement;
  satinUpper: HTMLImageElement;
  satinLower: HTMLImageElement;
  balmUpper: HTMLImageElement;
  balmLower: HTMLImageElement;
}
