import { forwardRef } from 'react';

import type { INailTryOnState } from '@/classes/tryon/categories/nail';
import { NailLiveEngine, NailUploadEngine } from '@/classes/tryon/categories/nail';
import type { ITryOnStageRef } from '@/types/tryon-types';

import type { ITryOnStageProps } from '../TryOnStage';
import TryOnStage from '../TryOnStage';

const ENGINES = { Live: NailLiveEngine, Upload: NailUploadEngine };

// Binds the shared TryOnStage to the Nail live/upload engine pair.
const NailTryOnStage = forwardRef<
  ITryOnStageRef<INailTryOnState>,
  Omit<ITryOnStageProps<INailTryOnState>, 'engines'>
>((props, ref) => <TryOnStage ref={ref} engines={ENGINES} {...props} />);

NailTryOnStage.displayName = 'NailTryOnStage';

export default NailTryOnStage;
