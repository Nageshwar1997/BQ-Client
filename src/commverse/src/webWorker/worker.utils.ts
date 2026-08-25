import * as THREE from 'three';
import {
  DRACOLoader,
  GLTFLoader,
  KTX2Loader,
} from 'three/examples/jsm/Addons.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';

export class ImagePolyfill {
  src: string = '';
  onload: (() => void) | null = null;
  onerror: ((error: any) => void) | null = null;
  width: number = 0;
  height: number = 0;
  data: ImageBitmap | null = null;
  naturalWidth: number = 0;
  naturalHeight: number = 0;
  complete: boolean = false;

  private loadImage(url: string) {
    // Handle data URLs directly
    if (url.startsWith('data:')) {
      this.loadFromDataUrl(url);
      return;
    }

    fetch(url)
      .then((res) => {
        if (!res.ok)
          throw new Error(`Failed to fetch image: ${res.statusText}`);
        return res.blob();
      })
      .then((blob) => this.decodeImageBlob(blob))
      .catch((err) => {
        console.error(`Failed to load image from ${url}:`, err);
        if (this.onerror) {
          try {
            this.onerror(err);
          } catch (cbErr) {
            console.error('Error in image onerror callback:', cbErr);
          }
        }
      });
  }

  private loadFromDataUrl(dataUrl: string) {
    // Convert data URL to blob
    const arr = dataUrl.split(',');
    const mime = arr[0].match(/:([^;]+)/)?.[1] || 'image/png';
    const bstr = atob(arr[1]);
    const n = bstr.length;
    const u8arr = new Uint8Array(n);
    for (let i = 0; i < n; i++) {
      u8arr[i] = bstr.charCodeAt(i);
    }
    this.decodeImageBlob(new Blob([u8arr], { type: mime }));
  }

  private decodeImageBlob(blob: Blob) {
    createImageBitmap(blob, { imageOrientation: 'flipY' })
      .then((bitmap) => this.onImageBitmapReady(bitmap))
      .catch((err) => {
        console.warn(
          'createImageBitmap failed, attempting canvas fallback:',
          err
        );
        // Fallback: image couldn't be decoded, but we'll continue anyway
        // Set minimal dimensions
        this.width = 1;
        this.height = 1;
        this.naturalWidth = 1;
        this.naturalHeight = 1;
        this.complete = true;
        if (this.onload) this.onload();
      });
  }

  private onImageBitmapReady(bitmap: ImageBitmap) {
    this.width = bitmap.width;
    this.height = bitmap.height;
    this.naturalWidth = bitmap.width;
    this.naturalHeight = bitmap.height;
    this.data = bitmap;
    this.complete = true;

    Object.assign(this, {
      width: bitmap.width,
      height: bitmap.height,
      naturalWidth: bitmap.width,
      naturalHeight: bitmap.height,
      _bitmap: bitmap,
    });

    if (this.onload) {
      try {
        this.onload();
      } catch (err) {
        console.error('Error in image onload callback:', err);
      }
    }
  }

  set srcSetter(url: string) {
    this.complete = false;
    this.loadImage(url);
  }
}

function disposeMaterial(mat: THREE.Material | THREE.Material[]) {
  Array.isArray(mat) ? mat.forEach((m) => m.dispose()) : mat.dispose();
}

function disposeScene(root: THREE.Object3D) {
  root.traverse((child) => {
    const mesh = child as THREE.Mesh;
    if (mesh.isMesh) {
      mesh.geometry?.dispose();
      if (mesh.material)
        disposeMaterial(mesh.material as THREE.Material | THREE.Material[]);
    }
  });
}

