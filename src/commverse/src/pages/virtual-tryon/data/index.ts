// 7680 × 4320 8k resolution
export const DEFAULT_HEIGHT = 4320;
export const DEFAULT_WIDTH = 7680;

export const upper_lip = [
  61, 185, 40, 39, 37, 0, 267, 269, 270, 409, 291, 308, 415, 311, 312, 13, 82,
  81, 80, 191, 78,
];

export const lower_lip = [
  61, 146, 91, 181, 84, 17, 314, 405, 321, 375, 291, 308, 324, 318, 402, 317,
  14, 87, 178, 88, 95, 78,
];

export const lips = Array.from(new Set([...upper_lip, ...lower_lip]));

// Constants
export const GLOSSY_TEXTURE_PATHL =
  '/assets/images/try-on/lips/textures/lipstick_texture_glossy-l.webp';
export const GLOSSY_TEXTURE_PATHU =
  '/assets/images/try-on/lips/textures/lipstick_texture_glossy-u.webp';
export const COMPOSITE_OPERATION = 'overlay';

export const CRAYON_TEXTURE_PATHL =
  '/assets/images/try-on/lips/textures/lipstick_texture_crayon.webp';
export const CRAYON_TEXTURE_PATHU =
  '/assets/images/try-on/lips/textures/lipstick_texture_crayon.webp';

export const SHIMMER_TEXTURE_PATHL =
  '/assets/images/try-on/lips/textures/lipstick_texture_shimmer.webp';
export const SHIMMER_TEXTURE_PATHU =
  '/assets/images/try-on/lips/textures/lipstick_texture_shimmer.webp';

export const UPPER_LIP_INDICES = [
  61, 185, 40, 39, 37, 0, 267, 269, 270, 409, 291, 308, 415, 311, 312, 13, 82,
  81, 80, 191, 78,
];
export const LOWER_LIP_INDICES = [
  61, 146, 91, 181, 84, 17, 314, 405, 321, 375, 291, 308, 324, 318, 402, 317,
  14, 87, 178, 88, 95, 78,
];

export const CombinedLipIndices = UPPER_LIP_INDICES.concat(LOWER_LIP_INDICES);
export const LOWER_WHITE_LIP_INDICES2 = [316, 403, 404, 315, 15, 16];
export const LOWER_WHITE_LIP_INDICES3 = [86, 179, 90, 180, 85];
export const LOWER_WHITE_LIP_INDICES4 = [86, 179, 90, 85, 16, 315, 316, 15];

export const UPPER_WHITE_LIP_INDICES2 = [184, 74, 73, 41, 42]; //[302, 303, 304,272, 271,268];
export const UPPER_WHITE_LIP_INDICES3 = [302, 269, 303, 304, 310, 271];

// added

export const LOWER_WHITE_LIP_INDICESFSET = [
  15, 316, 403, 319, 325, 307, 320, 404, 315, 16, 85, 180, 77, 96, 89, 179, 86,
  15,
];
export const UPPER_WHITE_LIP_INDICESFSET = [
  74, 39, 37, 11, 267, 269, 304, 271, 268, 13, 38, 41,
];

export const LOWER_WHITE_LIP_INDICESFSET1_1 = [15, 316, 315, 16];
export const LOWER_WHITE_LIP_INDICESFSET1_2 = [86, 15, 16, 85];

export const LOWER_WHITE_LIP_INDICESFSET2_1 = [316, 403, 404, 315];
export const LOWER_WHITE_LIP_INDICESFSET2_2 = [179, 86, 85, 180];
export const LOWER_WHITE_LIP_INDICESLHSET = [90, 179, 86, 85, 180, 91];

export const LOWER_LIP_DOT_BLUR_AMOUNT = 2.5;

export const left_eyebrow_indices = [
  55, 107, 66, 105, 63, 70, 156, 46, 53, 52, 65, 55,
];

export const right_eyebrow_indices = [
  285, 336, 296, 334, 293, 300, 383, 276, 283, 295, 285,
];

