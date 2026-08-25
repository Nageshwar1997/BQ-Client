import { Suspense, memo, useCallback, useEffect, useState } from 'react';
import { useThree } from '@react-three/fiber';
import type { IConfigModel, VisualizerProps } from '../../../types';
import { Canvas } from '@react-three/fiber';
import CameraControls from '../CameraControls';
import ConfigModel from '../configModel';
import SceneEnvironement from '../Environment';
import { ContactShadows } from '@react-three/drei';
import PillLoader from '../../../components/PillLoader';
import { useModelStore } from '../../../lib/store';
import * as THREE from 'three';

interface IConfigCanvasProps {
  models: IConfigModel[];
  activeModelId: string | null;
  commonSettings: VisualizerProps;
}

// Inner component that uses the Canvas context
function CanvasContent({
  models,
  activeModelId,
  commonSettings,
  contextReady,
  setContextReady,
}: IConfigCanvasProps & {
  contextReady: boolean;
  setContextReady: (ready: boolean) => void;
}) {
  const [activeModelCenter, setActiveModelCenter] = useState<THREE.Vector3>(
    new THREE.Vector3(0, 0, 0)
  );
  const gl = useThree((state) => state.gl);

  useEffect(() => {
    const canvas = gl.domElement;

    const handleContextLost = (e: Event) => {
      e.preventDefault();
      console.warn('THREE.WebGLRenderer: Context Lost — will attempt restore.');
    };

    const handleContextRestored = () => {
      console.info('THREE.WebGLRenderer: Context Restored.');
      setContextReady(true);
    };

    canvas.addEventListener('webglcontextlost', handleContextLost, false);
    canvas.addEventListener(
      'webglcontextrestored',
      handleContextRestored,
      false
    );

    // Mark context as ready after a short delay to ensure GL is stable
    const timer = setTimeout(() => {
      setContextReady(true);
    }, 100);

    return () => {
      clearTimeout(timer);
      canvas.removeEventListener('webglcontextlost', handleContextLost);
      canvas.removeEventListener('webglcontextrestored', handleContextRestored);
    };
  }, [gl, setContextReady]);

  const handleCenterChange = useCallback(
    (modelId: string, center: THREE.Vector3) => {
      if (modelId === activeModelId) {
        setActiveModelCenter(center);
      }
    },
    [activeModelId]
  );

  return (
    <>
      <ambientLight intensity={1} />

      {/* Only render SceneEnvironment when context is ready and we have valid models */}
      {contextReady && models.length > 0 && (
        <Suspense fallback={null}>
          <SceneEnvironement envSettings={commonSettings.environment} />
        </Suspense>
      )}

      <ContactShadows
        position={[0, 0, 0]}
        opacity={commonSettings.shadowIntensity}
        scale={15 * commonSettings.modelTransform.scale}
        blur={3}
        far={10}
        resolution={128}
      />
      <Suspense
        fallback={
          <></>
          // <Html center>
          //   <PillLoader />
          // </Html>
        }
      >
        {models.map((model) => (
          <group key={model.id} visible={model.id === activeModelId}>
            <ConfigModel
              modelId={model.id}
              modelUrl={model.url}
              modelTransform={model.modelTransform}
              onCenterChange={handleCenterChange}
              commonSettings={commonSettings}
            />
          </group>
        ))}
      </Suspense>
      <CameraControls
        settings={commonSettings}
        modelCenter={activeModelCenter}
      />
    </>
  );
}