function loadHdrFromBuffer(
  buffer: ArrayBuffer,
  renderer: THREE.WebGLRenderer
): Promise<THREE.Texture> {
  return new Promise(async (resolve, reject) => {
    try {
      const blob = new Blob([buffer], { type: 'image/jpeg' });

      // Create ImageBitmap (works in Web Workers)
      const imageBitmap = await createImageBitmap(blob);

      // Create a canvas to get pixel data
      const canvas = new OffscreenCanvas(imageBitmap.width, imageBitmap.height);
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        throw new Error('Failed to get 2D context');
      }

      // Draw image to canvas
      ctx.drawImage(imageBitmap, 0, 0);

      // Get image data
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

      // Create DataTexture from image data
      const texture = new THREE.DataTexture(
        imageData.data,
        canvas.width,
        canvas.height,
        THREE.RGBAFormat,
        THREE.UnsignedByteType
      );
      texture.needsUpdate = true;

      // Generate environment map using PMREM
      const pmrem = new THREE.PMREMGenerator(renderer);
      pmrem.compileEquirectangularShader();
      const envMap = pmrem.fromEquirectangular(texture).texture;

      // Cleanup
      texture.dispose();
      pmrem.dispose();
      imageBitmap.close();

      resolve(envMap);
    } catch (err) {
      reject(err);
    }
  });
}

function modelLoader(
  renderer: THREE.WebGLRenderer,
  dracoDecoderPath: string,
  basisTranscoderPath: string
): GLTFLoader {
  const gltfLoader = new GLTFLoader();

  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath(dracoDecoderPath);
  dracoLoader.preload();
  gltfLoader.setDRACOLoader(dracoLoader);
  gltfLoader.setMeshoptDecoder(MeshoptDecoder);

  try {
    const ktx2Loader = new KTX2Loader();
    ktx2Loader.setTranscoderPath(basisTranscoderPath);

    try {
      ktx2Loader.detectSupport(renderer);
      gltfLoader.setKTX2Loader(ktx2Loader);
    } catch (detectErr) {
      console.warn('KTX2 detection failed, continuing without it:', detectErr);
    }
  } catch (err) {
    console.warn('KTX2Loader initialization failed:', err);
  }

  return gltfLoader;
}

function loadGltfFromBuffer(
  buffer: ArrayBuffer,
  loader: GLTFLoader
): Promise<THREE.Group> {
  return new Promise((resolve, reject) => {
    const timeoutMs = 15000;
    const timeoutId = self.setTimeout(() => {
      reject(
        new Error(
          `GLTF parse timed out after ${timeoutMs}ms. This usually means a texture or extension decode stalled inside the worker.`
        )
      );
    }, timeoutMs);

    loader.parse(
      buffer,
      '',
      (gltf) => {
        self.clearTimeout(timeoutId);
        resolve(gltf.scene ?? gltf.scenes[0]);
      },
      (error) => {
        self.clearTimeout(timeoutId);
        console.error('GLTF parse error:', error);
        reject(error);
      }
    );
  });
}

function centerModel(model: THREE.Object3D, pivot: THREE.Group): THREE.Box3 {
  pivot.updateWorldMatrix(true, true);
  const box = new THREE.Box3().setFromObject(pivot);
  if (box.isEmpty()) return box;

  const center = box.getCenter(new THREE.Vector3());
  const localCenter = pivot.worldToLocal(center.clone());
  model.position.sub(localCenter);

  pivot.updateWorldMatrix(true, true);
  return new THREE.Box3().setFromObject(pivot);
}

function fitCamera(
  camera: THREE.PerspectiveCamera,
  box: THREE.Box3,
  padding = 1.25
) {
  if (box.isEmpty()) return;

  const sphere = box.getBoundingSphere(new THREE.Sphere());
  const r = sphere.radius;

  const vFov = THREE.MathUtils.degToRad(camera.fov);
  const hFov = 2 * Math.atan(Math.tan(vFov / 2) * camera.aspect);

  const distForV = r / Math.sin(vFov / 2);
  const distForH = r / Math.sin(hFov / 2);
  const distance = padding * Math.max(distForV, distForH);

  camera.position.set(
    sphere.center.x,
    sphere.center.y + r * 0.3,
    sphere.center.z + distance
  );
  camera.near = Math.max(distance / 1000, 0.0001);
  camera.far = distance * 100;
  camera.updateProjectionMatrix();
  camera.lookAt(sphere.center);
}

const DEFAULTS = {
  frameCount: 15,
  width: 512,
  height: 512,
  thumbnailWidth: 128,
  thumbnailHeight: 128,
  backgroundColor: null,
  dracoDecoderPath: '/decoders/draco/',
  basisTranscoderPath: '/decoders/basis/',
};

