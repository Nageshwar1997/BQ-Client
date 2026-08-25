/// <reference lib="webworker" />
import {
  generateSpriteAndOrThumbnail,
  initImagePolyfill,
} from './worker.utils';

initImagePolyfill();

export interface SpriteWorkerInput {
  modelBuffer: ArrayBuffer;
  hdrBuffer: ArrayBuffer;
  options?: Partial<SpriteOptions>;
}

export interface SpriteOptions {
  frameCount: number;
  width: number;
  height: number;
  thumbnailWidth: number;
  thumbnailHeight: number;
  backgroundColor: number | null;
  dracoDecoderPath: string;
  basisTranscoderPath: string;
}

export type WorkerMessage =
  | { type: 'progress'; frame: number; total: number }
  | { type: 'result'; spriteBlob: Blob; thumbnailBlob: Blob }
  | { type: 'error'; message: string };

async function generateSpriteAndThumbnail(
  input: SpriteWorkerInput,
  postProgress: (frame: number, total: number) => void
): Promise<{ spriteBlob: Blob; thumbnailBlob: Blob }> {
  try {
    const { spriteBlob, thumbnailBlob } = await generateSpriteAndOrThumbnail(
      input,
      postProgress
    );

    if (!spriteBlob || !thumbnailBlob) {
      throw new Error('Failed to generate sprite or thumbnail blob');
    }

    return { spriteBlob, thumbnailBlob };
  } catch (spriteError: unknown) {
    const { thumbnailBlob } = await generateSpriteAndOrThumbnail(
      input,
      postProgress,
      true
    );

    if (!thumbnailBlob) {
      throw new Error('Failed to generate thumbnail blob', {
        cause: spriteError,
      });
    }

    return { spriteBlob: thumbnailBlob, thumbnailBlob };
  }
}

self.onmessage = async (e: MessageEvent<SpriteWorkerInput>) => {
  try {
    const result = await generateSpriteAndThumbnail(e.data, (frame, total) => {
      self.postMessage({
        type: 'progress',
        frame,
        total,
      } satisfies WorkerMessage);
    });
    self.postMessage({ type: 'result', ...result } satisfies WorkerMessage);
  } catch (err) {
    console.error('Sprite generation error:', err);
    self.postMessage({
      type: 'error',
      message: err instanceof Error ? err.message : String(err),
    } satisfies WorkerMessage);
  }
};
