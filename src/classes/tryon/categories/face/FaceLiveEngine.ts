import { withLiveCamera } from '../../withLiveCamera';
import { FaceEngineBase } from './FaceEngineBase';

export class FaceLiveEngine extends withLiveCamera(FaceEngineBase) {}
