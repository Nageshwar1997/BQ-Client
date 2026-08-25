import * as THREE from 'three';
import { ContactShadows, useGLTF } from '@react-three/drei';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import type { GLTF } from 'three-stdlib';

import { toRad } from '../../../constants';
import type { IValidatedModelProps } from '../../../types';
import {
  getBottomCenteredOffset,
  getModelCenter,
  configureKTX2Loader,
} from '../../Utils';

import CameraControls from '../CameraControls';
import SceneEnvironement from '../Environment';

const MIN_SIZE = 1;
const MAX_SIZE = 5;

function ValidatedModel({
  url,
  settings,
  onLoaded,
  viewer = false,
  isImmersivePdpPresentation = false,
}: IValidatedModelProps) {
  const gl = useThree((state) => state.gl);
  const { camera } = useThree();
  const { scene } = useGLTF(url, true, true, (loader: any) => {
    configureKTX2Loader(loader, gl);
  }) as GLTF;

  const groupRef = useRef<THREE.Group>(null);
  const cameraAnimationRef = useRef({ progress: 0, active: true });

  const [modelCenter, setModelCenter] = useState(new THREE.Vector3(0, 0, 0));
  const [boundingRadius, setBoundingRadius] = useState<number>(1);
  const initialScaleRef = useRef<number | null>(null);
  const hasNormalizedRef = useRef(false);

  const [isModelReady, setIsModelReady] = useState(false);

  // Camera animation on load
  useFrame(() => {
    if (!cameraAnimationRef.current.active) return;

    const animRef = cameraAnimationRef.current;
    const duration = 1; // Animation duration in seconds
    const fps = 60;
    const increment = 1 / (duration * fps);

    animRef.progress = Math.min(animRef.progress + increment, 1);

    // Easing function (ease-out cubic)
    const easeProgress = 1 - Math.pow(1 - animRef.progress, 3);

    const cameraTargetPos =
      viewer || isImmersivePdpPresentation
        ? new THREE.Vector3(1, boundingRadius * 0.8, boundingRadius * 2)
        : settings.camera.position;

    // Start from away from the camera position (negate y and z)
    // const cameraTargetPos = settings.camera.position;
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

  // Calculate initial scale and position only once when model loads
  useLayoutEffect(() => {
    const group = groupRef.current;
    if (!group || hasNormalizedRef.current) return;

    const box = new THREE.Box3().setFromObject(group);
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

    const offset = getBottomCenteredOffset(group);
    group.position.copy(group.position.clone().sub(offset));

    hasNormalizedRef.current = true;
    group.position.sub(offset);

    // Calculate bounding sphere for camera min distance
    group.updateMatrixWorld(true);
    const boundingSphere = new THREE.Sphere();
    box.getBoundingSphere(boundingSphere);
    setBoundingRadius(boundingSphere.radius * scaleFactor);

    // change camera position to be closer to the model based on bounding radius

    setIsModelReady(true);
    onLoaded?.();
  }, [scene]);

  useEffect(() => {
    const group = groupRef.current;
    if (!group || initialScaleRef.current === null) return;

    const { rotation, scale } = settings.modelTransform;

    group.rotation.set(toRad(rotation.x), toRad(rotation.y), toRad(rotation.z));

    group.scale.setScalar(scale * initialScaleRef.current);
    group.updateMatrixWorld(true);
    const offset = getBottomCenteredOffset(group);
    group.position.sub(offset);

    // Update bounding sphere when transform changes
    const box = new THREE.Box3().setFromObject(group);
    const boundingSphere = new THREE.Sphere();
    box.getBoundingSphere(boundingSphere);
    setBoundingRadius(boundingSphere.radius);

    setModelCenter(getModelCenter(group));
  }, [
    settings.modelTransform.scale,
    settings.modelTransform.rotation.x,
    settings.modelTransform.rotation.y,
    settings.modelTransform.rotation.z,
  ]);

  // Clean up GLTF resources on unmount
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

  // Render
  return (
    <>
      <group ref={groupRef} visible={isModelReady}>
        <primitive object={scene} />
      </group>

      <ContactShadows
        visible={!viewer}
        position={[0, 0, 0]}
        opacity={settings.shadowIntensity}
        scale={15 * settings.modelTransform.scale}
        blur={3}
        far={10}
        resolution={128}
      />

      <ambientLight intensity={viewer || isImmersivePdpPresentation ? 4 : 1} />
      <directionalLight position={[8, 6, 5]} intensity={1.2} color="#ffffff" />
      <directionalLight position={[-6, 4, 3]} intensity={0.6} color="#ffffff" />
      <directionalLight position={[0, 5, -8]} intensity={0.8} color="#ffffff" />
      <CameraControls
        settings={settings}
        modelCenter={modelCenter}
        viewer={viewer}
        modelBoundingRadius={boundingRadius}
        isImmersivePdpPresentation={isImmersivePdpPresentation}
      />
      <SceneEnvironement envSettings={settings.environment} />
    </>
  );
}

export default ValidatedModel;
