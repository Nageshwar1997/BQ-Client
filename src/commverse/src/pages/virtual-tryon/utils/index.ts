import {
  FaceLandmarker,
  FilesetResolver,
  type NormalizedLandmark,
} from '@mediapipe/tasks-vision';
import {
  COMPOSITE_OPERATION,
  LOWER_LIP_DOT_BLUR_AMOUNT,
  LOWER_LIP_INDICES,
  LOWER_WHITE_LIP_INDICESFSET,
  UPPER_LIP_INDICES,
  UPPER_WHITE_LIP_INDICESFSET,
  GLOSSY_TEXTURE_PATHL,
  GLOSSY_TEXTURE_PATHU,
  CRAYON_TEXTURE_PATHL,
  CRAYON_TEXTURE_PATHU,
  SHIMMER_TEXTURE_PATHL,
  SHIMMER_TEXTURE_PATHU,
  pattern_1_indices,
  pattern_2_indices,
  pattern_3_indices,
  pattern_4_thick_indices,
  pattern_4_thin_indices,
} from '../data';
import type {
  ColorTuple,
  Vector2,
  TEyeliner,
  TEyeIndicesPoints,
  TTryOnForm,
  FilterOption,
  TKajal,
  TTryOn,
  TLip,
} from '../../../types';
import { POSSIBLE_TRYON_TYPES } from '../../../constants';
import { VITE_S3_BASE_URL } from '../../../env';

type Color = string;

// Keep the CDN runtime pinned to the installed package version.
// An unversioned WASM URL can let the browser cache mismatched JS/WASM assets,
// which causes runtime failures like `ASM_CONSTS[code] is not a function`.
// 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/wasm'
const MEDIAPIPE_TASKS_VISION_VERSION = '0.10.32';
const MEDIAPIPE_WASM_BASE_URL = `https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@${MEDIAPIPE_TASKS_VISION_VERSION}/wasm`;

// This function for glossy lips
export function applyTextureOnLips(
  faceLandmarks: NormalizedLandmark[],
  canvasCtx: CanvasRenderingContext2D,
  lipColor: Color,
  lipTextureImageL: HTMLImageElement,
  lipTextureImageU: HTMLImageElement,
  dimension: { height: number; width: number },
  alphaValue: number
) {
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = dimension.width;
  tempCanvas.height = dimension.height;
  const tempCtx = tempCanvas.getContext('2d')!;

  drawUpperLip(
    tempCanvas,
    tempCtx,
    faceLandmarks,
    UPPER_LIP_INDICES,
    lipColor,
    lipTextureImageU,
    dimension,
    alphaValue
  );
  drawLowerLip(
    tempCanvas,
    tempCtx,
    faceLandmarks,
    LOWER_LIP_INDICES,
    lipColor,
    lipTextureImageL,
    dimension,
    alphaValue
  );

  canvasCtx.globalCompositeOperation = COMPOSITE_OPERATION;
  canvasCtx.drawImage(tempCanvas, 0, 0);

  const tempLowerLipDotCanvas = document.createElement('canvas');
  tempLowerLipDotCanvas.width = dimension.width;
  tempLowerLipDotCanvas.height = dimension.height;
  const tempLowerLipDotCtx = tempLowerLipDotCanvas.getContext('2d')!;

  clipLipsOnFace(
    tempLowerLipDotCanvas,
    tempLowerLipDotCtx,
    faceLandmarks,
    LOWER_LIP_INDICES
  );
  tempLowerLipDotCtx.filter = `blur(${LOWER_LIP_DOT_BLUR_AMOUNT}px)`;

  const tempUpperLipDotCanvas = document.createElement('canvas');
  tempUpperLipDotCanvas.width = dimension.width;
  tempUpperLipDotCanvas.height = dimension.height;
  const tempUpperLipDotCtx = tempUpperLipDotCanvas.getContext('2d')!;

  clipLipsOnFace(
    tempUpperLipDotCanvas,
    tempUpperLipDotCtx,
    faceLandmarks,
    UPPER_LIP_INDICES
  );
  tempUpperLipDotCtx.filter = `blur(${LOWER_LIP_DOT_BLUR_AMOUNT}px)`;

  canvasCtx.globalAlpha = 0.8;
  canvasCtx.globalCompositeOperation = 'source-over';
  canvasCtx.drawImage(tempLowerLipDotCanvas, 0, 0);
  canvasCtx.drawImage(tempUpperLipDotCanvas, 0, 0);

  canvasCtx.globalCompositeOperation = 'source-over';
}

// This function for crayon lips
export function applyTextureOnLipsc(
  faceLandmarks: NormalizedLandmark[],
  canvasCtx: CanvasRenderingContext2D,
  lipColor: Color,
  lipTextureImageL: HTMLImageElement,
  lipTextureImageU: HTMLImageElement,
  dimension: { height: number; width: number },
  alphaValue: number
) {
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = dimension.width;
  tempCanvas.height = dimension.height;
  const tempCtx = tempCanvas.getContext('2d')!;

  drawUpperLipc(
    tempCanvas,
    tempCtx,
    faceLandmarks,
    UPPER_LIP_INDICES,
    lipColor,
    lipTextureImageU,
    alphaValue
  );
  drawLowerLipc(
    tempCanvas,
    tempCtx,
    faceLandmarks,
    LOWER_LIP_INDICES,
    lipColor,
    lipTextureImageL,
    alphaValue
  );

  canvasCtx.globalCompositeOperation = COMPOSITE_OPERATION;
  canvasCtx.drawImage(tempCanvas, 0, 0);

  const tempLowerLipDotCanvas = document.createElement('canvas');
  tempLowerLipDotCanvas.width = dimension.width;
  tempLowerLipDotCanvas.height = dimension.height;
  const tempLowerLipDotCtx = tempLowerLipDotCanvas.getContext('2d')!;

  clipLipsOnFace(
    tempLowerLipDotCanvas,
    tempLowerLipDotCtx,
    faceLandmarks,
    LOWER_LIP_INDICES
  );
  tempLowerLipDotCtx.filter = `blur(${LOWER_LIP_DOT_BLUR_AMOUNT}px)`;

  const tempUpperLipDotCanvas = document.createElement('canvas');
  tempUpperLipDotCanvas.width = dimension.width;
  tempUpperLipDotCanvas.height = dimension.height;
  const tempUpperLipDotCtx = tempUpperLipDotCanvas.getContext('2d')!;

  clipLipsOnFace(
    tempUpperLipDotCanvas,
    tempUpperLipDotCtx,
    faceLandmarks,
    UPPER_LIP_INDICES
  );
  tempUpperLipDotCtx.filter = `blur(${LOWER_LIP_DOT_BLUR_AMOUNT}px)`;

  canvasCtx.globalAlpha = 0.8;
  canvasCtx.globalCompositeOperation = 'source-over';
  canvasCtx.drawImage(tempLowerLipDotCanvas, 0, 0);
  canvasCtx.drawImage(tempUpperLipDotCanvas, 0, 0);

  canvasCtx.globalCompositeOperation = 'source-over';
}

