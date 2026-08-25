import { Canvas } from '@react-three/fiber';
import { memo, useCallback, useEffect, useState } from 'react';
import Model from '../../../3d/Components/Model';
import type { VisualizerProps } from '../../../types';
import PillLoader from '../../../components/PillLoader';

interface Canvas3DProps {
  settings: VisualizerProps;
  modelUrl: string;
  description?: string;
  viewer?: boolean;
  onModelLoaded?: () => void;
  presentation?: 'default' | 'immersive-pdp';
}

const Canvas3D = memo(function Canvas3D({
  settings,
  modelUrl,
  description,
  viewer = false,
  onModelLoaded,
  presentation = 'default',
}: Canvas3DProps) {
  const [isLoading, setIsLoading] = useState(true);
  const isImmersivePdpPresentation = presentation === 'immersive-pdp';
  const backgroundColor = isImmersivePdpPresentation
    ? 'transparent'
    : !settings.environment.grounded
      ? settings.environment.envBgColor
      : undefined;

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsLoading(true);
  }, [modelUrl]);

  const handleCreated = useCallback(
    ({
      gl,
    }: {
      gl: {
        domElement: HTMLCanvasElement;
        setClearAlpha: (alpha: number) => void;
        setClearColor: (color: string, alpha?: number) => void;
      };
    }) => {
      const canvas = gl.domElement;

      if (isImmersivePdpPresentation) {
        gl.setClearColor('#FFFFFF', 0);
        gl.setClearAlpha(0);
        canvas.style.backgroundColor = 'transparent';
      }

      const handleContextLost = (e: Event) => {
        e.preventDefault();
        console.warn(
          'THREE.WebGLRenderer: Context Lost — will attempt restore.'
        );
      };
      const handleContextRestored = () => {
        console.info('THREE.WebGLRenderer: Context Restored.');
      };
      canvas.addEventListener('webglcontextlost', handleContextLost);
      canvas.addEventListener('webglcontextrestored', handleContextRestored);

      return () => {
        canvas.removeEventListener('webglcontextlost', handleContextLost);
        canvas.removeEventListener(
          'webglcontextrestored',
          handleContextRestored
        );
      };
    },
    [isImmersivePdpPresentation]
  );

  const handleModelLoaded = useCallback(() => {
    setIsLoading(false);
    onModelLoaded?.();
  }, [onModelLoaded]);

  const handleModelError = useCallback(() => {
    setIsLoading(false);
  }, []);

  return (
    <div
      className={
        isImmersivePdpPresentation
          ? 'relative h-full w-full flex-1 overflow-hidden bg-white'
          : 'border-neutral-gray-300 relative h-full w-full flex-1 overflow-hidden rounded-3xl border-2'
      }
    >
      {isImmersivePdpPresentation ? (
        <>
          <img
            src="/assets/icons/canvas-ellipse.svg"
            className="pointer-events-none absolute right-0 bottom-0 left-0 w-full object-contain object-bottom opacity-50"
            alt=""
          />
        </>
      ) : null}
      {isLoading && (
        <div
          className={`absolute inset-0 z-50 flex items-center justify-center ${
            isImmersivePdpPresentation ? 'bg-white/80' : 'bg-neutral-gray-100'
          }`}
        >
          <PillLoader
            description={description || 'Loading model, please wait...'}
            className="justify-center"
          />
        </div>
      )}
      <Canvas
        dpr={window.devicePixelRatio || 1}
        camera={{
          fov: 45,
          position: [
            settings.camera.position.x,
            settings.camera.position.y,
            settings.camera.position.z,
          ],
        }}
        shadows
        gl={{
          preserveDrawingBuffer: true,
          powerPreference: 'high-performance',
          antialias: true,
          failIfMajorPerformanceCaveat: false,
          // alpha: isImmersivePdpPresentation,
        }}
        onCreated={handleCreated}
        style={{
          background: backgroundColor,
          width: '100%',
          height: '100%',
        }}
        className={`${isImmersivePdpPresentation ? 'relative z-10' : 'rounded-xl'} [&_canvas]:h-full! [&_canvas]:w-full!`}
      >
        <Model
          url={modelUrl}
          settings={settings}
          description={description}
          viewer={viewer}
          onLoaded={handleModelLoaded}
          onError={handleModelError}
          isImmersivePdpPresentation={isImmersivePdpPresentation}
        />
      </Canvas>
    </div>
  );
});

export default Canvas3D;
