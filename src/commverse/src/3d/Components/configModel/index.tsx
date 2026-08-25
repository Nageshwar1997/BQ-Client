import { useFrame, useThree } from '@react-three/fiber';
import { Html, useGLTF } from '@react-three/drei';

import { useEffect, useLayoutEffect, useRef } from 'react';

import { configureKTX2Loader, getBottomCenteredOffset } from '../../Utils';
import { toRad } from '../../../constants';
import type { Vector3, VisualizerProps } from '../../../types';
import { useModelStore } from '../../../lib/store';
import * as THREE from 'three';
import PillLoader from '../../../components/PillLoader';

interface IConfigModelProps {
  modelId: string;
  modelUrl: string;
  modelTransform: {
    scale: number;
    rotation: Vector3;
  };
  commonSettings: VisualizerProps;
  onCenterChange?: (modelId: string, center: THREE.Vector3) => void;
  onLoaded?: () => void;
}

const MIN_SIZE = 1;
const MAX_SIZE = 5;

function ConfigModel({
  modelId,
  modelUrl,
  modelTransform,
  commonSettings,
  onCenterChange,
}: IConfigModelProps) {
  const { status, setStatus } = useModelStore();
  const gl = useThree((state) => state.gl);

  const { scene } = useGLTF(modelUrl, true, true, (loader) =>
    configureKTX2Loader(loader, gl)
  );

  const groupRef = useRef<THREE.Group>(null);
  const initialScaleRef = useRef<number | null>(null);
  const hasNormalizedRef = useRef(false);

  const { camera } = useThree();
  const cameraAnimationRef = useRef({ progress: 0, active: true });

  useFrame(() => {
    if (!cameraAnimationRef.current.active) return;

    const animRef = cameraAnimationRef.current;
    const duration = 1; // Animation duration in seconds
    const fps = 60;
    const increment = 1 / (duration * fps);

    animRef.progress = Math.min(animRef.progress + increment, 1);

    // Easing function (ease-out cubic)
    const easeProgress = 1 - Math.pow(1 - animRef.progress, 3);

    // Start from away from the camera position (negate y and z)
    const cameraTargetPos = commonSettings.camera.position;
    const startPos = new THREE.Vector3(
      cameraTargetPos.x,
      cameraTargetPos.y + 3,
      cameraTargetPos.z + 10
    );

    camera.position.lerpVectors(startPos, cameraTargetPos, easeProgress);

    if (animRef.progress >= 1) {
      animRef.active = false;
    }
  });

  //   Normalizing model on initial load (scale + bottom centering)
  useLayoutEffect(() => {
    const group = groupRef.current;
    if (!group || !scene || hasNormalizedRef.current) return;

    const box = new THREE.Box3().setFromObject(scene);
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);

    if (maxDim <= 0) return;

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

    const newBox = new THREE.Box3().setFromObject(scene);
    onCenterChange?.(modelId, newBox.getCenter(new THREE.Vector3()));

    hasNormalizedRef.current = true;

    setStatus('ready');
  }, [scene]);

  //   Apply transform updates
  useEffect(() => {
    const group = groupRef.current;
    if (!group || initialScaleRef.current === null) return;

    const { scale, rotation } = modelTransform;

    group.scale.setScalar(initialScaleRef.current * scale);

    group.rotation.set(toRad(rotation.x), toRad(rotation.y), toRad(rotation.z));

    const offset = getBottomCenteredOffset(group);
    group.position.sub(offset);

    group.updateMatrixWorld(true);

    const box = new THREE.Box3().setFromObject(group);
    onCenterChange?.(modelId, box.getCenter(new THREE.Vector3()));
  }, [modelId, modelTransform, onCenterChange]);

  // Cleanup
  useEffect(() => {
    return () => {
      scene?.traverse((child: THREE.Object3D) => {
        const mesh = child as THREE.Mesh;

        mesh.geometry?.dispose();

        if (mesh.material) {
          if (Array.isArray(mesh.material)) {
            mesh.material.forEach((m) => m.dispose());
          } else {
            mesh.material.dispose();
          }
        }
      });
    };
  }, [scene]);

  return (
    <>
      {status != 'ready' && (
        <Html>
          <PillLoader />
        </Html>
      )}
      <group ref={groupRef} dispose={null}>
        <primitive object={scene} />
      </group>
    </>
  );
}

export default ConfigModel;