// This function for Shimmer lips
export function applyTextureOnLipss(
  faceLandmarks: NormalizedLandmark[],
  canvasCtx: CanvasRenderingContext2D,
  lipColor: Color,
  lipTextureImageL: HTMLImageElement,
  lipTextureImageU: HTMLImageElement,
  dimension: { height: number; width: number },
  alphaValue: number
) {
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = dimension.width;
  tempCanvas.height = dimension.height;
  const tempCtx = tempCanvas.getContext('2d')!;

  drawUpperLips(
    tempCanvas,
    tempCtx,
    faceLandmarks,
    UPPER_LIP_INDICES,
    lipColor,
    lipTextureImageU,
    dimension,
    alphaValue
  );
  drawLowerLips(
    tempCanvas,
    tempCtx,
    faceLandmarks,
    LOWER_LIP_INDICES,
    lipColor,
    lipTextureImageL,
    dimension,
    alphaValue
  );

  canvasCtx.globalCompositeOperation = COMPOSITE_OPERATION;
  canvasCtx.drawImage(tempCanvas, 0, 0);

  const tempLowerLipDotCanvas = document.createElement('canvas');
  tempLowerLipDotCanvas.width = dimension.width;
  tempLowerLipDotCanvas.height = dimension.height;
  const tempLowerLipDotCtx = tempLowerLipDotCanvas.getContext('2d')!;

  clipLipsOnFace(
    tempLowerLipDotCanvas,
    tempLowerLipDotCtx,
    faceLandmarks,
    LOWER_LIP_INDICES
  );
  tempLowerLipDotCtx.filter = `blur(${LOWER_LIP_DOT_BLUR_AMOUNT}px)`;

  const tempUpperLipDotCanvas = document.createElement('canvas');
  tempUpperLipDotCanvas.width = dimension.width;
  tempUpperLipDotCanvas.height = dimension.height;
  const tempUpperLipDotCtx = tempUpperLipDotCanvas.getContext('2d')!;

  clipLipsOnFace(
    tempUpperLipDotCanvas,
    tempUpperLipDotCtx,
    faceLandmarks,
    UPPER_LIP_INDICES
  );
  tempUpperLipDotCtx.filter = `blur(${LOWER_LIP_DOT_BLUR_AMOUNT}px)`;

  canvasCtx.globalAlpha = 0.8;
  canvasCtx.globalCompositeOperation = 'source-over';
  canvasCtx.drawImage(tempLowerLipDotCanvas, 0, 0);
  canvasCtx.drawImage(tempUpperLipDotCanvas, 0, 0);

  canvasCtx.globalCompositeOperation = 'source-over';
}

function drawUpperLip(
  canvasElement: HTMLCanvasElement,
  canvasCtx: CanvasRenderingContext2D,
  faceLandmarks: NormalizedLandmark[],
  upperLipIndices: number[],
  lipColor: Color,
  texture: HTMLImageElement,
  dimension: { height: number; width: number },
  alphaValue: number
) {
  canvasCtx.save();
  clipLipsOnFace(canvasElement, canvasCtx, faceLandmarks, upperLipIndices);

  fillColor(canvasCtx, lipColor, 0.6);

  const rgbaMatch = lipColor?.match(
    /rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/
  );
  if (rgbaMatch) {
    const [, r, g, b, a] = rgbaMatch;
    const rgba = {
      r: Number(r),
      g: Number(g),
      b: Number(b),
      a: a !== undefined ? Number(a) : 1,
    };
    if (isBrightColor(rgba.r, rgba.g, rgba.b) == 1) {
      const upperlipop = 0.3;
      applyTexture(
        canvasCtx,
        faceLandmarks,
        upperLipIndices,
        texture,
        upperlipop
      );
    } else {
      const inop = 0.3;
      const upperlipop = 0.1;

      applyTexture(
        canvasCtx,
        faceLandmarks,
        upperLipIndices,
        texture,
        upperlipop
      ); //  LOWER_WHITE_LIP_INDICESFSET
      applyTexture(
        canvasCtx,
        faceLandmarks,
        UPPER_WHITE_LIP_INDICESFSET,
        texture,
        inop
      );
    }
  } else {
    console.warn('Invalid color format:', lipColor);
  }

  applyLipFilters(canvasCtx, dimension, alphaValue);
  canvasCtx.restore();
}
function drawUpperLipc(
  canvasElement: HTMLCanvasElement,
  canvasCtx: CanvasRenderingContext2D,
  faceLandmarks: NormalizedLandmark[],
  upperLipIndices: number[],
  lipColor: string,
  texture: HTMLImageElement,
  alphaValue: number
) {
  canvasCtx.save();

  // Step 1: Clip the upper lip area
  clipLipsOnFace(canvasElement, canvasCtx, faceLandmarks, upperLipIndices);

  // Step 2: Fill the base color
  fillColor(canvasCtx, lipColor, alphaValue);

  // Step 3: Parse the lip color safely
  const rgbaMatch = lipColor.match(
    /rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/
  );

  if (!rgbaMatch) {
    console.warn('Invalid lip color format:', lipColor);
    canvasCtx.restore();
    return;
  }

  const [, rStr, gStr, bStr] = rgbaMatch;
  const r = parseInt(rStr, 10);
  const g = parseInt(gStr, 10);
  const b = parseInt(bStr, 10);

  // Step 4: Apply texture based on brightness
  if (isBrightColor(r, g, b) === 1) {
    // Bright colors → lighter texture overlay
    applyTexture(canvasCtx, faceLandmarks, upperLipIndices, texture, 0.1);
  } else {
    // Darker shades → double texture with highlight
    applyTexture(canvasCtx, faceLandmarks, upperLipIndices, texture, 0.1);
    applyTexture(
      canvasCtx,
      faceLandmarks,
      UPPER_WHITE_LIP_INDICESFSET,
      texture,
      0.2
    );
  }

  canvasCtx.restore();
}

function drawUpperLips(
  canvasElement: HTMLCanvasElement,
  canvasCtx: CanvasRenderingContext2D,
  faceLandmarks: NormalizedLandmark[],
  upperLipIndices: number[],
  lipColor: string,
  texture: HTMLImageElement,
  dimension: { height: number; width: number },
  alphaValue: number
) {
  canvasCtx.save();

  clipLipsOnFace(canvasElement, canvasCtx, faceLandmarks, upperLipIndices);

  fillColor(canvasCtx, lipColor, 0.4);

  const rgbaMatch = lipColor.match(
    /rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/
  );

  if (!rgbaMatch) {
    console.warn('Invalid lipColor format:', lipColor);
    canvasCtx.restore();
    return;
  }

  const [, rStr, gStr, bStr] = rgbaMatch;
  const r = parseInt(rStr, 10);
  const g = parseInt(gStr, 10);
  const b = parseInt(bStr, 10);

  // Step 4: Apply texture based on brightness
  if (isBrightColor(r, g, b) === 1) {
    applyTexture(canvasCtx, faceLandmarks, upperLipIndices, texture, 0.7);
  } else {
    applyTexture(canvasCtx, faceLandmarks, upperLipIndices, texture, 0.7);
    applyTexture(
      canvasCtx,
      faceLandmarks,
      UPPER_WHITE_LIP_INDICESFSET,
      texture,
      0.9
    );
  }

  applyLipFilters(canvasCtx, dimension, alphaValue);
  canvasCtx.restore();
}

function drawLowerLip(
  canvasElement: HTMLCanvasElement,
  canvasCtx: CanvasRenderingContext2D,
  faceLandmarks: NormalizedLandmark[],
  lowerLipIndices: number[],
  lipColor: string,
  texture: HTMLImageElement,
  dimension: Record<'width' | 'height', number>,
  alphaValue: number
) {
  canvasCtx.save();

  // Step 1: Clip the lower lip region
  clipLipsOnFace(canvasElement, canvasCtx, faceLandmarks, lowerLipIndices);

  // Step 2: Fill the base lip color
  fillColor(canvasCtx, lipColor, 0.4);

  // Step 3: Safely extract RGB values
  const rgbaMatch = lipColor.match(
    /rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/
  );

  if (!rgbaMatch) {
    console.warn('Invalid lipColor format:', lipColor);
    canvasCtx.restore();
    return;
  }

  const [, rStr, gStr, bStr] = rgbaMatch;
  const r = parseInt(rStr, 10);
  const g = parseInt(gStr, 10);
  const b = parseInt(bStr, 10);

  // Step 4: Adjust textures based on brightness
  if (isBrightColor(r, g, b) === 1) {
    // Bright colors: subtle texture overlay
    applyTexture(canvasCtx, faceLandmarks, lowerLipIndices, texture, 0.1);
  } else {
    // Dark colors: stronger inner and outer texture layers
    applyTexture(canvasCtx, faceLandmarks, lowerLipIndices, texture, 0.1);
    applyTexture(
      canvasCtx,
      faceLandmarks,
      LOWER_WHITE_LIP_INDICESFSET,
      texture,
      0.3
    );
  }

  // Step 5: Add finishing filter / blend
  applyLipFilters(canvasCtx, dimension, alphaValue);

  // Step 6: Restore the original canvas state
  canvasCtx.restore();
}

