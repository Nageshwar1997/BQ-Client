import { LevelTwoCategoryType } from "../../types";
import {
  BrowDefinerIcon,
  BrowGelIcon,
  BrowPencilIcon,
  CurlLengtheningMascaraIcon,
  EyeComboIcon,
  EyeGiftSetIcon,
  EyelashesIcon,
  EyeshadowPaletteIcon,
  GelEyelinerIcon,
  GlitterEyeshadow,
  KajalIcon,
  KohlIcon,
  LiquidEyelinerIcon,
  LiquidEyeshadow,
  PenEyelinerIcon,
  SmudgeProofKajalIcon,
  VolumizingMascaraIcon,
  WaterproofMascara,
} from "../icons";

const basePath = "/eyes";

export const kohl_and_kajal: LevelTwoCategoryType = {
  id: 1,
  level: 2,
  label: "Kohl & Kajal",
  category: "kohl_and_kajal",
  path: `${basePath}/kohl-and-kajal`,
  subCategories: [
    {
      id: 1,
      level: 3,
      label: "Kohl",
      category: "kohl",
      path: `${basePath}/kohl-and-kajal/kohl`,
      icon: KohlIcon,
      description:
        "Intensely pigmented kohls for bold, long-lasting eye definition all day.",
    },
    {
      id: 2,
      level: 3,
      label: "Kajal",
      category: "kajal",
      path: `${basePath}/kohl-and-kajal/kajal`,
      icon: KajalIcon,
      description:
        "Smooth kajals for a dramatic look, perfect for waterline application.",
    },
    {
      id: 3,
      level: 3,
      label: "Smudge Proof Kajal",
      category: "smudge_proof_kajal",
      path: `${basePath}/kohl-and-kajal/smudge-proof-kajal`,
      icon: SmudgeProofKajalIcon,
      description:
        "Long-lasting, smudge-proof kajal for sharp, defined eyes all day long.",
    },
  ],
};

export const mascaras: LevelTwoCategoryType = {
  id: 2,
  level: 2,
  label: "Mascaras",
  category: "mascaras",
  path: `${basePath}/mascaras`,
  subCategories: [
    {
      id: 1,
      level: 3,
      label: "Volumizing Mascara",
      category: "volumizing_mascara",
      path: `${basePath}/mascaras/volumizing-mascara`,
      icon: VolumizingMascaraIcon,
      description:
        "Boosts lash volume for a fuller, more dramatic look with each coat.",
    },
    {
      id: 2,
      level: 3,
      label: "Curl Lengthening Mascara",
      category: "curl_lengthening_mascara",
      path: `${basePath}/mascaras/curl-lengthening-mascara`,
      icon: CurlLengtheningMascaraIcon,
      description:
        "Lifts and curls lashes for a wide-eyed look with added length and volume.",
    },
    {
      id: 3,
      level: 3,
      label: "Waterproof Mascara",
      category: "waterproof_mascara",
      path: `${basePath}/mascaras/waterproof-mascara`,
      icon: WaterproofMascara,
      description:
        "Water-resistant formula for long-lasting wear without smudging or flaking.",
    },
  ],
};

export const eyeliners: LevelTwoCategoryType = {
  id: 3,
  level: 2,
  label: "Eyeliners",
  category: "eyeliners",
  path: `${basePath}/eyeliners`,
  subCategories: [
    {
      id: 1,
      level: 3,
      label: "Liquid Eyeliner",
      category: "liquid_eyeliner",
      path: `${basePath}/eyeliners/liquid-eyeliner`,
      icon: LiquidEyelinerIcon,
      description:
        "Precision tip for sharp lines, perfect for bold cat-eye or winged looks.",
    },
    {
      id: 2,
      level: 3,
      label: "Gel Eyeliner",
      category: "gel_eyeliner",
      path: `${basePath}/eyeliners/gel-eyeliner`,
      icon: GelEyelinerIcon,
      description:
        "Creamy, blendable gel eyeliner for versatile looks, from bold to subtle.",
    },
    {
      id: 3,
      level: 3,
      label: "Pen Eyeliner",
      category: "pen_eyeliner",
      path: `${basePath}/eyeliners/pen-eyeliner`,
      icon: PenEyelinerIcon,
      description:
        "Easy-to-use pen for precise lines, ideal for beginners and quick touch-ups.",
    },
  ],
};

