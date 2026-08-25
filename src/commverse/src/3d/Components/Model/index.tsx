import { memo, useEffect, Suspense } from 'react';
import type { IModelProps } from '../../../types';
import { validateModel } from '../../Utils';
import ValidatedModel from '../ValidatedModel';
import { useModelStore } from '../../../lib/store/modelStore';
import { MODEL_MAX_SIZE } from '../../../constants';

const Model = memo(function Model({
  url,
  settings,
  onLoaded,
  onError,
  description,
  viewer = false,
  isImmersivePdpPresentation = false,
}: IModelProps) {
  const {
    status,
    setStatus,
    validationError,
    setValidationError,
    cachedBlobUrl,
    setCachedBlobUrl,
  } = useModelStore();

  useEffect(() => {
    if (status === 'invalid' && validationError) {
      onError?.(validationError.description);
    }
  }, [status, validationError, onError]);

  if (description) console.log(description);

  useEffect(() => {
    let mounted = true;
    const controller = new AbortController();

    async function runValidation() {
      if (!mounted) return;

      setStatus('validating');
      setValidationError(null);
      setCachedBlobUrl(null);

      try {
        const result = await validateModel(url, {
          signal: controller.signal,
        });

        if (!mounted) return;

        if (
          result.extensionsRequired?.includes(
            'KHR_materials_pbrSpecularGlossiness'
          )
        ) {
          const message = {
            title: 'Model Validation Failed',
            description:
              'Model uses unsupported KHR_materials_pbrSpecularGlossiness extension',
          };

          // Revoke the blob URL if validation fails
          if (result.blobUrl) {
            URL.revokeObjectURL(result.blobUrl);
          }

          setValidationError(message);
          setStatus('invalid');
          return;
        }

        if (Number(result.modelSize) > MODEL_MAX_SIZE) {
          const message = {
            title: 'File size Exceeds Limit',
            description: `Please upload a file smaller than ${Math.round(
              MODEL_MAX_SIZE / (1024 * 1024)
            )}MB`,
          };

          // Revoke the blob URL if validation fails
          if (result.blobUrl) {
            URL.revokeObjectURL(result.blobUrl);
          }

          setValidationError(message);
          setStatus('invalid');
          return;
        }

        // Store the cached blob URL for ValidatedModel to use
        setCachedBlobUrl(result.blobUrl);
        setStatus('loading');
      } catch (err) {
        if ((err as any)?.name === 'AbortError') {
          return;
        }
        setValidationError({
          title: 'Model Validation Failed',
          description:
            'Failed to validate model, Try again or try a different model',
        });
        setStatus('invalid');
      }
    }

    runValidation();

    return () => {
      mounted = false;
      controller.abort();
    };
  }, [url]);

  if (status === 'idle') {
    return null;
  }

  // Use the cached blob URL if available, otherwise fall back to original URL
  const modelUrl = cachedBlobUrl || url;

  return (
    <>
      {/* {(status === 'validating' || status === 'loading') && (
        <Html fullscreen>
          <div className="bg-neutral-gray-100 pointer-events-none absolute inset-0 flex items-center justify-center">
            <PillLoader description={description} className="justify-center" />
          </div>
        </Html>
      )} */}

      {(status === 'loading' || status === 'ready') && cachedBlobUrl && (
        <Suspense fallback={null}>
          <ValidatedModel
            url={modelUrl}
            settings={settings}
            onLoaded={() => {
              setStatus('ready');
              onLoaded?.();
            }}
            viewer={viewer}
            isImmersivePdpPresentation={isImmersivePdpPresentation}
          />
        </Suspense>
      )}
    </>
  );
});

export default Model;