function drawLowerLipc(
  canvasElement: HTMLCanvasElement,
  canvasCtx: CanvasRenderingContext2D,
  faceLandmarks: NormalizedLandmark[],
  lowerLipIndices: number[],
  lipColor: string,
  texture: HTMLImageElement,
  alphaValue: number
) {
  canvasCtx.save();

  // Step 1: Clip lower lip area on face
  clipLipsOnFace(canvasElement, canvasCtx, faceLandmarks, lowerLipIndices);

  // Step 2: Fill the base color
  fillColor(canvasCtx, lipColor, alphaValue);

  // Step 3: Safely parse RGBA values
  const rgbaMatch = lipColor.match(
    /rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/
  );

  if (!rgbaMatch) {
    console.warn('Invalid lipColor format:', lipColor);
    canvasCtx.restore();
    return;
  }

  const [, rStr, gStr, bStr] = rgbaMatch;
  const r = parseInt(rStr, 10);
  const g = parseInt(gStr, 10);
  const b = parseInt(bStr, 10);

  // Step 4: Apply texture based on brightness
  if (isBrightColor(r, g, b) === 1) {
    // Bright lip color → softer texture
    applyTexture(canvasCtx, faceLandmarks, lowerLipIndices, texture, 0.1);
  } else {
    // Darker lip color → stronger inner highlight
    applyTexture(canvasCtx, faceLandmarks, lowerLipIndices, texture, 0.1);
    applyTexture(
      canvasCtx,
      faceLandmarks,
      LOWER_WHITE_LIP_INDICESFSET,
      texture,
      0.2
    );
  }

  // Step 5: Restore canvas state
  canvasCtx.restore();
}

function drawLowerLips(
  canvasElement: HTMLCanvasElement,
  canvasCtx: CanvasRenderingContext2D,
  faceLandmarks: NormalizedLandmark[],
  lowerLipIndices: number[],
  lipColor: string,
  texture: HTMLImageElement,
  dimension: Record<'width' | 'height', number>,
  alphaValue: number
) {
  canvasCtx.save();

  // Step 1: Clip lower lip area
  clipLipsOnFace(canvasElement, canvasCtx, faceLandmarks, lowerLipIndices);

  // Step 2: Fill base color with opacity
  fillColor(canvasCtx, lipColor, 0.4);

  // Step 3: Safely parse RGB(A) values
  const rgbaMatch = lipColor.match(
    /rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/
  );

  if (!rgbaMatch) {
    console.warn('Invalid lipColor format:', lipColor);
    canvasCtx.restore();
    return;
  }

  const [, rStr, gStr, bStr] = rgbaMatch;
  const r = parseInt(rStr, 10);
  const g = parseInt(gStr, 10);
  const b = parseInt(bStr, 10);

  // Step 4: Apply texture based on brightness
  if (isBrightColor(r, g, b) === 1) {
    applyTexture(canvasCtx, faceLandmarks, lowerLipIndices, texture, 0.7);
  } else {
    applyTexture(canvasCtx, faceLandmarks, lowerLipIndices, texture, 0.7);
    applyTexture(
      canvasCtx,
      faceLandmarks,
      LOWER_WHITE_LIP_INDICESFSET,
      texture,
      0.9
    );
  }

  // Step 5: Apply filters / blending
  applyLipFilters(canvasCtx, dimension, alphaValue);

  // Step 6: Restore canvas state
  canvasCtx.restore();
}

function drawUpperLipm(
  canvasElement: HTMLCanvasElement,
  canvasCtx: CanvasRenderingContext2D,
  faceLandmarks: NormalizedLandmark[],
  upperLipIndices: number[],
  lipColor: Color,
  alphaValue: number
) {
  canvasCtx.save();
  clipLipsOnFace(canvasElement, canvasCtx, faceLandmarks, upperLipIndices);

  fillColor(canvasCtx, lipColor, alphaValue);

  canvasCtx.restore();
}

function drawLowerLipm(
  canvasElement: HTMLCanvasElement,
  canvasCtx: CanvasRenderingContext2D,
  faceLandmarks: NormalizedLandmark[],
  lowerLipIndices: number[],
  lipColor: Color,
  alphaValue: number
) {
  canvasCtx.save();
  clipLipsOnFace(canvasElement, canvasCtx, faceLandmarks, lowerLipIndices);

  fillColor(canvasCtx, lipColor, alphaValue);

  canvasCtx.restore();
}

export function applyOnLips(
  faceLandmarks: NormalizedLandmark[],
  canvasCtx: CanvasRenderingContext2D,
  lipColor: Color,
  dimension: { height: number; width: number },
  alphaValue: number
) {
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = dimension.width;
  tempCanvas.height = dimension.height;
  const tempCtx = tempCanvas.getContext('2d')!;

  drawUpperLipm(
    tempCanvas,
    tempCtx,
    faceLandmarks,
    UPPER_LIP_INDICES,
    lipColor,
    alphaValue
  );
  drawLowerLipm(
    tempCanvas,
    tempCtx,
    faceLandmarks,
    LOWER_LIP_INDICES,
    lipColor,
    alphaValue
  );
  // updated globalCompositeOperation for matte lipstick (Brown shade issue)
  canvasCtx.globalCompositeOperation = 'source-over';
  canvasCtx.drawImage(tempCanvas, 0, 0);
}

function isBrightColor(r: number, g: number, b: number) {
  // Calculate the luminance
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;

  // Define the threshold
  const threshold = 128;

  // Determine if the color is bright or dark
  return luminance > threshold ? 1 : 0;
}
function applyLipFilters(
  canvasCtx: CanvasRenderingContext2D,
  dimension: { height: number; width: number },
  alphaValue: number
) {
  // Adjust the filter settings to enhance lip colors
  canvasCtx.filter = 'contrast(1.1) saturate(1.1)';
  canvasCtx.globalAlpha = alphaValue; // Ensure full opacity while applying filters
  canvasCtx.fillRect(0, 0, dimension.width, dimension.height); // Apply the filter to the entire canvas
  canvasCtx.filter = 'none'; // Reset filters after application
}
function fillColor(
  canvasCtx: CanvasRenderingContext2D,
  fillColor: Color,
  alpha: number
) {
  canvasCtx.fillStyle = fillColor;
  canvasCtx.globalAlpha = alpha;
  canvasCtx.fill();
}
function clipLipsOnFace(
  canvasElement: HTMLCanvasElement,
  canvasCtx: CanvasRenderingContext2D,
  faceLandmarks: NormalizedLandmark[],
  lipIndices: number[]
) {
  canvasCtx.beginPath();
  lipIndices.forEach((index, i) => {
    const point = faceLandmarks[index];
    const x = point.x * canvasElement.width;
    const y = point.y * canvasElement.height;
    if (i === 0) {
      canvasCtx.moveTo(x, y);
    } else {
      canvasCtx.lineTo(x, y);
    }
  });
  canvasCtx.closePath();
  canvasCtx.clip();
}

export function applyTexture(
  canvasCtx: CanvasRenderingContext2D,
  faceLandmarks: NormalizedLandmark[],
  lipIndices: number[],
  texture: HTMLImageElement,
  OPACITY: number
) {
  const padding = 5; // Adjust the padding for smoothness
  const paddedIndices = lipIndices.map((index) => {
    const point = faceLandmarks[index];
    return {
      x: point.x * canvasCtx.canvas.width,
      y: point.y * canvasCtx.canvas.height,
    };
  });
  canvasCtx.save();
  canvasCtx.beginPath();
  canvasCtx.moveTo(paddedIndices[0].x - padding, paddedIndices[0].y - padding);

  // Create circular curves using quadraticCurveTo
  paddedIndices.forEach((point, i) => {
    if (i > 0) {
      const previousPoint = paddedIndices[i - 1];
      const cpX = (previousPoint.x + point.x) / 2;
      const cpY = (previousPoint.y + point.y) / 2;
      canvasCtx.quadraticCurveTo(previousPoint.x, previousPoint.y, cpX, cpY);
    }
  });

  // Close the circular path with a smooth curve
  const lastPoint = paddedIndices[paddedIndices.length - 1];
  canvasCtx.quadraticCurveTo(
    lastPoint.x,
    lastPoint.y,
    paddedIndices[0].x - padding,
    paddedIndices[0].y - padding
  );
  canvasCtx.closePath();

  // Clip to the lip shape
  canvasCtx.clip();

  const minX = Math.min(...paddedIndices.map((p) => p.x));
  const minY = Math.min(...paddedIndices.map((p) => p.y));
  const maxX = Math.max(...paddedIndices.map((p) => p.x));
  const maxY = Math.max(...paddedIndices.map((p) => p.y));

  canvasCtx.globalAlpha = OPACITY;
  canvasCtx.drawImage(texture, minX, minY, maxX - minX, maxY - minY);
  canvasCtx.restore();
}

