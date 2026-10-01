import { forwardRef } from 'react';

import type { IFaceTryOnState } from '@/classes/tryon/categories/face';
import { FaceLiveEngine, FaceUploadEngine } from '@/classes/tryon/categories/face';
import type { ITryOnStageRef } from '@/types/tryon-types';

import type { ITryOnStageProps } from '../TryOnStage';
import TryOnStage from '../TryOnStage';

const ENGINES = { Live: FaceLiveEngine, Upload: FaceUploadEngine };

// Binds the shared TryOnStage to the Face live/upload engine pair.
const FaceTryOnStage = forwardRef<
  ITryOnStageRef<IFaceTryOnState>,
  Omit<ITryOnStageProps<IFaceTryOnState>, 'engines'>
>((props, ref) => <TryOnStage ref={ref} engines={ENGINES} {...props} />);

FaceTryOnStage.displayName = 'FaceTryOnStage';

export default FaceTryOnStage;
