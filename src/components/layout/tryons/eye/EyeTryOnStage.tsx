import { forwardRef } from 'react';

import type { IEyeTryOnState } from '@/classes/tryon/categories/eye';
import { EyeLiveEngine, EyeUploadEngine } from '@/classes/tryon/categories/eye';
import type { ITryOnStageRef } from '@/types/tryon-types';

import type { ITryOnStageProps } from '../TryOnStage';
import TryOnStage from '../TryOnStage';

const ENGINES = { Live: EyeLiveEngine, Upload: EyeUploadEngine };

// Binds the shared TryOnStage to the Eye live/upload engine pair.
const EyeTryOnStage = forwardRef<
  ITryOnStageRef<IEyeTryOnState>,
  Omit<ITryOnStageProps<IEyeTryOnState>, 'engines'>
>((props, ref) => <TryOnStage ref={ref} engines={ENGINES} {...props} />);

EyeTryOnStage.displayName = 'EyeTryOnStage';

export default EyeTryOnStage;
