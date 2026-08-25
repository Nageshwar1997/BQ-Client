import '@google/model-viewer';
import type { ModelViewerElement } from '@google/model-viewer';
import type { VisualizerProps } from '../../../types';
import { useEffect, useMemo, useRef, useState } from 'react';
import { ENV_PRESETS, MODEL_MAX_SIZE } from '../../../constants';
import { validateModel } from '../../Utils';
import { useModelStore } from '../../../lib/store';
import type { ValidationError } from '../../../lib/store/modelStore';

interface GModelViewerProps {
  modelUrl: string;
  settings: VisualizerProps;
  className?: string;
}

class ModelValidationException extends Error {
  public readonly validationError: ValidationError;

  constructor(validationError: ValidationError) {
    super(validationError.description);
    this.name = 'ModelValidationException';
    this.validationError = validationError;
  }
}

const GModelViewer = ({ modelUrl, settings, className }: GModelViewerProps) => {
  const modelViewerRef = useRef<ModelViewerElement>(null);
  const activeBlobUrlRef = useRef<string | null>(null);
  const { setStatus, setValidationError } = useModelStore();
  const [validatedSrc, setValidatedSrc] = useState<string | null>(null);
  const [cameraTarget, setCameraTarget] = useState('0m 0m 0m');
  const [cameraOrbit, setCameraOrbit] = useState<string | undefined>(undefined);
  const [minOrbitDistance, setMinOrbitDistance] = useState<number | null>(null);
  const [maxOrbitDistance, setMaxOrbitDistance] = useState<number | null>(null);

  const {
    modelTransform,
    shadowIntensity,
    shadowSoftness,
    environment,
    zoom,
    arAnchor,
  } = settings;

  const envUrl = useMemo(() => {
    if (environment.envType === 'custom' && environment.customEnvUrl) {
      return environment.customEnvUrl.includes('#')
        ? environment.customEnvUrl
        : `${environment.customEnvUrl}#file.hdr`;
    }

    return ENV_PRESETS.find((preset) => preset.name === environment.presetName)
      ?.url;
  }, [environment.envType, environment.customEnvUrl, environment.presetName]);

  useEffect(() => {
    let mounted = true;
    const controller = new AbortController();

    setCameraTarget('0m 0m 0m');
    setCameraOrbit(undefined);
    setMinOrbitDistance(null);
    setMaxOrbitDistance(null);
    setValidatedSrc(null);
    setStatus('validating');
    setValidationError(null);

    const runValidation = async () => {
      try {
        const result = await validateModel(modelUrl, {
          signal: controller.signal,
        });

        if (!mounted) return;

        if (
          result.extensionsRequired?.includes(
            'KHR_materials_pbrSpecularGlossiness'
          )
        ) {
          if (result.blobUrl) {
            URL.revokeObjectURL(result.blobUrl);
          }
          throw new ModelValidationException({
            title: 'Model Validation Failed',
            description:
              'Model uses unsupported KHR_materials_pbrSpecularGlossiness extension',
          });
        }

        if (Number(result.modelSize) > MODEL_MAX_SIZE) {
          if (result.blobUrl) {
            URL.revokeObjectURL(result.blobUrl);
          }
          throw new ModelValidationException({
            title: 'File size Exceeds Limit',
            description: `Please upload a file smaller than ${Math.floor(MODEL_MAX_SIZE / (1024 * 1024))}MB.`,
          });
        }

        setStatus('loading');

        if (
          activeBlobUrlRef.current &&
          activeBlobUrlRef.current !== result.blobUrl
        ) {
          URL.revokeObjectURL(activeBlobUrlRef.current);
        }
        activeBlobUrlRef.current = result.blobUrl;
        setValidatedSrc(result.blobUrl);
      } catch (error: any) {
        if (!mounted) return;

        if (error?.name === 'AbortError') {
          return;
        }

        console.error('Model validation failed:', error);

        if (error instanceof ModelValidationException) {
          setValidationError(error.validationError);
        } else {
          setValidationError({
            title: 'Model Validation Failed',
            description:
              'Failed to validate model, Try again or try a different model',
          });
        }

        setStatus('invalid');
      }
    };

    runValidation();

    return () => {
      mounted = false;
      controller.abort();

      if (activeBlobUrlRef.current) {
        URL.revokeObjectURL(activeBlobUrlRef.current);
        activeBlobUrlRef.current = null;
      }
    };
  }, [modelUrl, setStatus, setValidationError]);

  useEffect(() => {
    const viewer = modelViewerRef.current as any;
    if (!viewer) return;

    const handleModelLoaded = () => {
      requestAnimationFrame(() => {
        const center = viewer.getBoundingBoxCenter?.();
        const dimensions = viewer.getDimensions?.();

        const centerX = Number(center?.x ?? 0);
        const centerY = Number(center?.y ?? 0);
        const centerZ = Number(center?.z ?? 0);
        const maxDim = Math.max(
          Number(dimensions?.x ?? 0),
          Number(dimensions?.y ?? 0),
          Number(dimensions?.z ?? 0)
        );

        const target = `${centerX.toFixed(4)}m ${centerY.toFixed(4)}m ${centerZ.toFixed(4)}m`;
        setCameraTarget(target);

        if (maxDim > 0) {
          const fitDistance = Math.max(1, maxDim * 1.8);
          const minDistance = Math.max(0.5, fitDistance * 0.6);
          const maxDistance = Math.max(minDistance + 0.5, fitDistance * 3);

          setCameraOrbit(`45deg 75deg ${fitDistance.toFixed(4)}m`);
          setMinOrbitDistance(minDistance);
          setMaxOrbitDistance(maxDistance);

          viewer.setAttribute('camera-target', target);
          viewer.setAttribute(
            'camera-orbit',
            `45deg 75deg ${fitDistance.toFixed(4)}m`
          );
          viewer.setAttribute(
            'min-camera-orbit',
            `auto 0deg ${minDistance.toFixed(4)}m`
          );
          viewer.setAttribute(
            'max-camera-orbit',
            `auto 90deg ${maxDistance.toFixed(4)}m`
          );
          viewer.updateFraming?.();
          viewer.jumpCameraToGoal?.();
        }

        setStatus('ready');
      });
    };

    const handleModelError = () => {
      setValidationError({
        title: 'Model Load Failed',
        description: 'Unable to load model. Please try a different file.',
      });
      setStatus('invalid');
    };

    viewer.addEventListener('load', handleModelLoaded);
    viewer.addEventListener('error', handleModelError);

    return () => {
      viewer.removeEventListener('load', handleModelLoaded);
      viewer.removeEventListener('error', handleModelError);
    };
  }, [modelUrl, setStatus, setValidationError]);

  return (
    // @ts-ignore - model-viewer has some issues with TypeScript typings, especially with custom attributes
    <model-viewer
      ref={modelViewerRef}
      src={validatedSrc ?? undefined}
      camera-controls
      camera-target={cameraTarget}
      camera-orbit={cameraOrbit}
      disable-pan
      ar
      ar-modes="webxr scene-viewer quick-look"
      ar-placement={arAnchor}
      ar-scale={modelTransform.scalable ? 'auto' : 'fixed'}
      interaction-prompt="none"
      interaction-policy={
        modelTransform.rotatable ? undefined : 'allow-when-focused'
      }
      scale={`${modelTransform.scale} ${modelTransform.scale} ${modelTransform.scale}`}
      orientation={`${modelTransform.rotation.x}deg ${modelTransform.rotation.y}deg ${modelTransform.rotation.z}deg`}
      environment-image={envUrl}
      environment-intensity={environment.lightIntensity}
      exposure={environment.lightIntensity}
      shadow-intensity={shadowIntensity}
      shadow-softness={shadowSoftness}
      min-camera-orbit={`auto 0deg ${(minOrbitDistance ?? zoom.min).toFixed(4)}m`}
      max-camera-orbit={`auto 90deg ${(maxOrbitDistance ?? zoom.max).toFixed(4)}m`}
      className={className}
    />
  );
};

export default GModelViewer;
