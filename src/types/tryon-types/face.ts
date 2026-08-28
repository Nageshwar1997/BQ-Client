import type { TTryOnSubCategory } from '@beautinique/frontend-types';

import type { IMakeupState } from '.';

export type TFaceFinish = TTryOnSubCategory<'FACE'>;
export type IFaceTryOnState = IMakeupState<TFaceFinish>;

// No textures yet - every finish built so far is a pure color/blend effect, no asset needed.
// Follows LIP's own precedent (MATTE/STAIN/LINER need none either) - add fields here only once
// a finish genuinely needs one, same as `ILipAssets` grew incrementally.
export type IFaceAssets = null;