export const left_eyeshadow_indices = [
  226, 247, 30, 29, 27, 28, 56, 190, 243, 173, 157, 158, 159, 160, 161, 246, 33,
  130, 226,
];
export const right_eyeshadow_indices = [
  463, 414, 286, 258, 257, 259, 260, 467, 446, 359, 263, 466, 388, 387, 386,
  385, 384, 398, 362, 463,
];

export const eyeshadow = Array.from(
  new Set([...left_eyeshadow_indices, ...right_eyeshadow_indices])
);

export const pattern_4_thick_indices = {
  name: 'pattern4_thick',
  right_eye: [
    {
      points: [263, 249],
      width: [3, 3, 3, 3],
      webCamWidth: [0.5, 0.5, 0.5, 0.5],
    },
    {
      points: [249, 390],
      width: [3, 3, 3, 3],
      webCamWidth: [0.5, 0.5, 0.5, 0.5],
    },
    {
      points: [390, 373],
      width: [3, 3, 3, 3],
      webCamWidth: [0.5, 0.5, 0.5, 0.5],
    },
    {
      points: [373, 374],
      width: [3, 3, 3, 3],
      webCamWidth: [0.5, 0.5, 0.5, 0.5],
    },
    {
      points: [374, 380],
      width: [3, 3, 3, 3],
      webCamWidth: [0.5, 0.5, 0.5, 0.5],
    },
    {
      points: [380, 381],
      width: [3, 3, 3, 3],
      webCamWidth: [0.5, 0.5, 0.5, 0.5],
    },
    {
      points: [381, 382],
      width: [3, 2, 1, 0.5],
      webCamWidth: [0.5, 0.5, 0.5, 0.5],
    },
    {
      points: [382, 362],
      width: [0.5, 0.3, 0.2, 0.1],
      webCamWidth: [0.5, 0.5, 0.5, 0.5],
    },
  ],
  left_eye: [
    {
      points: [33, 7],
      width: [3, 3, 3, 3],
      webCamWidth: [0.5, 0.5, 0.5, 0.5],
    },
    {
      points: [7, 163],
      width: [3, 3, 3, 3],
      webCamWidth: [0.5, 0.5, 0.5, 0.5],
    },
    {
      points: [163, 144],
      width: [3, 3, 3, 3],
      webCamWidth: [0.5, 0.5, 0.5, 0.5],
    },
    {
      points: [144, 145],
      width: [3, 3, 3, 3],
      webCamWidth: [0.5, 0.5, 0.5, 0.5],
    },
    {
      points: [145, 153],
      width: [3, 3, 3, 3],
      webCamWidth: [0.5, 0.5, 0.5, 0.5],
    },
    {
      points: [153, 154],
      width: [3, 3, 3, 3],
      webCamWidth: [0.5, 0.5, 0.5, 0.5],
    },
    {
      points: [154, 155],
      width: [3, 2, 1, 0.5],
      webCamWidth: [0.5, 0.5, 0.5, 0.5],
    },
    {
      points: [155, 133],
      width: [0.5, 0.3, 0.2, 0.1],
      webCamWidth: [0.5, 0.5, 0.5, 0.5],
    },
  ],
};

