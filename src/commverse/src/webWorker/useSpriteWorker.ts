import { useRef, useState, useCallback } from 'react';
import type { SpriteWorkerInput, WorkerMessage } from './sprite.worker';

export interface SpriteResult {
  spriteFile: File;
  thumbnailFile: File;
}

export interface UseSpriteWorkerReturn {
  generate: (modelFile: File, hdrFile: string) => Promise<SpriteResult>;
  cancel: () => void;
  // progress: number;
  isLoading: boolean;
  error: string | null;
}

function createSpriteResult(
  spriteBlob: Blob,
  thumbnailBlob: Blob
): SpriteResult {
  return {
    spriteFile: new File([spriteBlob], 'sprite.webp', {
      type: 'image/webp',
    }),
    thumbnailFile: new File([thumbnailBlob], 'thumbnail.webp', {
      type: 'image/webp',
    }),
  };
}

export function useSpriteWorker(): UseSpriteWorkerReturn {
  const workerRef = useRef<Worker | null>(null);
  const pendingRejectRef = useRef<((reason?: unknown) => void) | null>(null);
  const cancelledRef = useRef(false);
  // const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cancel = useCallback(() => {
    cancelledRef.current = true;
    pendingRejectRef.current?.(new Error('Sprite generation cancelled'));
    pendingRejectRef.current = null;
    workerRef.current?.terminate();
    workerRef.current = null;
    setIsLoading(false);
    // setProgress(0);
  }, []);

  const generateLocally = useCallback(
    async (modelBuffer: ArrayBuffer, hdrBuffer: ArrayBuffer) => {
      const { generateSpriteAndOrThumbnail } = await import('./worker.utils');
      const { spriteBlob, thumbnailBlob } = await generateSpriteAndOrThumbnail(
        { modelBuffer, hdrBuffer },
        () => undefined
      );

      if (!spriteBlob || !thumbnailBlob) {
        throw new Error('Local sprite generation returned empty blobs');
      }

      return createSpriteResult(spriteBlob, thumbnailBlob);
    },
    []
  );

  const generate = useCallback(
    async (modelFile: File, hdrUrl: string): Promise<SpriteResult> => {
      cancel();
      cancelledRef.current = false;

      setIsLoading(true);
      // setProgress(0);
      setError(null);

      let modelBuffer: ArrayBuffer;
      let hdrBuffer: ArrayBuffer;

      try {
        [modelBuffer, hdrBuffer] = await Promise.all([
          modelFile.arrayBuffer(),
          fetch(hdrUrl).then((res) => {
            if (!res.ok)
              throw new Error(`Failed to fetch HDR: ${res.statusText}`);
            return res.arrayBuffer();
          }),
        ]);
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : String(err);
        console.error('Failed to load buffers:', errorMsg);
        setError(errorMsg);
        setIsLoading(false);
        throw new Error(errorMsg);
      }

      const worker = new Worker(
        new URL('./sprite.worker.ts', import.meta.url),
        {
          type: 'module',
        }
      );
      workerRef.current = worker;

      // Preserve local copies for the main-thread compatibility fallback.
      // The buffers posted to the worker are transferred and become detached.
      const fallbackModelBuffer = modelBuffer.slice(0);
      const fallbackHdrBuffer = hdrBuffer.slice(0);

      try {
        return await new Promise<SpriteResult>((resolve, reject) => {
          pendingRejectRef.current = reject;

          const cleanup = () => {
            pendingRejectRef.current = null;
            worker.terminate();
            if (workerRef.current === worker) {
              workerRef.current = null;
            }
          };

          worker.onmessage = (e: MessageEvent<WorkerMessage>) => {
            const msg = e.data;
            switch (msg.type) {
              case 'progress':
                break;
              case 'result':
                cleanup();
                resolve(createSpriteResult(msg.spriteBlob, msg.thumbnailBlob));
                break;
              case 'error':
                cleanup();
                reject(new Error(msg.message));
                break;
            }
          };

          worker.onerror = (e) => {
            cleanup();
            reject(new Error(e.message || 'Failed to start sprite worker'));
          };

          const payload: SpriteWorkerInput = { modelBuffer, hdrBuffer };
          worker.postMessage(payload, [payload.modelBuffer, payload.hdrBuffer]);
        });
      } catch (workerError) {
        if (cancelledRef.current) {
          throw workerError;
        }

        console.warn(
          '[SpriteWorker] Worker path failed, retrying on main thread for compatibility:',
          workerError
        );

        try {
          return await generateLocally(fallbackModelBuffer, fallbackHdrBuffer);
        } catch (localError) {
          const errorMsg =
            localError instanceof Error
              ? localError.message
              : String(localError);
          console.error('[SpriteWorker] Local fallback failed:', localError);
          setError(errorMsg);
          throw new Error(errorMsg);
        }
      } finally {
        if (!cancelledRef.current) {
          setIsLoading(false);
        }
      }
    },
    [cancel, generateLocally]
  );

  return { generate, cancel, isLoading, error };
}