export const getInitialState = (tryOn: TTryOn | null) => {
  const { default: range } = getRangeValues(tryOn);
  switch (tryOn) {
    case 'Lipstick':
      return {
        type: null,
        range,
        color: null,
        cameraReady: false,
        imageReady: false,
        tryOnStarted: false,
      };
    case 'Foundation':
    case 'Eyebrow':
    case 'Eyeshadow':
    case 'Blush':
      return {
        type: null,
        range,
        color: null,
        cameraReady: false,
        imageReady: false,
        tryOnStarted: false,
      };
    case 'Eyeliner':
    case 'Kajal':
      return {
        type: null,
        range,
        color: null,
        cameraReady: false,
        imageReady: false,
        tryOnStarted: false,
      };
    default:
      return {
        type: null,
        range,
        color: null,
        cameraReady: false,
        imageReady: false,
        tryOnStarted: false,
      };
  }
};

export const loadImage = (
  src: string,
  signal?: AbortSignal
): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      return reject(new DOMException('Aborted', 'AbortError'));
    }

    const img = new Image();
    img.crossOrigin = 'anonymous';

    const cleanup = () => {
      img.onload = null;
      img.onerror = null;
      signal?.removeEventListener('abort', onAbort);
    };

    const onAbort = () => {
      cleanup();
      img.src = '';
      reject(new DOMException('Aborted', 'AbortError'));
    };

    signal?.addEventListener('abort', onAbort);

    img.onload = () => {
      cleanup();
      resolve(img);
    };

    img.onerror = () => {
      cleanup();
      reject(new Error(`Failed to load image: ${src}`));
    };

    img.src = src;
  });
};

export const toINRCurrency = (amount: number): string =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(amount);

export const hexToRGBA = (
  hex: string,
  alpha: number = 1
): [number, number, number, number] => {
  let r = 0,
    g = 0,
    b = 0;

  // Remove '#' if present
  hex = hex.replace('#', '');

  if (hex.length === 3) {
    // Handle shorthand hex (#f00)
    r = parseInt(hex[0] + hex[0], 16);
    g = parseInt(hex[1] + hex[1], 16);
    b = parseInt(hex[2] + hex[2], 16);
  } else if (hex.length === 6) {
    r = parseInt(hex.slice(0, 2), 16);
    g = parseInt(hex.slice(2, 4), 16);
    b = parseInt(hex.slice(4, 6), 16);
  }

  return [r, g, b, alpha];
};

export const checkRgbIsSame = (color1: ColorTuple, color2: ColorTuple) => {
  return (
    color1[0] === color2[0] &&
    color1[1] === color2[1] &&
    color1[2] === color2[2]
  );
};

export const colorTupleToHex = (colorTuple: ColorTuple) => {
  // Validate the input
  if (!Array.isArray(colorTuple) || colorTuple.length < 3) {
    throw new Error(
      'Input must be an array with at least three elements representing RGB values.'
    );
  }

  // Map through the first three values (RGB) and convert them to hex
  const hex = colorTuple
    .slice(0, 3) // Only consider the first three elements
    .map((value) => {
      if (typeof value !== 'number' || value < 0 || value > 255) {
        throw new Error('Each RGB value must be an integer between 0 and 255.');
      }
      return value.toString(16).padStart(2, '0');
    })
    .join('');

  // Return the full hex code for RGB
  return `#${hex}`;
};

export const getLandmarker = async (
  canvas: HTMLCanvasElement,
  mode: 'IMAGE' | 'VIDEO' = 'VIDEO',
  signal?: AbortSignal
): Promise<FaceLandmarker> => {
  if (signal?.aborted) {
    throw new DOMException('Aborted', 'AbortError');
  }

  const abortPromise = new Promise<never>((_, reject) => {
    signal?.addEventListener('abort', () => {
      reject(new DOMException('Aborted', 'AbortError'));
    });
  });

  const createLandmarker = async () => {
    const vision = await FilesetResolver.forVisionTasks(
      MEDIAPIPE_WASM_BASE_URL
    );

    if (signal?.aborted) {
      throw new DOMException('Aborted', 'AbortError');
    }

    const create = (delegate: 'GPU' | 'CPU') =>
      FaceLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath:
            'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task',
          delegate,
        },
        outputFaceBlendshapes: true,
        runningMode: mode,
        canvas,
        numFaces: 1,
      });

    try {
      // First try GPU
      return await create('GPU');
    } catch (err) {
      console.warn('GPU delegate failed, falling back to CPU', err);
      // Fallback to CPU
      return await create('CPU');
    }
  };

  // Race between abort and creation
  const landmarker = await Promise.race([createLandmarker(), abortPromise]);

  // If aborted after creation finished
  if (signal?.aborted) {
    landmarker?.close();
    throw new DOMException('Aborted', 'AbortError');
  }

  return landmarker;
};

export const resolveTextureImages = (
  result: PromiseSettledResult<HTMLImageElement>[]
) => {
  const TEXTURE_KEYS = ['L', 'U', 'Lc', 'Uc', 'Ls', 'Us'] as const;

  type TextureKey = (typeof TEXTURE_KEYS)[number];

  // 🛡️ length guard
  if (result.length < TEXTURE_KEYS.length) return false;

  // ❌ If anyone is not fulfilled
  if (result.some((r) => r.status !== 'fulfilled')) return false;

  const TextureImage = TEXTURE_KEYS.reduce(
    (acc, key, idx) => {
      acc[key] = (
        result[idx] as PromiseFulfilledResult<HTMLImageElement>
      ).value;
      return acc;
    },
    {} as Record<TextureKey, HTMLImageElement>
  );

  return { status: true, TextureImage };
};

export const getTextures = async ({ signal }: { signal?: AbortSignal }) => {
  if (signal?.aborted) {
    throw new DOMException('Aborted', 'AbortError');
  }

  try {
    return await Promise.allSettled([
      loadImage(GLOSSY_TEXTURE_PATHL, signal),
      loadImage(GLOSSY_TEXTURE_PATHU, signal),
      loadImage(CRAYON_TEXTURE_PATHL, signal),
      loadImage(CRAYON_TEXTURE_PATHU, signal),
      loadImage(SHIMMER_TEXTURE_PATHL, signal),
      loadImage(SHIMMER_TEXTURE_PATHU, signal),
    ]);
  } catch (err) {
    if ((err as Error)?.name === 'AbortError') {
      throw err;
    }

    console.error('Texture loading crashed', err);
    throw err;
  }
};

export const captureSnapShot = (
  source: HTMLVideoElement | HTMLImageElement,
  canvas: HTMLCanvasElement
) => {
  const tempCanvas = document.createElement('canvas');
  const ctx = tempCanvas.getContext('2d');

  if (!ctx) {
    console.error('Canvas context missing');
    return null;
  }

  tempCanvas.width = canvas.width;
  tempCanvas.height = canvas.height;

  ctx.clearRect(0, 0, tempCanvas.width, tempCanvas.height);

  /* ================= CAMERA MODE ================= */
  if (source instanceof HTMLVideoElement) {
    ctx.save();

    // mirror webcam
    ctx.translate(tempCanvas.width, 0);
    ctx.scale(-1, 1);

    ctx.drawImage(source, 0, 0, tempCanvas.width, tempCanvas.height);

    ctx.restore();

    // lipstick overlay
    ctx.drawImage(canvas, 0, 0);
  } else {
    /* ================= IMAGE UPLOAD MODE ================= */
    // draw original image
    ctx.drawImage(source, 0, 0, tempCanvas.width, tempCanvas.height);

    // draw makeup overlay
    ctx.drawImage(canvas, 0, 0);
  }

  /* ================= OUTPUT ================= */

  const dataURL = tempCanvas.toDataURL('image/png');

  const link = document.createElement('a');
  link.download = 'Snapshot.png';
  link.href = dataURL;
  link.click();
};

