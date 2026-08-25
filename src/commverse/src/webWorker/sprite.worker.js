import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

const DEFAULT_CONFIG = {
  frameCount: 40,
  width: 400,
  height: 200,
  thumbnailWidth: 400,
  thumbnailHeight: 200,
  backgroundColor: null,
  webpQuality: 0.9,
};

const disposeMaterial = (material) => {
  if (!material) return;
  if (Array.isArray(material)) {
    material.forEach((m) => m.dispose());
  } else {
    material.dispose();
  }
};

const disposeScene = (scene) => {
  scene.traverse((child) => {
    if (child.isMesh) {
      if (child.geometry) child.geometry.dispose();
      disposeMaterial(child.material);
    }
  });
};

const loadGLTF = (url) =>
  new Promise((resolve, reject) => {
    const loader = new GLTFLoader();
    loader.load(url, resolve, undefined, reject);
  });

const centerModel = (object) => {
  const box = new THREE.Box3().setFromObject(object);
  const center = box.getCenter(new THREE.Vector3());
  object.position.sub(center);
  return box;
};

const fitCamera = (camera, box) => {
  const size = box.getSize(new THREE.Vector3());
  const maxDim = Math.max(size.x, size.y, size.z) || 1;
  const distance = maxDim * 2.2;

  camera.position.set(0, maxDim * 0.2, distance);
  camera.lookAt(0, 0, 0);
  camera.updateProjectionMatrix();
};

self.onmessage = async (event) => {
  const { modelUrl, config = {} } = event.data;
  const options = { ...DEFAULT_CONFIG, ...config };

  try {
    const {
      frameCount,
      width,
      height,
      thumbnailWidth,
      thumbnailHeight,
      backgroundColor,
      webpQuality,
    } = options;

    // 🔹 OffscreenCanvas (true background rendering)
    const canvas = new OffscreenCanvas(width, height);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      preserveDrawingBuffer: true,
      alpha: backgroundColor === null,
    });

    renderer.setSize(width, height);
    renderer.setPixelRatio(1);

    if (backgroundColor !== null) {
      renderer.setClearColor(backgroundColor, 1);
    } else {
      renderer.setClearColor(0x000000, 0);
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45,
      width / height,
      0.1,
      1000
    );

    const ambient = new THREE.AmbientLight(0xffffff, 1.0);
    const directional = new THREE.DirectionalLight(0xffffff, 0.6);
    directional.position.set(5, 5, 5);

    scene.add(ambient, directional);

    const gltf = await loadGLTF(modelUrl);
    const model = gltf.scene || gltf.scenes?.[0];

    if (!model) throw new Error("Model scene not found");

    scene.add(model);

    const box = centerModel(model);
    fitCamera(camera, box);

    // Sprite sheet canvas
    const spriteCanvas = new OffscreenCanvas(
      width * frameCount,
      height
    );
    const spriteCtx = spriteCanvas.getContext("2d");

    // Thumbnail canvas
    const thumbCanvas = new OffscreenCanvas(
      thumbnailWidth,
      thumbnailHeight
    );
    const thumbCtx = thumbCanvas.getContext("2d");

    for (let i = 0; i < frameCount; i++) {
      const angle = (i / frameCount) * Math.PI * 2;
      model.rotation.y = angle;

      renderer.render(scene, camera);

      spriteCtx.drawImage(
        canvas,
        i * width,
        0,
        width,
        height
      );

      if (i === 0) {
        thumbCtx.drawImage(
          canvas,
          0,
          0,
          thumbnailWidth,
          thumbnailHeight
        );
      }
    }

    const spriteBlob = await spriteCanvas.convertToBlob({
      type: "image/webp",
      quality: webpQuality,
    });

    const thumbnailBlob = await thumbCanvas.convertToBlob({
      type: "image/webp",
      quality: webpQuality,
    });

    disposeScene(scene);
    renderer.dispose();

    // 🚀 Transfer blobs (zero copy)
    self.postMessage(
      { spriteBlob, thumbnailBlob },
      [spriteBlob, thumbnailBlob]
    );
  } catch (error) {
    self.postMessage({ error: error.message });
  }
};