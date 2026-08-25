import { validateBytes } from '@dcl/gltf-validator-ts';

import * as THREE from 'three';
import { KTX2Loader, DRACOLoader, GLTFLoader } from 'three-stdlib';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';

const inFlightModelFetches = new Map<
  string,
  Promise<{ assetData: ArrayBuffer; contentType: string }>
>();

function createAbortError() {
  return new DOMException('The operation was aborted.', 'AbortError');
}

function awaitWithAbort<T>(promise: Promise<T>, signal?: AbortSignal) {
  if (!signal) return promise;
  if (signal.aborted) return Promise.reject(createAbortError());

  return new Promise<T>((resolve, reject) => {
    const onAbort = () => reject(createAbortError());
    signal.addEventListener('abort', onAbort, { once: true });

    promise
      .then((value) => {
        signal.removeEventListener('abort', onAbort);
        resolve(value);
      })
      .catch((error) => {
        signal.removeEventListener('abort', onAbort);
        reject(error);
      });
  });
}

function fetchModelAsset(url: string) {
  const existingRequest = inFlightModelFetches.get(url);
  if (existingRequest) {
    return existingRequest;
  }

  const request = (async () => {
    const response = await fetch(url);
    const assetData = await response.arrayBuffer();
    const contentType =
      response.headers.get('content-type') || 'model/gltf-binary';

    return { assetData, contentType };
  })().finally(() => {
    inFlightModelFetches.delete(url);
  });

  inFlightModelFetches.set(url, request);
  return request;
}

export function configureKTX2Loader(
  loader: GLTFLoader,
  gl: THREE.WebGLRenderer
) {
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath(
    'https://www.gstatic.com/draco/versioned/decoders/1.5.5/'
  );
  loader.setDRACOLoader(dracoLoader);

  const ktx2Loader = new KTX2Loader();
  ktx2Loader.setTranscoderPath(
    'https://cdn.jsdelivr.net/gh/pmndrs/drei-assets@master/basis/'
  );
  ktx2Loader.detectSupport(gl);
  loader.setKTX2Loader(ktx2Loader);

  loader.setMeshoptDecoder(MeshoptDecoder);
}

/** Extract extensionsUsed / extensionsRequired from raw GLB or GLTF bytes. */
function extractExtensionsFromBytes(data: ArrayBuffer): {
  extensionsUsed?: string[];
  extensionsRequired?: string[];
} {
  try {
    const view = new DataView(data);
    // GLB magic: 0x46546C67 ("glTF")
    const isGLB = view.getUint32(0, true) === 0x46546c67;
    let jsonText: string;
    if (isGLB) {
      // GLB header: magic(4) + version(4) + length(4) + chunk0Length(4) + chunk0Type(4) = 20 bytes to JSON chunk data
      const chunkLength = view.getUint32(12, true);
      jsonText = new TextDecoder().decode(
        new Uint8Array(data, 20, chunkLength)
      );
    } else {
      jsonText = new TextDecoder().decode(new Uint8Array(data));
    }
    const gltf = JSON.parse(jsonText);
    return {
      extensionsUsed: gltf.extensionsUsed,
      extensionsRequired: gltf.extensionsRequired,
    };
  } catch {
    return {};
  }
}

export async function validateModel(
  url: string,
  options?: { signal?: AbortSignal }
) {
  try {
    const { assetData, contentType } = await awaitWithAbort(
      fetchModelAsset(url),
      options?.signal
    );
    const uint8ArrayData = new Uint8Array(assetData); // Fixed typo: unit8 -> uint8

    const report = await validateBytes(uint8ArrayData);
    const { extensionsUsed, extensionsRequired } =
      extractExtensionsFromBytes(assetData);

    const resources = report.info.resources ?? [];

    // Calculate geometry VRAM (buffers used for mesh data)
    const geometryVRAM = resources
      .filter((res) => res.pointer.includes('/buffers/'))
      .reduce((sum, res) => sum + (res.byteLength ?? 0), 0);

    // Calculate texture VRAM — new API has no image dimensions, so estimate
    // from byteLength with RGBA8 + mip multiplier (1.33)
    const IMAGE_MIME_TYPES = [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/ktx2',
    ];
    const textureVRAM = resources
      .filter((res) => IMAGE_MIME_TYPES.includes(res.mimeType))
      .reduce((sum, res) => sum + (res.byteLength ?? 0) * 1.33, 0);

    const totalVRAMBytes = geometryVRAM + textureVRAM;

    const totalMB = totalVRAMBytes / (1024 * 1024);
    if (totalMB > 500) {
      console.warn(
        `⚠️ High VRAM usage detected (${totalMB.toFixed(2)} MB). Consider optimizing.`
      );
    }

    // Create a blob URL from the fetched data to avoid re-fetching
    const blob = new Blob([assetData], { type: contentType });
    const blobUrl = URL.createObjectURL(blob);

    return {
      isValid: report.issues.numErrors === 0,
      extensionsUsed,
      extensionsRequired,
      modelSize: assetData.byteLength,
      blobUrl,
    };
  } catch (error) {
    console.error('Validation failed:', error);
    throw error;
  }
}

export function getBottomCenteredOffset(object: THREE.Object3D) {
  const box = new THREE.Box3().setFromObject(object);
  const center = box.getCenter(new THREE.Vector3());
  const bottom = box.min.y;
  return new THREE.Vector3(center.x, bottom, center.z);
}

export function getModelCenter(object: THREE.Object3D) {
  const box = new THREE.Box3().setFromObject(object);
  return box.getCenter(new THREE.Vector3());
}

export function calculateGeometryMemory(object: THREE.Object3D) {
  let total = 0;

  object.traverse((obj: any) => {
    if (obj.isMesh && obj.geometry) {
      const geometry = obj.geometry;

      for (const key in geometry.attributes) {
        const attr = geometry.attributes[key];
        total += attr.count * attr.itemSize * attr.array.BYTES_PER_ELEMENT;
      }

      if (geometry.index) {
        total +=
          geometry.index.count *
          geometry.index.itemSize *
          geometry.index.array.BYTES_PER_ELEMENT;
      }
    }
  });

  return total;
}

export function calculateTextureMemory(object: THREE.Object3D) {
  let total = 0;

  const uniqueTextures = new Set<THREE.Texture>();

  object.traverse((obj: any) => {
    if (!obj.isMesh || !obj.material) return;

    const materials = Array.isArray(obj.material)
      ? obj.material
      : [obj.material];

    materials.forEach((mat: any) => {
      for (const key in mat) {
        const value = mat[key];

        if (value && value.isTexture && value.image) {
          if (uniqueTextures.has(value)) return;

          uniqueTextures.add(value);

          const { width, height } = value.image;

          const bytesPerPixel = 4; // Assume RGBA8
          const mipMultiplier = 1.33;

          total += width * height * bytesPerPixel * mipMultiplier;
        }
      }
    });
  });

  return total;
}