export const resizeElements = (
  source: HTMLVideoElement | HTMLImageElement,
  canvas1: HTMLCanvasElement,
  canvas2: HTMLCanvasElement
) => {
  let width = 0;
  let height = 0;

  if (source instanceof HTMLVideoElement) {
    width = source.videoWidth;
    height = source.videoHeight;
  } else {
    width = source.naturalWidth;
    height = source.naturalHeight;
  }

  if (!width || !height) return;

  /* canvas internal size */
  canvas1.width = width;
  canvas1.height = height;

  canvas2.width = width;
  canvas2.height = height;

  /* FIX: fallback size */
  const parent = canvas1.parentElement?.getBoundingClientRect();

  const displayHeight = parent?.height || height;
  const aspectRatio = width / height;
  const displayWidth = displayHeight * aspectRatio;

  canvas1.style.width = `${displayWidth}px`;
  canvas1.style.height = `${displayHeight}px`;

  canvas2.style.width = `${displayWidth}px`;
  canvas2.style.height = `${displayHeight}px`;
};

// Determine if a pixel represents skin based on RGB values
function isSkinPixel(r: number, g: number, b: number) {
  return (
    r > 95 &&
    g > 40 &&
    b > 20 &&
    Math.max(r, g, b) - Math.min(r, g, b) > 15 &&
    Math.abs(r - g) > 15 &&
    r > g &&
    r > b
  );
}

// Compute convex hull for face contour points
function convexHull(points: Vector2[]) {
  // Sort points by x-coordinate (and y-coordinate as a tie-breaker)
  points.sort((a, b) => a.x - b.x || a.y - b.y);

  const cross = (o: Vector2, a: Vector2, b: Vector2) =>
    (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x);

  const lower = [];
  for (const p of points) {
    while (
      lower.length >= 2 &&
      cross(lower[lower.length - 2], lower[lower.length - 1], p) <= 0
    ) {
      lower.pop();
    }
    lower.push(p);
  }

  const upper = [];
  for (const p of points.reverse()) {
    while (
      upper.length >= 2 &&
      cross(upper[upper.length - 2], upper[upper.length - 1], p) <= 0
    ) {
      upper.pop();
    }
    upper.push(p);
  }

  // Remove the last point of each half because it's repeated at the start of the other
  upper.pop();
  lower.pop();
  // Combine lower and upper hull to get the convex hull
  return lower.concat(upper);
}

export const extractFaceRegion = (
  landmarks: NormalizedLandmark[],
  size: { width: number; height: number },
  ctx: CanvasRenderingContext2D
) => {
  const boundaryPoints = [
    10, 338, 297, 332, 284, 251, 389, 356, 454, 323, 361, 288, 397, 365, 379,
    378, 400, 377, 152, 148, 176, 149, 150, 136, 172, 58, 132, 93, 234, 127,
    162, 21, 54, 103, 67, 109,
  ];

  const contourPoints = [];

  for (const index of boundaryPoints) {
    const landmark = landmarks[index];
    if (landmark) {
      contourPoints.push({
        x: Math.round(landmark.x * size.width),
        y: Math.round(landmark.y * size.height),
      });
    }
  }

  const foreheadLandmarks = [landmarks[9], landmarks[10], landmarks[11]];

  const extendedForeheadLandmarks = foreheadLandmarks.map((landmark) => ({
    x: landmark.x,
    y: Math.max(0, landmark.y + 0.04),
  }));

  const centerX =
    (extendedForeheadLandmarks[0].x +
      extendedForeheadLandmarks[1].x +
      extendedForeheadLandmarks[2].x) /
    3;
  const centerY =
    (extendedForeheadLandmarks[0].y +
      extendedForeheadLandmarks[1].y +
      extendedForeheadLandmarks[2].y) /
    3;

  const centerPixelX = centerX * size.width;
  const centerPixelY = centerY * size.height;

  const radius =
    Math.max(
      Math.hypot(
        extendedForeheadLandmarks[0].x - extendedForeheadLandmarks[1].x,
        extendedForeheadLandmarks[0].y - extendedForeheadLandmarks[1].y
      ),
      Math.hypot(
        extendedForeheadLandmarks[1].x - extendedForeheadLandmarks[2].x,
        extendedForeheadLandmarks[1].y - extendedForeheadLandmarks[2].y
      )
    ) * size.width;

  const restrictedRadius = radius * 0.5; //original 0.7
  const rotationAngle = Math.PI / 1.6;

  // Get the normalized x and y coordinates
  const leftendx = Math.round(landmarks[21].x * size.width);
  const rightendx = Math.round(landmarks[251].x * size.width);
  const leftendy = Math.round(landmarks[54].y * size.height);

  // Clip and draw the moon shape

  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = size.width;
  tempCanvas.height = size.height;
  tempCanvas.style.display = 'none';
  const s_ctx = tempCanvas.getContext('2d');
  if (!s_ctx) return;
  s_ctx.save();
  s_ctx.translate(centerPixelX, centerPixelY);
  s_ctx.rotate(rotationAngle);
  s_ctx.beginPath();
  const startAngle = 0.5 * Math.PI;
  const endAngle = 1.25 * Math.PI;
  s_ctx.arc(0, 0, restrictedRadius, startAngle, endAngle);
  s_ctx.closePath();
  s_ctx.clip();
  s_ctx.fillStyle = 'rgba(0, 255, 0, 1)';
  s_ctx.fill();
  s_ctx.restore();

  const imageDatao = ctx.getImageData(0, 0, size.width, size.height);
  const imageData = s_ctx.getImageData(0, 0, size.width, size.height);

  for (let i = 0; i < imageData.data.length; i += 4) {
    const cx = Math.round((i / 4) % imageData.width);
    const cy = Math.round(Math.floor(i / 4 / imageData.width));
    const r = imageData.data[i];
    const g = imageData.data[i + 1];
    const b = imageData.data[i + 2];
    const a = imageData.data[i + 3];
    if (r === 0 && g === 255 && b === 0 && a === 255) {
      if (cy < leftendy && cx > leftendx && cx < rightendx) {
        // Change green pixels to blue
        const sr = imageDatao.data[i];
        const sg = imageDatao.data[i + 1];
        const sb = imageDatao.data[i + 2];
        if (isSkinPixel(sr, sg, sb)) {
          contourPoints.push({ x: cx, y: cy });
        }
      }
    }
  }

  const hull = convexHull(contourPoints);

  return hull;
};

export const extractFaceRegion1 = (
  landmarks: NormalizedLandmark[],
  size: { width: number; height: number }
) => {
  const boundaryPoints = [
    10, 338, 297, 332, 284, 251, 389, 356, 454, 323, 361, 288, 397, 365, 379,
    378, 400, 377, 152, 148, 176, 149, 150, 136, 172, 58, 132, 93, 234, 127,
    162, 21, 54, 103, 67, 109,
  ];

  const contourPoints = [];

  for (const index of boundaryPoints) {
    const landmark = landmarks[index];
    if (landmark) {
      contourPoints.push({
        x: Math.round(landmark.x * size.width),
        y: Math.round(landmark.y * size.height),
      });
    }
  }
  const hull = convexHull(contourPoints);
  return hull;
};

export const extractRegion = (
  landmarks: NormalizedLandmark[],
  size: { width: number; height: number },
  type: 'left-eye' | 'right-eye' | 'lips'
) => {
  const boundaryPoints =
    type === 'left-eye'
      ? [
          33, 246, 161, 160, 159, 158, 157, 173, 133, 155, 154, 153, 145, 144,
          163, 7,
        ]
      : type === 'right-eye'
        ? [
            362, 398, 384, 385, 386, 387, 388, 466, 263, 249, 390, 373, 374,
            380, 381, 382,
          ]
        : type === 'lips'
          ? [
              61, 185, 40, 39, 37, 0, 267, 269, 270, 409, 291, 375, 321, 405,
              314, 17, 84, 181, 91, 146,
            ]
          : [];

  const resultPoints = boundaryPoints.map((i) => ({
    x: landmarks[i].x * size.width,
    y: landmarks[i].y * size.height,
  }));
  return resultPoints;
};