const ConfiguratorCanvas = ({
  models,
  activeModelId,
  commonSettings,
}: IConfigCanvasProps) => {
  const [contextReady, setContextReady] = useState(false);
  const { status } = useModelStore();

  const shouldShowLoader = status === 'loading';

  const backgroundColor = !commonSettings.environment.grounded
    ? commonSettings.environment.envBgColor
    : undefined;

  return (
    <div className="relative h-full w-full flex-1 overflow-hidden">
      {shouldShowLoader && (
        <div className="bg-neutral-gray-200 pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
          <PillLoader />
        </div>
      )}
      <Canvas
        camera={{
          fov: 45,
          position: [
            commonSettings.camera.position.x,
            commonSettings.camera.position.y,
            commonSettings.camera.position.z,
          ],
        }}
        gl={{
          preserveDrawingBuffer: true,
          powerPreference: 'high-performance',
          antialias: true,
          failIfMajorPerformanceCaveat: false,
          alpha: true,
        }}
        style={{ background: backgroundColor, width: '100%', height: '100%' }}
        className="rounded-xl"
      >
        <CanvasContent
          models={models}
          activeModelId={activeModelId}
          commonSettings={commonSettings}
          contextReady={contextReady}
          setContextReady={setContextReady}
        />
      </Canvas>
    </div>
  );
};

const areCanvasPropsEqual = (
  prev: IConfigCanvasProps,
  next: IConfigCanvasProps
) => {
  if (prev.activeModelId !== next.activeModelId) return false;

  if (prev.models.length !== next.models.length) return false;
  for (let i = 0; i < prev.models.length; i += 1) {
    const previousModel = prev.models[i];
    const nextModel = next.models[i];

    if (previousModel.id !== nextModel.id) return false;
    if (previousModel.url !== nextModel.url) return false;

    if (previousModel.modelTransform.scale !== nextModel.modelTransform.scale) {
      return false;
    }

    if (
      previousModel.modelTransform.rotation.x !==
        nextModel.modelTransform.rotation.x ||
      previousModel.modelTransform.rotation.y !==
        nextModel.modelTransform.rotation.y ||
      previousModel.modelTransform.rotation.z !==
        nextModel.modelTransform.rotation.z
    ) {
      return false;
    }
  }

  const prevSettings = prev.commonSettings;
  const nextSettings = next.commonSettings;

  if (
    prevSettings.camera.position.x !== nextSettings.camera.position.x ||
    prevSettings.camera.position.y !== nextSettings.camera.position.y ||
    prevSettings.camera.position.z !== nextSettings.camera.position.z
  ) {
    return false;
  }

  if (prevSettings.shadowIntensity !== nextSettings.shadowIntensity) {
    return false;
  }

  if (prevSettings.modelTransform.scale !== nextSettings.modelTransform.scale) {
    return false;
  }

  if (
    prevSettings.modelTransform.rotationAxis.x !==
      nextSettings.modelTransform.rotationAxis.x ||
    prevSettings.modelTransform.rotationAxis.y !==
      nextSettings.modelTransform.rotationAxis.y ||
    prevSettings.modelTransform.rotationAxis.z !==
      nextSettings.modelTransform.rotationAxis.z
  ) {
    return false;
  }

  if (
    prevSettings.zoom.min !== nextSettings.zoom.min ||
    prevSettings.zoom.max !== nextSettings.zoom.max
  ) {
    return false;
  }

  if (
    prevSettings.environment.grounded !== nextSettings.environment.grounded ||
    prevSettings.environment.envBgColor !== nextSettings.environment.envBgColor
  ) {
    return false;
  }

  if (
    prevSettings.environment.presetName !==
      nextSettings.environment.presetName ||
    prevSettings.environment.envType !== nextSettings.environment.envType ||
    prevSettings.environment.customEnvUrl !==
      nextSettings.environment.customEnvUrl ||
    prevSettings.environment.lightIntensity !==
      nextSettings.environment.lightIntensity ||
    prevSettings.environment.envHeight !== nextSettings.environment.envHeight ||
    prevSettings.environment.envRadius !== nextSettings.environment.envRadius ||
    prevSettings.environment.envScale !== nextSettings.environment.envScale
  ) {
    return false;
  }

  return true;
};

export default memo(ConfiguratorCanvas, areCanvasPropsEqual);