export function initImagePolyfill() {
  // Define src as a property setter
  Object.defineProperty(ImagePolyfill.prototype, 'src', {
    set(url: string) {
      this.srcSetter = url;
    },
    get() {
      return '';
    },
  });

  // Set the global Image to our polyfill
  // @ts-ignore
  globalThis.Image = ImagePolyfill;

  // Also polyfill HTMLImageElement for compatibility
  // @ts-ignore
  globalThis.HTMLImageElement = ImagePolyfill;
}

export async function generateSpriteAndOrThumbnail(
  input: any,
  postProgress: (frame: number, total: number) => void,
  thumbnailOnly: boolean = false
) {
  const {
    frameCount,
    width,
    height,
    thumbnailWidth,
    thumbnailHeight,
    backgroundColor,
    dracoDecoderPath,
    basisTranscoderPath,
  } = {
    ...DEFAULTS,
    ...(input?.options ?? {}),
  };

  const offscreen = new OffscreenCanvas(width, height);
  const renderer = new THREE.WebGLRenderer({
    canvas: offscreen as unknown as HTMLCanvasElement,
    antialias: true,
    preserveDrawingBuffer: true,
    alpha: backgroundColor === null,
  });
  renderer.setSize(width, height, false); // false = don't update style (OffscreenCanvas has no style)
  renderer.setPixelRatio(1);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;
  backgroundColor === null
    ? renderer.setClearColor(0x000000, 0)
    : renderer.setClearColor(backgroundColor, 1);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);

  const gltfLoader = modelLoader(
    renderer,
    dracoDecoderPath,
    basisTranscoderPath
  );

  let envMap: THREE.Texture | null = null;
  try {
    envMap = await loadHdrFromBuffer(input.hdrBuffer, renderer);
    scene.environment = envMap;
    scene.environmentIntensity = 5;
  } catch (err) {
    console.error('Failed to load HDR:', err);
    renderer.dispose();
    throw err;
  }

  scene.add(new THREE.AmbientLight(0xffffff, 0.6));
  const dir = new THREE.DirectionalLight(0xffffff, 0.6);
  dir.position.set(5, 5, 5);
  scene.add(dir);

  let model: THREE.Group;
  try {
    model = await loadGltfFromBuffer(input.modelBuffer, gltfLoader);
  } catch (err) {
    console.error('Failed to load model:', err);
    envMap?.dispose();
    disposeScene(scene);
    renderer.dispose();
    throw err;
  }

  const pivot = new THREE.Group();
  pivot.add(model);
  scene.add(pivot);

  const box = centerModel(model, pivot);
  fitCamera(camera, box);

  const spriteCanvas = new OffscreenCanvas(width * frameCount, height);
  const spriteCtx = spriteCanvas.getContext('2d')!;
  const thumbCanvas = new OffscreenCanvas(thumbnailWidth, thumbnailHeight);
  const thumbCtx = thumbCanvas.getContext('2d')!;

  if (thumbnailOnly) {
    renderer.render(scene, camera);

    const bitmap = offscreen.transferToImageBitmap();
    thumbCtx.drawImage(bitmap, 0, 0, thumbnailWidth, thumbnailHeight);
    bitmap.close();

    const thumbnailBlob = await thumbCanvas.convertToBlob({
      type: 'image/webp',
      quality: 0.9,
    });
    postProgress(1, 1);

    // Clean up
    disposeScene(scene);
    envMap?.dispose();
    renderer.dispose();

    return { thumbnailBlob };
  } else {
    for (let i = 0; i < frameCount; i++) {
      pivot.rotation.y = (i / frameCount) * Math.PI * 2;
      renderer.render(scene, camera);

      const bitmap = offscreen.transferToImageBitmap();
      spriteCtx.drawImage(bitmap, i * width, 0, width, height);
      if (i === 0)
        thumbCtx.drawImage(bitmap, 0, 0, thumbnailWidth, thumbnailHeight);
      bitmap.close();
      postProgress(i + 1, frameCount);
    }

    const [spriteBlob, thumbnailBlob] = await Promise.all([
      spriteCanvas.convertToBlob({ type: 'image/webp', quality: 0.9 }),
      thumbCanvas.convertToBlob({ type: 'image/webp', quality: 0.9 }),
    ]);

    disposeScene(scene);
    envMap?.dispose();
    renderer.dispose();

    return { spriteBlob, thumbnailBlob };
  }
}