export const pattern_4_thin_indices = {
  name: 'pattern4_thin',
  right_eye: [
    {
      points: [263, 249],
      width: [3, 3, 3, 3],
      webCamWidth: [0.15, 0.15, 0.15, 0.15],
    },
    {
      points: [249, 390],
      width: [3, 3, 3, 3],
      webCamWidth: [0.15, 0.15, 0.15, 0.15],
    },
    {
      points: [390, 373],
      width: [3, 3, 3, 3],
      webCamWidth: [0.15, 0.15, 0.15, 0.15],
    },
    {
      points: [373, 374],
      width: [3, 3, 3, 3],
      webCamWidth: [0.15, 0.15, 0.15, 0.15],
    },
    {
      points: [374, 380],
      width: [3, 3, 3, 3],
      webCamWidth: [0.15, 0.15, 0.15, 0.15],
    },
    {
      points: [380, 381],
      width: [3, 3, 3, 3],
      webCamWidth: [0.15, 0.15, 0.15, 0.15],
    },
    {
      points: [381, 382],
      width: [3, 2, 1, 0.5],
      webCamWidth: [0.15, 0.15, 0.15, 0.15],
    },
    {
      points: [382, 362],
      width: [0.5, 0.3, 0.2, 0.1],
      webCamWidth: [0.15, 0.15, 0.15, 0.15],
    },
  ],
  left_eye: [
    {
      points: [33, 7],
      width: [3, 3, 3, 3],
      webCamWidth: [0.15, 0.15, 0.15, 0.15],
    },
    {
      points: [7, 163],
      width: [3, 3, 3, 3],
      webCamWidth: [0.15, 0.15, 0.15, 0.15],
    },
    {
      points: [163, 144],
      width: [3, 3, 3, 3],
      webCamWidth: [0.15, 0.15, 0.15, 0.15],
    },
    {
      points: [144, 145],
      width: [3, 3, 3, 3],
      webCamWidth: [0.15, 0.15, 0.15, 0.15],
    },
    {
      points: [145, 153],
      width: [3, 3, 3, 3],
      webCamWidth: [0.15, 0.15, 0.15, 0.15],
    },
    {
      points: [153, 154],
      width: [3, 3, 3, 3],
      webCamWidth: [0.15, 0.15, 0.15, 0.15],
    },
    {
      points: [154, 155],
      width: [3, 2, 1, 0.5],
      webCamWidth: [0.15, 0.15, 0.15, 0.15],
    },
    {
      points: [155, 133],
      width: [0.5, 0.3, 0.2, 0.1],
      webCamWidth: [0.15, 0.15, 0.15, 0.15],
    },
  ],
};

