import { forwardRef } from 'react';

import type { ILipTryOnState } from '@/classes/tryon/categories/lip';
import { LipLiveEngine, LipUploadEngine } from '@/classes/tryon/categories/lip';
import type { ITryOnStageRef } from '@/types/tryon-types';

import type { ITryOnStageProps } from '../TryOnStage';
import TryOnStage from '../TryOnStage';

const ENGINES = { Live: LipLiveEngine, Upload: LipUploadEngine };

// Binds the shared TryOnStage to the Lip live/upload engine pair.
const LipTryOnStage = forwardRef<
  ITryOnStageRef<ILipTryOnState>,
  Omit<ITryOnStageProps<ILipTryOnState>, 'engines'>
>((props, ref) => <TryOnStage ref={ref} engines={ENGINES} {...props} />);

LipTryOnStage.displayName = 'LipTryOnStage';

export default LipTryOnStage;
