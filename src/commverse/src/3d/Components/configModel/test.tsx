import { useThree } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { configureKTX2Loader } from '../../Utils';
import { toRad } from '../../../constants';
import type { Vector3 } from '../../../types';
import { useModelStore } from '../../../lib/store';

interface IConfigModelProps {
  modelId: string;
  modelUrl: string;
  modelTransform: {
    scale: number;
    rotation: Vector3;
  };
  onCenterChange?: (modelId: string, center: Vector3) => void;
  onLoaded?: () => void;
}

function ConfigModel({
  modelId,
  modelUrl,
  modelTransform,
  onCenterChange,
  onLoaded,
}: IConfigModelProps) {
  const { setStatus } = useModelStore();
  const gl = useThree((state) => state.gl);
  const { scene } = useGLTF(modelUrl, true, true, (loader) =>
    configureKTX2Loader(loader, gl)
  );
  const groupRef = useRef<THREE.Group>(null);
  const initialScaleRef = useRef<number | null>(null);
  const [isModelReady, setIsModelReady] = useState(false);
  const hasCalculatedInitialScaleRef = useRef(false);

  //   Initial scale and center setup
  useLayoutEffect(() => {
    const group = groupRef.current;
    if (!group || hasCalculatedInitialScaleRef.current || !scene) return;

    // Use scene for measurement because group might be hidden
    const box = new THREE.Box3().setFromObject(scene);
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);

    // Only proceed if we have actual geometry
    if (maxDim > 0) {
      const MIN_SIZE = 1;
      const MAX_SIZE = 5;

      let scaleFactor = 1;
      if (maxDim > MAX_SIZE) {
        scaleFactor = MAX_SIZE / maxDim;
      } else if (maxDim < MIN_SIZE) {
        scaleFactor = MIN_SIZE / maxDim;
      }

      initialScaleRef.current = scaleFactor;

      // Calculate offset based on scene
      const center = box.getCenter(new THREE.Vector3());
      const bottom = box.min.y;
      const offset = new THREE.Vector3(center.x, bottom, center.z);

      // We still want to offset the group's children or the group itself
      // But we must be careful: if we want the group's origin to be the bottom center
      // and we move the group, we need to know what we are moving it relative to.
      // Usually we want the primitive (scene) to be offset within the group.

      scene.position.sub(offset);

      hasCalculatedInitialScaleRef.current = true;
      setIsModelReady(true);
      setStatus('ready');
    }
  }, [scene]);

  // Fallback to regular effect in case layoutEffect timing is an issue
  useEffect(() => {
    const group = groupRef.current;
    if (!group || hasCalculatedInitialScaleRef.current || !scene) return;

    // Use a frame to ensure geometry is available
    const checkGeometry = () => {
      const box = new THREE.Box3().setFromObject(scene);
      const size = box.getSize(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z);

      if (maxDim > 0) {
        const MIN_SIZE = 1;
        const MAX_SIZE = 5;

        let scaleFactor = 1;
        if (maxDim > MAX_SIZE) {
          scaleFactor = MAX_SIZE / maxDim;
        } else if (maxDim < MIN_SIZE) {
          scaleFactor = MIN_SIZE / maxDim;
        }

        initialScaleRef.current = scaleFactor;

        const center = box.getCenter(new THREE.Vector3());
        const bottom = box.min.y;
        const offset = new THREE.Vector3(center.x, bottom, center.z);
        scene.position.sub(offset);

        hasCalculatedInitialScaleRef.current = true;
        setIsModelReady(true);
      } else {
        // Retry next frame
        requestAnimationFrame(checkGeometry);
      }
    };

    requestAnimationFrame(checkGeometry);
  }, [scene]);

  //   Model transforms
  useEffect(() => {
    const group = groupRef.current;
    if (!group || initialScaleRef.current === null) return;

    const { scale, rotation } = modelTransform;

    group.scale.setScalar(initialScaleRef.current * scale);
    group.rotation.set(toRad(rotation.x), toRad(rotation.y), toRad(rotation.z));

    group.updateMatrixWorld(true);

    // The model is already centered via scene.position in the setup effect
    // We just need to report the center back
    const box = new THREE.Box3().setFromObject(group);
    onCenterChange?.(modelId, box.getCenter(new THREE.Vector3()));
  }, [modelId, modelTransform, onCenterChange]);

  //  Notify parent when model is loaded
  useEffect(() => {
    if (isModelReady && onLoaded) {
      setStatus('ready');
      onLoaded();
    }
  }, [isModelReady]);

  //  Cleanup on unmount
  useEffect(() => {
    return () => {
      if (!scene) return;
      scene.traverse((child: THREE.Object3D) => {
        if ((child as THREE.Mesh).geometry) {
          (child as THREE.Mesh).geometry.dispose();
        }
        if ((child as THREE.Mesh).material) {
          const material = (child as THREE.Mesh).material;
          if (Array.isArray(material)) {
            material.forEach((mat) => mat.dispose());
          } else {
            material.dispose();
          }
        }
      });
    };
  }, [scene]);

  return (
    <group ref={groupRef} dispose={null}>
      <primitive object={scene} />
    </group>
  );
}

export default ConfigModel;