export const applyTintEffect = (
  canvasCtx: CanvasRenderingContext2D,
  faceRegion: Vector2[],

  excludeRegions: Vector2[][],
  color: ColorTuple
) => {
  const [r, g, b, a] = color;

  canvasCtx.save();
  canvasCtx.beginPath();

  // 1. Draw the main Face Path
  faceRegion.forEach((point, index) => {
    if (index === 0) canvasCtx.moveTo(point.x, point.y);
    else canvasCtx.lineTo(point.x, point.y);
  });
  canvasCtx.closePath();

  // 2. Draw the Exclusion Paths (Holes) inside the same BeginPath
  excludeRegions.forEach((region) => {
    region.forEach((point, index) => {
      if (index === 0) canvasCtx.moveTo(point.x, point.y);
      else canvasCtx.lineTo(point.x, point.y);
    });
    canvasCtx.closePath();
  });

  // 3. Fill using 'evenodd' rule
  // This automatically subtracts the inner shapes from the outer shape
  canvasCtx.fillStyle = `rgba(${r}, ${g}, ${b}, ${a})`;
  canvasCtx.fill('evenodd');

  canvasCtx.restore();
};

// Draw blurred polygon for blush effect
function drawBlurredPolygon(
  ctx: CanvasRenderingContext2D,
  shapePoints: NormalizedLandmark[],
  gradient: CanvasGradient,
  size: { width: number; height: number }
) {
  // Kernel for blur effect
  const kernel = [
    { x: -1, y: -1, weight: 1 },
    { x: 0, y: -1, weight: 2 },
    { x: 1, y: -1, weight: 1 },
    { x: -1, y: 0, weight: 2 },
    { x: 0, y: 0, weight: 4 },
    { x: 1, y: 0, weight: 2 },
    { x: -1, y: 1, weight: 1 },
    { x: 0, y: 1, weight: 2 },
    { x: 1, y: 1, weight: 1 },
  ];
  const totalWeight = kernel.reduce((sum, k) => sum + k.weight, 0);
  const blurOffset = 10;

  for (const offset of kernel) {
    ctx.save();
    ctx.translate(offset.x * blurOffset, offset.y * blurOffset);
    ctx.globalAlpha = offset.weight / totalWeight;
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.moveTo(shapePoints[0].x * size.width, shapePoints[0].y * size.height);
    for (let i = 1; i < shapePoints.length; i++) {
      ctx.lineTo(shapePoints[i].x * size.width, shapePoints[i].y * size.height);
    }
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }
  ctx.globalAlpha = 1;
}