export const pattern_1_indices = {
  name: 'pattern1',
  right_eye: [
    {
      points: [381, 382],
      width: [0.1, 0.3, 0.4, 0.45],
      webCamWidth: [0.1, 0.3, 0.1, 0.1],
    },
    {
      points: [382, 362],
      width: [0.4, 0.4, 0.1, 0.15],
      webCamWidth: [0.1, 0.2, 0.25, 0.25],
    },
    {
      points: [362, 398],
      width: [0.1, 0.2, 0.5, 0.55],
      webCamWidth: [0.25, 0.3, 0.45, 0.45],
    },
    {
      points: [398, 384],
      width: [1.5, 2, 2.5, 2.55],
      webCamWidth: [0.45, 0.5, 0.65, 0.65],
    },
    {
      points: [384, 385],
      width: [2.5, 3, 3.5, 3.55],
      webCamWidth: [0.65, 0.7, 0.85, 0.85],
    },
    {
      points: [385, 386],
      width: [3.5, 4, 4.5, 4.55],
      webCamWidth: [0.85, 0.9, 1.05, 1.05],
    },
    {
      points: [386, 387],
      width: [4.5, 5, 5.5, 5.55],
      webCamWidth: [1.05, 1.1, 1.25, 1.25],
    },
    {
      points: [387, 388],
      width: [5.5, 6, 6.5, 6.55],
      webCamWidth: [1.25, 1.3, 1.45, 1.45],
    },
    {
      points: [388, 466],
      width: [6.5, 6, 6, 6],
      webCamWidth: [1.45, 1.5, 1.55, 1.55],
    },
    {
      points: [466, 263],
      width: [6, 6, 6, 6],
      webCamWidth: [1.55, 1.55, 1.55, 1.55],
    },
    {
      points: [263, 359],
      width: [4, 3, 2, 1.5],
      webCamWidth: [1, 0.7, 0.5, 0.5],
    },
    {
      points: [359, 342],
      width: [1.5, 1, 0.2, 0.1],
      webCamWidth: [0.5, 0.4, 0.1, 0.1],
    },
  ],
  left_eye: [
    {
      points: [154, 155],
      width: [0.1, 0.3, 0.4, 0.45],
      webCamWidth: [0.1, 0.3, 0.1, 0.1],
    },
    {
      points: [155, 133],
      width: [0.4, 0.4, 0.1, 0.15],
      webCamWidth: [0.1, 0.2, 0.25, 0.25],
    },
    {
      points: [133, 173],
      width: [0.1, 0.2, 0.5, 0.55],
      webCamWidth: [0.25, 0.3, 0.4, 0.4],
    },
    {
      points: [173, 157],
      width: [1.5, 2, 2.5, 2.55],
      webCamWidth: [0.4, 0.5, 0.65, 0.65],
    },
    {
      points: [157, 158],
      width: [2.5, 3, 3.5, 3.55],
      webCamWidth: [0.65, 0.7, 0.85, 0.85],
    },
    {
      points: [158, 159],
      width: [3.5, 4, 4.5, 4.55],
      webCamWidth: [0.85, 0.9, 1.05, 1.05],
    },
    {
      points: [159, 160],
      width: [4.5, 5, 5.5, 5.55],
      webCamWidth: [1.05, 1.1, 1.25, 1.25],
    },
    {
      points: [160, 161],
      width: [5.5, 6, 6.5, 6.55],
      webCamWidth: [1.25, 1.3, 1.45, 1.45],
    },
    {
      points: [161, 246],
      width: [6.5, 6, 6, 6],
      webCamWidth: [1.45, 1.5, 1.55, 1.55],
    },
    {
      points: [246, 33],
      width: [6, 6, 6, 6],
      webCamWidth: [1.55, 1.55, 1.55, 1.55],
    },
    {
      points: [33, 130],
      width: [4, 3, 2, 1.5],
      webCamWidth: [1, 0.7, 0.5, 0.5],
    },
    {
      points: [130, 113],
      width: [1.5, 1, 0.2, 0.1],
      webCamWidth: [0.5, 0.4, 0.1, 0.1],
    },
  ],
};

export const pattern_2_indices = {
  name: 'pattern2',
  right_eye: [
    {
      points: [362, 398],
      width: [0.1, 0.2, 0.5, 0.5],
      webCamWidth: [0.25, 0.3, 0.45, 0.45],
    },
    {
      points: [398, 384],
      width: [1.5, 2, 2.5, 2.5],
      webCamWidth: [0.45, 0.5, 0.65, 0.65],
    },
    {
      points: [384, 385],
      width: [2.5, 3, 3.5, 3.5],
      webCamWidth: [0.65, 0.7, 0.85, 0.85],
    },
    {
      points: [385, 386],
      width: [3.5, 4, 4.5, 4.5],
      webCamWidth: [0.85, 0.9, 1.05, 1.05],
    },
    {
      points: [386, 387],
      width: [4.5, 5, 5.5, 5.5],
      webCamWidth: [1.05, 1.1, 1.25, 1.25],
    },
    {
      points: [387, 388],
      width: [5.5, 6, 6.5, 6.5],
      webCamWidth: [1.25, 1.3, 1.45, 1.45],
    },
    {
      points: [388, 466],
      width: [6.5, 6, 6, 6],
      webCamWidth: [1.45, 1.5, 1.55, 1.55],
    },
    {
      points: [466, 263],
      width: [6, 6, 6, 6],
      webCamWidth: [1.55, 1.55, 1.55, 1.55],
    },
  ],
  left_eye: [
    {
      points: [133, 173],
      width: [0.1, 0.2, 0.5, 0.5],
      webCamWidth: [0.25, 0.3, 0.4, 0.4],
    },
    {
      points: [173, 157],
      width: [1.5, 2, 2.5, 2.5],
      webCamWidth: [0.4, 0.5, 0.65, 0.65],
    },
    {
      points: [157, 158],
      width: [2.5, 3, 3.5, 3.5],
      webCamWidth: [0.65, 0.7, 0.85, 0.85],
    },
    {
      points: [158, 159],
      width: [3.5, 4, 4.5, 4.5],
      webCamWidth: [0.85, 0.9, 1.05, 1.05],
    },
    {
      points: [159, 160],
      width: [4.5, 5, 5.5, 5.5],
      webCamWidth: [1.05, 1.1, 1.25, 1.25],
    },
    {
      points: [160, 161],
      width: [5.5, 6, 6.5, 6.5],
      webCamWidth: [1.25, 1.3, 1.45, 1.45],
    },
    {
      points: [161, 246],
      width: [6.5, 6, 6, 6],
      webCamWidth: [1.45, 1.5, 1.55, 1.55],
    },
    {
      points: [246, 33],
      width: [6, 6, 6, 6],
      webCamWidth: [1.55, 1.55, 1.55, 1.55],
    },
  ],
};

