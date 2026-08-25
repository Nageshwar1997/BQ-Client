import { memo, useCallback, useEffect, useRef } from 'react';
import type { ICameraControlsProps } from '../../../types';
import { useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useVisualizerStore } from '../../../lib/store/visualizerStore';

const CameraControls = memo(
  ({
    settings,
    modelCenter,
    viewer = false,
    modelBoundingRadius = 1,
    isImmersivePdpPresentation = false,
  }: ICameraControlsProps) => {
    const controlsRef = useRef<any>(null);
    const { camera } = useThree();
    const setCameraControl = useVisualizerStore(
      (state) => state.setCameraControl
    );
    const cameraPositionRef = useRef(settings.camera.position);

    // Update camera position on change
    useEffect(() => {
      cameraPositionRef.current = settings.camera.position;
    }, [settings.camera.position]);

    const cameraSet = useCallback(() => {
      cameraPositionRef.current = {
        x: camera.position.x,
        y: camera.position.y,
        z: camera.position.z,
      };
    }, [camera]);

    const cameraPreview = useCallback(() => {
      camera.position.set(
        cameraPositionRef.current.x,
        cameraPositionRef.current.y,
        cameraPositionRef.current.z
      );
      controlsRef.current?.update();
    }, [camera]);

    useEffect(() => {
      setCameraControl({
        set: cameraSet,
        preview: cameraPreview,
        getCameraPosition: () => ({
          x: camera.position.x,
          y: camera.position.y,
          z: camera.position.z,
        }),
      });
      return () => setCameraControl(null);
    }, [cameraSet, cameraPreview, camera, setCameraControl]);

    // Update orbit target when model center changes
    useEffect(() => {
      const controls = controlsRef.current;
      if (!controls) return;

      controls.target.set(modelCenter.x, modelCenter.y, modelCenter.z);
      controls.update();
    }, [modelCenter]);

    const { rotationAxis } = settings.modelTransform;
    const { zoom } = settings;
    const enableRotate = rotationAxis.x || rotationAxis.y || rotationAxis.z;
    // When in viewer mode, set min distance to bounding sphere radius for close-up view
    const minDistance =
      viewer || isImmersivePdpPresentation
        ? modelBoundingRadius * 1.1
        : zoom.min;

    return (
      <OrbitControls
        ref={controlsRef}
        target={[modelCenter.x, modelCenter.y, modelCenter.z]}
        enableRotate={enableRotate || viewer}
        minPolarAngle={viewer ? 0 : rotationAxis.x ? 0 : Math.PI / 2}
        maxPolarAngle={
          viewer ? Math.PI : rotationAxis.x ? Math.PI / 2 : Math.PI / 2
        }
        minAzimuthAngle={viewer ? -Infinity : rotationAxis.y ? -Infinity : 0}
        maxAzimuthAngle={viewer ? Infinity : rotationAxis.y ? Infinity : 0}
        enablePan={false}
        enableDamping={true}
        enableZoom={!isImmersivePdpPresentation}
        dampingFactor={0.1}
        rotateSpeed={0.5}
        minDistance={minDistance}
        maxDistance={zoom.max}
      />
    );
  }
);

export default CameraControls;
