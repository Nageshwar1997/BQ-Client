import { withLiveCameraSegmentation } from '../../withLiveCameraSegmentation';
import { HairEngineBase } from './HairEngineBase';

export class HairLiveEngine extends withLiveCameraSegmentation(HairEngineBase) {}
