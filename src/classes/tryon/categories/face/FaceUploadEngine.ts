import { withImageUpload } from '../../withImageUpload';
import { FaceEngineBase } from './FaceEngineBase';

export class FaceUploadEngine extends withImageUpload(FaceEngineBase) {}