export const addBlushEffect = (
  ctx: CanvasRenderingContext2D,
  landmarks: { [key: number]: NormalizedLandmark },
  size: { width: number; height: number },
  color: ColorTuple,
  rightCheekPoint: number,
  leftCheekPoint: number
) => {
  const [r, g, b, a] = color;
  const leftCheek = landmarks[rightCheekPoint];
  const rightCheek = landmarks[leftCheekPoint];

  // Define boundary points for more flexible blush shape rendering
  const leftBoundary = landmarks[93];
  const rightBoundary = landmarks[366];

  // For blush radius, we no longer need to calculate the ellipse size
  const defaultRadius = size.width * 0.8;

  // Define the positions for the left and right cheeks with custom shapes
  const positions = [
    {
      x: leftCheek.x * size.width,
      y: leftCheek.y * size.height,
      boundary: leftBoundary,
      shapeLandmarks: [
        landmarks[205],
        landmarks[36],
        landmarks[118],
        landmarks[117],
        landmarks[111],
        landmarks[143],
        landmarks[34],
        landmarks[137],
        landmarks[147],
        landmarks[187],
        landmarks[187],
      ],
    },
    {
      x: rightCheek.x * size.width,
      y: rightCheek.y * size.height,
      boundary: rightBoundary,
      shapeLandmarks: [
        landmarks[425],
        landmarks[266],
        landmarks[347],
        landmarks[346],
        landmarks[340],
        landmarks[372],
        landmarks[264],
        landmarks[366],
        landmarks[376],
        landmarks[411],
      ],
    },
  ];

  for (const pos of positions) {
    const gradient = ctx.createRadialGradient(
      pos.x,
      pos.y,
      0,
      pos.x,
      pos.y,
      defaultRadius // You can adjust this radius if needed, or remove it completely
    );
    gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${a})`);
    gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
    const supportsCanvasFilter = 'filter' in ctx;

    if (!supportsCanvasFilter) {
      drawBlurredPolygon(ctx, pos.shapeLandmarks, gradient, size);
    } else {
      ctx.filter = 'blur(10px)';
      ctx.fillStyle = gradient;
      ctx.beginPath();
      // Use specific landmarks to define a custom polygon shape
      ctx.moveTo(
        pos.shapeLandmarks[0].x * size.width,
        pos.shapeLandmarks[0].y * size.height
      );
      for (const point of pos.shapeLandmarks) {
        ctx.lineTo(point.x * size.width, point.y * size.height);
      }
      ctx.closePath();
      ctx.fill();
      ctx.filter = 'none';
    }
  }
};

export const getEyelinerIndices = (type: TEyeliner) => {
  let rightEyePoints: TEyeIndicesPoints[] = [];
  let leftEyePoints: TEyeIndicesPoints[] = [];
  switch (type) {
    case 'pattern1': {
      rightEyePoints = pattern_1_indices.right_eye;
      leftEyePoints = pattern_1_indices.left_eye;
      break;
    }
    case 'pattern2': {
      rightEyePoints = pattern_2_indices.right_eye;
      leftEyePoints = pattern_2_indices.left_eye;
      break;
    }
    case 'pattern3': {
      rightEyePoints = pattern_3_indices.right_eye;
      leftEyePoints = pattern_3_indices.left_eye;
      break;
    }
    default: {
      break;
    }
  }
  return { left: leftEyePoints, right: rightEyePoints };
};

export const getKajalIndices = (type: TKajal) => {
  let rightEyePoints: TEyeIndicesPoints[] = [];
  let leftEyePoints: TEyeIndicesPoints[] = [];
  switch (type) {
    case 'pattern1': {
      rightEyePoints = pattern_4_thick_indices.right_eye;
      leftEyePoints = pattern_4_thick_indices.left_eye;
      break;
    }
    case 'pattern2': {
      rightEyePoints = pattern_4_thin_indices.right_eye;
      leftEyePoints = pattern_4_thin_indices.left_eye;
      break;
    }
    default: {
      break;
    }
  }
  return { left: leftEyePoints, right: rightEyePoints };
};

// Clip and draw eyeliner path
function clip(
  canvasElement: HTMLCanvasElement,
  canvasCtx: CanvasRenderingContext2D,
  faceLandmarks: NormalizedLandmark[],
  indices: number[],
  line_width: number[],
  color: string
) {
  canvasCtx.lineWidth = 1; // JP Ma'am
  canvasCtx.lineCap = 'round';
  canvasCtx.lineJoin = 'round';
  canvasCtx.strokeStyle = color;
  canvasCtx.beginPath();

  indices.forEach((value, i) => {
    const point = faceLandmarks[value];
    const x = point.x * canvasElement.width;
    const y = point.y * canvasElement.height;

    if (i === 0) {
      canvasCtx.moveTo(x, y);
    } else {
      const prevPoint = faceLandmarks[indices[i - 1]];
      const prevX = prevPoint.x * canvasElement.width;
      const prevY = prevPoint.y * canvasElement.height;

      const midX2 = (prevX + x) / 2;
      const midY2 = (prevY + y) / 2;

      const midX1 = (prevX + midX2) / 2;
      const midY1 = (prevY + midY2) / 2;

      const midX3 = (midX2 + x) / 2;
      const midY3 = (midY2 + y) / 2;

      canvasCtx.lineWidth = line_width[0];
      canvasCtx.beginPath();
      canvasCtx.moveTo(prevX, prevY);
      canvasCtx.lineTo(midX1, midY1);
      canvasCtx.stroke();

      canvasCtx.lineWidth = line_width[1];
      canvasCtx.beginPath();
      canvasCtx.moveTo(midX1, midY1);
      canvasCtx.lineTo(midX2, midY2);
      canvasCtx.stroke();

      if (line_width[2] !== 0) {
        canvasCtx.lineWidth = line_width[2];
        canvasCtx.beginPath();
        canvasCtx.moveTo(midX2, midY2);
        canvasCtx.lineTo(midX3, midY3);
        canvasCtx.stroke();
        canvasCtx.quadraticCurveTo(midX2, midY2, midX3, midY3);
      }

      if (line_width[3] !== 0) {
        canvasCtx.lineWidth = line_width[2];
        canvasCtx.beginPath();
        canvasCtx.moveTo(midX3, midY3);
        canvasCtx.lineTo(x, y);
        canvasCtx.stroke();
        canvasCtx.quadraticCurveTo(midX3, midY3, x, y);
      }

      canvasCtx.quadraticCurveTo(prevX, prevY, midX1, midY1);
      canvasCtx.quadraticCurveTo(midX1, midY1, midX2, midY2);
    }
  });

  canvasCtx.closePath();
  canvasCtx.stroke();
}

// Draw eyeliner lines for a single eye
function drawEye(
  canvasElement: HTMLCanvasElement,
  canvasCtx: CanvasRenderingContext2D,
  faceLandmarks: NormalizedLandmark[],
  indices: number[],
  line_width: number[],
  color: string
) {
  canvasCtx.save();
  clip(canvasElement, canvasCtx, faceLandmarks, indices, line_width, color);
  canvasCtx.restore();
}

// Apply eyeliner texture to eyes
export const applyTextureOnEyes = (
  faceLandmarks: NormalizedLandmark[], // Face landmarks with x and y coordinates
  canvasCtx: CanvasRenderingContext2D, // Main canvas rendering context
  type: TEyeliner, // Name of the texture pattern
  rightEyePoints: { points: number[]; webCamWidth: number[] }[], // Array of objects containing points and webcam width for right eye
  leftEyePoints: { points: number[]; webCamWidth: number[] }[], // Array of objects containing points and webcam width for left eye
  color: string,
  size: { width: number; height: number }
) => {
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = size.width;
  tempCanvas.height = size.height;
  const tempCtx = tempCanvas.getContext('2d');
  if (!tempCtx) return;

  // Draw eyeliner for right eye
  rightEyePoints.forEach((point) => {
    drawEye(
      tempCanvas,
      tempCtx,
      faceLandmarks,
      point.points,
      point.webCamWidth,
      color
    );
  });

  // Apply specific eyeliner patterns
  if (type === 'pattern1') {
    canvasCtx.beginPath();
    const x =
      faceLandmarks[rightEyePoints[rightEyePoints.length - 3].points[1]].x *
      size.width;
    const y =
      faceLandmarks[rightEyePoints[rightEyePoints.length - 3].points[1]].y *
      size.height;

    const x1 =
      faceLandmarks[rightEyePoints[rightEyePoints.length - 1].points[1]].x *
      size.width;
    const y1 =
      faceLandmarks[rightEyePoints[rightEyePoints.length - 1].points[1]].y *
      size.height;

    const y1_offset = 0;
    const y2_offset = 0;
    const x2_offset = 0;

    canvasCtx.moveTo(x, y + y1_offset);
    canvasCtx.quadraticCurveTo(x + x2_offset, y + y2_offset, x1, y1);
    canvasCtx.closePath();
    canvasCtx.fill();
  } else if (type === 'pattern3') {
    canvasCtx.beginPath();
    const x = faceLandmarks[263].x * size.width;
    const y = faceLandmarks[263].y * size.height;

    const x1 = faceLandmarks[353].x * size.width;
    const y1 = faceLandmarks[353].y * size.height;

    const midX2 = (x + x1) / 2;
    const midY2 = (y + y1) / 2;

    const x1_offset = 0;
    const y1_offset = 0;
    const y2_offset = 0;
    const x2_offset = 0;

    canvasCtx.moveTo(x + x1_offset, y + y1_offset);
    canvasCtx.quadraticCurveTo(x + x2_offset, y + y2_offset, midX2, midY2);
    canvasCtx.closePath();
    canvasCtx.fill();
  }

  // Draw eyeliner for left eye
  leftEyePoints.forEach((point) => {
    drawEye(
      tempCanvas,
      tempCtx,
      faceLandmarks,
      point.points,
      point.webCamWidth,
      color
    );
  });

  if (type === 'pattern1') {
    canvasCtx.beginPath();
    const x2 =
      faceLandmarks[leftEyePoints[leftEyePoints.length - 3].points[1]].x *
      size.width;
    const y2 =
      faceLandmarks[leftEyePoints[leftEyePoints.length - 3].points[1]].y *
      size.height;

    const x3 =
      faceLandmarks[leftEyePoints[leftEyePoints.length - 1].points[1]].x *
      size.width;
    const y3 =
      faceLandmarks[leftEyePoints[leftEyePoints.length - 1].points[1]].y *
      size.height;

    const y3_offset: number = 0;
    const y4_offset: number = 0;
    const x4_offset: number = 0;

    canvasCtx.moveTo(x2, y2 + y3_offset);
    canvasCtx.quadraticCurveTo(x2 + x4_offset, y2 + y4_offset, x3, y3);
    canvasCtx.closePath();
    canvasCtx.fill();
  } else if (type === 'pattern3') {
    canvasCtx.beginPath();
    const x = faceLandmarks[33].x * size.width;
    const y = faceLandmarks[33].y * size.height;

    const x1 = faceLandmarks[124].x * size.width;
    const y1 = faceLandmarks[124].y * size.height;

    const midX2 = (x + x1) / 2;
    const midY2 = (y + y1) / 2;

    const x1_offset = 0;
    const y1_offset = 0;
    const y2_offset = 0;
    const x2_offset = 0;

    canvasCtx.moveTo(x + x1_offset, y + y1_offset);
    canvasCtx.quadraticCurveTo(x + x2_offset, y + y2_offset, midX2, midY2);
    canvasCtx.closePath();
    canvasCtx.fill();
  }

  canvasCtx.globalCompositeOperation = 'overlay';
  canvasCtx.drawImage(tempCanvas, 0, 0);
};

const getFilterData = (category: TTryOn) => {
  let menuData: FilterOption[] | TTryOnForm['patterns'] = [];
  switch (category) {
    case 'Lipstick': {
      menuData = POSSIBLE_TRYON_TYPES.lipstick.map((value) => ({
        id: value,
        label: value,
        value,
      }));
      break;
    }
    case 'Eyeliner': {
      menuData = [
        {
          id: '1',
          icon: '/assets/images/try-on/eyes/eyeliners/Classic-Winged.webp',
          label: 'Classic Winged',
          value: 'pattern1',
        },
        {
          id: '2',
          icon: '/assets/images/try-on/eyes/eyeliners/Dramatic-Cat-Eye.webp',
          label: 'Dramatic Cat Eye',
          value: 'pattern2',
        },
        {
          id: '3',
          icon: '/assets/images/try-on/eyes/eyeliners/Soft-Natural-Liner.webp',
          label: 'Soft Natural Liner',
          value: 'pattern3',
        },
      ];
      break;
    }
    case 'Kajal': {
      menuData = [
        {
          id: '1',
          icon: '/assets/images/try-on/eyes/kajal/Bold.webp',
          label: 'Bold',
          value: 'pattern1',
        },
        {
          id: '2',
          icon: '/assets/images/try-on/eyes/kajal/Classic.webp',
          label: 'Classic',
          value: 'pattern2',
        },
      ];
      break;
    }
    case 'Blush':
    case 'Foundation':
    case 'Eyeshadow':
    case 'Eyebrow':
    default: {
      break;
    }
  }
  return menuData;
};

export const getDefaultValues = (category: TTryOn) => {
  let type: TTryOnForm['type'] = null;
  let variants: TTryOnForm['variants'] = [
    { name: 'Hot Pink', hexColor: '#FF6B9D' },
  ];
  const menuData = getFilterData(category);
  switch (category) {
    case 'Lipstick': {
      type = 'matte';
      break;
    }
    case 'Eyebrow':
    case 'Kajal':
    case 'Eyeliner': {
      variants = [{ name: 'Black', hexColor: '#000000' }];
      break;
    }
    case 'Foundation': {
      variants = [{ name: '128 Warm Nude', hexColor: '#FFCDA1' }];
      break;
    }
    case 'Blush':
    case 'Eyeshadow':
    default: {
      break;
    }
  }
  return { type, variants, menuData };
};

export const getRangeValues = (
  category: TTryOn | null,
  type?: TLip | TEyeliner | TKajal | null
) => {
  let values = { min: 0, max: 0, default: 0 };
  switch (category) {
    case 'Lipstick': {
      if (type === 'crayon') {
        values = { min: 0.3, max: 0.9, default: 0.5 };
      } else if (type === 'glossy') {
        values = { min: 0.4, max: 0.9, default: 0.5 };
      } else if (type === 'matte') {
        values = { min: 0.3, max: 0.8, default: 0.5 };
      } else if (type === 'shimmer') {
        values = { min: 0.3, max: 0.8, default: 0.5 };
      } else {
        values = { min: 0, max: 1, default: 0.5 };
      }
      break;
    }
    case 'Blush': {
      values = { min: 0, max: 0.15, default: 0.1 };
      break;
    }
    case 'Eyebrow': {
      values = { min: 0, max: 0.25, default: 0.15 };
      break;
    }
    case 'Eyeliner':
    case 'Kajal': {
      values = { min: 0.5, max: 1, default: 1 };
      break;
    }
    case 'Eyeshadow': {
      values = { min: 0, max: 0.2, default: 0.17 };
      break;
    }
    case 'Foundation': {
      values = { min: 0, max: 0.07, default: 0.05 };
      break;
    }
    case 'Others':
    case 'Haircare':
    default: {
      break;
    }
  }
  return values;
};

// Apply texture to eyeshadow area
function applyTextureEyeshadow(
  canvasCtx: CanvasRenderingContext2D,
  faceLandmarks: { x: number; y: number }[],
  eyeshadowIndices: number[],
  texture: HTMLImageElement,
  OPACITY: number
) {
  const padding = 5; // Adjust the padding for smoothness
  const paddedIndices = eyeshadowIndices.map((index) => {
    const point = faceLandmarks[index];
    return {
      x: point.x * canvasCtx.canvas.width,
      y: point.y * canvasCtx.canvas.height,
    };
  });
  canvasCtx.save();
  canvasCtx.beginPath();
  canvasCtx.moveTo(paddedIndices[0].x - padding, paddedIndices[0].y - padding);

  // Create circular curves using quadraticCurveTo
  paddedIndices.forEach((point, i) => {
    if (i > 0) {
      const previousPoint = paddedIndices[i - 1];
      const cpX = (previousPoint.x + point.x) / 2;
      const cpY = (previousPoint.y + point.y) / 2;
      canvasCtx.quadraticCurveTo(previousPoint.x, previousPoint.y, cpX, cpY);
    }
  });

  // Close the circular path with a smooth curve
  const lastPoint = paddedIndices[paddedIndices.length - 1];
  canvasCtx.quadraticCurveTo(
    lastPoint.x,
    lastPoint.y,
    paddedIndices[0].x - padding,
    paddedIndices[0].y - padding
  );
  canvasCtx.closePath();
  // Clip to the lip shape
  canvasCtx.clip();

  const minX = Math.min(...paddedIndices.map((p) => p.x));
  const minY = Math.min(...paddedIndices.map((p) => p.y));
  const maxX = Math.max(...paddedIndices.map((p) => p.x));
  const maxY = Math.max(...paddedIndices.map((p) => p.y));

  canvasCtx.globalAlpha = OPACITY;
  canvasCtx.drawImage(texture, minX, minY, maxX - minX, maxY - minY);
  canvasCtx.restore();
}

// Apply contrast and saturation filters to eyeshadow
function applyEyeFilters(
  canvasCtx: CanvasRenderingContext2D,
  dimension: { height: number; width: number },
  alphaValue: number
) {
  // Adjust the filter settings to enhance lip colors
  canvasCtx.filter = 'contrast(1.1) saturate(1.1)';
  canvasCtx.globalAlpha = alphaValue; // Ensure full opacity while applying filters
  canvasCtx.fillRect(0, 0, dimension.width, dimension.height); // Apply the filter to the entire canvas
  canvasCtx.filter = 'none'; // Reset filters after application
}

// Draw eyeshadow with color and texture
function drawEyeShadow(
  canvasElement: HTMLCanvasElement,
  canvasCtx: CanvasRenderingContext2D,
  faceLandmarks: NormalizedLandmark[],
  eyebrow_indices: number[],
  color: ColorTuple,
  texture: HTMLImageElement,
  dimension: { height: number; width: number }
) {
  const [r, g, b, a] = color;
  canvasCtx.save();
  clipLipsOnFace(canvasElement, canvasCtx, faceLandmarks, eyebrow_indices);
  fillColor(canvasCtx, `rgba(${r},${g},${b},1)`, a);
  applyTextureEyeshadow(canvasCtx, faceLandmarks, eyebrow_indices, texture, a);
  applyEyeFilters(canvasCtx, dimension, a);
  canvasCtx.restore();
}

// Apply eyeshadow effect
export const applyEyeShadow = (
  faceLandmarks: NormalizedLandmark[],
  canvasCtx: CanvasRenderingContext2D,
  color: ColorTuple,
  indices: { right: number[]; left: number[] },
  textureImg: HTMLImageElement,
  size: { height: number; width: number }
) => {
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = size.width;
  tempCanvas.height = size.height;
  const tempCtx = tempCanvas.getContext('2d');

  if (!tempCtx) return;

  // Draw eyeshadow on temporary canvas
  drawEyeShadow(
    tempCanvas,
    tempCtx,
    faceLandmarks,
    indices.left,
    color,
    textureImg,
    size
  );

  drawEyeShadow(
    tempCanvas,
    tempCtx,
    faceLandmarks,
    indices.right,
    color,
    textureImg,
    size
  );
  canvasCtx.globalCompositeOperation = 'overlay';
  canvasCtx.drawImage(tempCanvas, 0, 0);
};

// Draw eyebrow shape and fill with color
function drawEyebrow(
  canvasElement: HTMLCanvasElement,
  canvasCtx: CanvasRenderingContext2D,
  faceLandmarks: NormalizedLandmark[],
  indices: number[],
  color: ColorTuple
) {
  const [r, g, b, a] = color;
  canvasCtx.save();
  clipLipsOnFace(canvasElement, canvasCtx, faceLandmarks, indices);
  fillColor(canvasCtx, `rgba(${r},${g},${b},1)`, a);
  canvasCtx.restore();
}

// Apply eyebrow effect
export const applyEyeBrow = (
  faceLandmarks: NormalizedLandmark[],
  canvasCtx: CanvasRenderingContext2D,
  color: ColorTuple,
  indices: { right: number[]; left: number[] },
  size: { height: number; width: number }
) => {
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = size.width;
  tempCanvas.height = size.height;
  const tempCtx = tempCanvas.getContext('2d');

  if (!tempCtx) return;

  // Draw eyebrows on temporary canvas
  drawEyebrow(tempCanvas, tempCtx, faceLandmarks, indices.left, color);

  drawEyebrow(tempCanvas, tempCtx, faceLandmarks, indices.right, color);
  canvasCtx.globalCompositeOperation = 'overlay';
  canvasCtx.drawImage(tempCanvas, 0, 0);
};

const toCdnUrlFromSignedSource = (url: string): string | null => {
  try {
    const parsed = new URL(url);
    const hasSignedQuery =
      parsed.searchParams.has('X-Amz-Signature') ||
      parsed.searchParams.has('X-Amz-Credential') ||
      parsed.searchParams.has('X-Amz-Algorithm');

    if (!hasSignedQuery) return null;

    const path = parsed.pathname.replace(/^\/+/, '');
    if (!path) return null;
    return `${VITE_S3_BASE_URL}/${path}`;
  } catch {
    return null;
  }
};

export const getResolvedImageUrl = (rawUrl?: string | null) => {
  if (!rawUrl) return undefined;
  const normalizedUrl = rawUrl.trim();
  if (!normalizedUrl) return undefined;

  if (
    normalizedUrl.startsWith('blob:') ||
    normalizedUrl.startsWith('data:') ||
    normalizedUrl.startsWith('http://') ||
    normalizedUrl.startsWith('https://') ||
    normalizedUrl.startsWith('/assets/')
  ) {
    return toCdnUrlFromSignedSource(normalizedUrl) ?? normalizedUrl;
  }

  return `${VITE_S3_BASE_URL}/${normalizedUrl.replace(/^\/+/, '')}`;
};