export const pattern_3_indices = {
  name: 'pattern3',
  right_eye: [
    {
      points: [362, 398],
      width: [0.1, 0.2, 0.5, 0.5],
      webCamWidth: [0.1, 0.15, 0.2, 0.25],
    },
    {
      points: [398, 384],
      width: [1.5, 2, 2.5, 2.5],
      webCamWidth: [0.25, 0.3, 0.35, 0.4],
    },
    {
      points: [384, 385],
      width: [1.5, 2, 2.5, 2.5],
      webCamWidth: [0.25, 0.3, 0.35, 0.4],
    },
    {
      points: [385, 386],
      width: [3.5, 4, 4.5, 4.5],
      webCamWidth: [0.6, 0.65, 0.7, 0.75],
    },
    {
      points: [386, 387],
      width: [4.5, 5, 5.5, 5.5],
      webCamWidth: [0.75, 0.8, 0.85, 0.9],
    },
    {
      points: [387, 388],
      width: [5.5, 6, 6.5, 6.5],
      webCamWidth: [0.9, 0.95, 1, 1.5],
    },
    {
      points: [388, 466],
      width: [6.5, 6, 6, 6],
      webCamWidth: [1.5, 1.5, 1.5, 1.5],
    },
    {
      points: [466, 263],
      width: [6, 6, 4, 2],
      webCamWidth: [1.5, 1, 0.8, 0.5],
    },
    {
      points: [263, 353],
      width: [2, 0.1, 0, 0],
      webCamWidth: [0.5, 0.1, 0, 0],
    },
  ],
  left_eye: [
    {
      points: [133, 173],
      width: [0.1, 0.2, 0.5, 0.5],
      webCamWidth: [0.1, 0.15, 0.2, 0.25],
    },
    {
      points: [173, 157],
      width: [1.5, 2, 2.5, 2.5],
      webCamWidth: [0.25, 0.3, 0.35, 0.4],
    },
    {
      points: [157, 158],
      width: [1.5, 2, 2.5, 2.5],
      webCamWidth: [0.25, 0.3, 0.35, 0.4],
    },
    {
      points: [158, 159],
      width: [3.5, 4, 4.5, 4.5],
      webCamWidth: [0.6, 0.65, 0.7, 0.75],
    },
    {
      points: [159, 160],
      width: [4.5, 5, 5.5, 5.5],
      webCamWidth: [0.75, 0.8, 0.85, 0.9],
    },
    {
      points: [160, 161],
      width: [5.5, 6, 6.5, 6.5],
      webCamWidth: [0.9, 0.95, 1, 1.5],
    },
    {
      points: [161, 246],
      width: [6.5, 6, 6, 6],
      webCamWidth: [1.5, 1.5, 1.5, 1.5],
    },
    {
      points: [246, 33],
      width: [6, 6, 4, 2],
      webCamWidth: [1.5, 1, 0.8, 0.5],
    },
    {
      points: [33, 113],
      width: [2, 0.1, 0, 0],
      webCamWidth: [0.5, 0.1, 0, 0],
    },
  ],
};
