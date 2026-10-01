import { forwardRef } from 'react';

import type { IHairTryOnState } from '@/classes/tryon/categories/hair';
import { HairLiveEngine, HairUploadEngine } from '@/classes/tryon/categories/hair';
import type { ITryOnStageRef } from '@/types/tryon-types';

import type { ITryOnStageProps } from '../TryOnStage';
import TryOnStage from '../TryOnStage';

const ENGINES = { Live: HairLiveEngine, Upload: HairUploadEngine };

// Binds the shared TryOnStage to the Hair live/upload engine pair.
const HairTryOnStage = forwardRef<
  ITryOnStageRef<IHairTryOnState>,
  Omit<ITryOnStageProps<IHairTryOnState>, 'engines'>
>((props, ref) => <TryOnStage ref={ref} engines={ENGINES} {...props} />);

HairTryOnStage.displayName = 'HairTryOnStage';

export default HairTryOnStage;