export const eyeshadow: LevelTwoCategoryType = {
  id: 4,
  level: 2,
  label: "Eyeshadow",
  category: "eyeshadow",
  path: `${basePath}/eyeshadow`,
  subCategories: [
    {
      id: 1,
      level: 3,
      label: "Eyeshadow Palette",
      category: "eyeshadow_palette",
      path: `${basePath}/eyeshadow/eyeshadow-palette`,
      icon: EyeshadowPaletteIcon,
      description:
        "Versatile palettes with coordinated shades for endless eye makeup looks.",
    },
    {
      id: 2,
      level: 3,
      label: "Liquid Eyeshadow",
      category: "liquid_eyeshadow",
      path: `${basePath}/eyeshadow/liquid-eyeshadow`,
      icon: LiquidEyeshadow,
      description:
        "High-pigment liquid shadows for easy application and long-lasting shimmer.",
    },
    {
      id: 3,
      level: 3,
      label: "Glitter Eyeshadow",
      category: "glitter_eyeshadow",
      path: `${basePath}/eyeshadow/glitter-eyeshadow`,
      icon: GlitterEyeshadow,
      description:
        "Sparkling glitter shadows for a bold, glamorous look on special occasions.",
    },
  ],
};

export const eyebrows: LevelTwoCategoryType = {
  id: 5,
  level: 2,
  label: "Eyebrows",
  category: "eyebrows",
  path: `${basePath}/eyebrows`,
  subCategories: [
    {
      id: 1,
      level: 3,
      label: "Brow Definer",
      category: "brow_definer",
      path: `${basePath}/eyebrows/brow-definer`,
      icon: BrowDefinerIcon,
      description:
        "Defines brows with precision for a well-groomed and polished appearance.",
    },
    {
      id: 2,
      level: 3,
      label: "Brow Pencil",
      category: "brow_pencil",
      path: `${basePath}/eyebrows/brow-pencil`,
      icon: BrowPencilIcon,
      description:
        "Easy-to-use pencil for filling and shaping brows with natural-looking color.",
    },
    {
      id: 3,
      level: 3,
      label: "Brow Gel",
      category: "brow_gel",
      path: `${basePath}/eyebrows/brow-gel`,
      icon: BrowGelIcon,
      description:
        "Sets and tames brows, providing a long-lasting hold with a natural finish.",
    },
  ],
};

export const eye_value_set: LevelTwoCategoryType = {
  id: 6,
  level: 2,
  label: "Eye Value Set",
  category: "eye_value_set",
  path: `${basePath}/eye-value-set`,
  subCategories: [
    {
      id: 1,
      level: 3,
      label: "Eyelashes",
      category: "eyelashes",
      path: `${basePath}/eye-value-set/eyelashes`,
      icon: EyelashesIcon,
      description:
        "Enhance your eyes with faux lashes for added volume and captivating charm.",
    },
    {
      id: 2,
      level: 3,
      label: "Eye Gift Set",
      category: "eye_gift_set",
      path: `${basePath}/eye-value-set/eye-gift-set`,
      icon: EyeGiftSetIcon,
      description:
        "Perfect gift sets featuring popular eye products for makeup lovers' delight.",
    },
    {
      id: 3,
      level: 3,
      label: "Eye Combo",
      category: "eye_combo",
      path: `${basePath}/eye-value-set/eye-combo`,
      icon: EyeComboIcon,
      description:
        "Convenient sets with eye essentials for a complete, coordinated eye look.",
    },
  ],
};

export const highlightedEyesOptions: string[] = [
  "kohl",
  "curl_lengthening_mascara",
  "liquid_eyeliner",
  "glitter_eyeshadow",
  "brow_pencil",
  "eye_combo",
];
