import { LevelTwoCategoryType } from "../../types";
import {
  BananaPowderIcon,
  BBCreamIcon,
  BestForDrySkinIcon,
  BestForOilySkinIcon,
  BlushIcon,
  BronzerIcon,
  CheekStainIcon,
  ColorConcealerIcon,
  ColorCorrectorIcon,
  CompactIcon,
  CompactPowderIcon,
  ContourIcon,
  FixerIcon,
  FoundationIcon,
  HighCoverageFoundationIcon,
  HighlighterIcon,
  LiquidFoundationIcon,
  LiquidHighlighterIcon,
  LoosePowderIcon,
  MakeupRemoverIcon,
  MatteFoundationIcon,
  PrimerIcon,
  SettingSprayIcon,
  SindoorIcon,
  SPFFoundationIcon,
  StickFoundationIcon,
  WaterResistantFoundationIcon,
} from "../icons";

const basePath = "/face";

export const face_makeup: LevelTwoCategoryType = {
  id: 1,
  level: 2,
  label: "Face Makeup",
  category: "face_makeup",
  path: `${basePath}/face-makeup`,
  subCategories: [
    {
      id: 1,
      level: 3,
      label: "Foundation",
      category: "foundation",
      path: `${basePath}/face-makeup/foundation`,
      icon: FoundationIcon,
      description:
        "Provides coverage for a flawless base with a natural, smooth finish.",
    },
    {
      id: 2,
      level: 3,
      label: "BB Cream",
      category: "bb_cream",
      path: `${basePath}/face-makeup/bb-cream`,
      icon: BBCreamIcon,
      description:
        "Lightweight formula that hydrates, evens skin tone, and protects skin.",
    },
    {
      id: 3,
      level: 3,
      label: "Compact Powder",
      category: "compact_powder",
      path: `${basePath}/face-makeup/compact-powder`,
      icon: CompactPowderIcon,
      description:
        "Sets makeup, reduces shine, and ensures a long-lasting matte finish.",
    },
    {
      id: 4,
      level: 3,
      label: "Loose Powder",
      category: "loose_powder",
      path: `${basePath}/face-makeup/loose-powder`,
      icon: LoosePowderIcon,
      description:
        "Finely milled powder for a smooth, shine-free finish that lasts all day.",
    },
    {
      id: 5,
      level: 3,
      label: "Banana Powder",
      category: "banana_powder",
      path: `${basePath}/face-makeup/banana-powder`,
      icon: BananaPowderIcon,
      description:
        "Brightens the complexion, reduces shine, and sets makeup beautifully.",
    },
    {
      id: 6,
      level: 3,
      label: "SPF Foundation",
      category: "spf_foundation",
      path: `${basePath}/face-makeup/spf-foundation`,
      icon: SPFFoundationIcon,
      description:
        "Combines sun protection, coverage for a flawless, radiant look.",
    },
  ],
};

export const traditional_and_essentials: LevelTwoCategoryType = {
  id: 2,
  level: 2,
  label: "Traditional & Essentials",
  category: "traditional_and_essentials",
  path: `${basePath}/traditional-and-essentials`,
  subCategories: [
    {
      id: 1,
      level: 3,
      label: "Sindoor",
      category: "sindoor",
      path: `${basePath}/traditional-and-essentials/sindoor`,
      icon: SindoorIcon,
      description:
        "Symbolic powder for the hairline, enhancing traditional elegance.",
    },
  ],
};

export const cheeks_and_glow: LevelTwoCategoryType = {
  id: 3,
  level: 2,
  label: "Cheeks & Glow",
  category: "cheeks_and_glow",
  path: `${basePath}/cheeks-and-glow`,
  subCategories: [
    {
      id: 1,
      level: 3,
      label: "Highlighter",
      category: "highlighter",
      path: `${basePath}/cheeks-and-glow/highlighter`,
      icon: HighlighterIcon,
      description:
        "Adds a radiant, enhancing features with a luminous, dewy look.",
    },
    {
      id: 2,
      level: 3,
      label: "Liquid Highlighter",
      category: "liquid_highlighter",
      path: `${basePath}/cheeks-and-glow/liquid-highlighter`,
      icon: LiquidHighlighterIcon,
      description:
        "Blendable liquid formula for a glowing, buildable, natural look.",
    },
    {
      id: 3,
      level: 3,
      label: "Blush",
      category: "blush",
      path: `${basePath}/cheeks-and-glow/blush`,
      icon: BlushIcon,
      description:
        "Adds a pop of color to cheeks, creating a youthful, healthy look.",
    },
    {
      id: 4,
      level: 3,
      label: "Cheek Stain",
      category: "cheek_stain",
      path: `${basePath}/cheeks-and-glow/cheek-stain`,
      icon: CheekStainIcon,
      description:
        "Long-lasting tint for a natural, flushed look that stays vibrant.",
    },
  ],
};

export const setting_and_finishing: LevelTwoCategoryType = {
  id: 4,
  level: 2,
  label: "Setting & Finishing",
  category: "setting_and_finishing",
  path: `${basePath}/setting-and-finishing`,
  subCategories: [
    {
      id: 1,
      level: 3,
      label: "Setting Spray",
      category: "setting_spray",
      path: `${basePath}/setting-and-finishing/setting-spray`,
      icon: SettingSprayIcon,
      description:
        "Locks makeup for long wear, maintaining a fresh look without.",
    },
    {
      id: 2,
      level: 3,
      label: "Compact",
      category: "compact",
      path: `${basePath}/setting-and-finishing/compact`,
      icon: CompactIcon,
      description:
        "Portable powder for touch-ups, controls shine, sets makeup place.",
    },
    {
      id: 3,
      level: 3,
      label: "Fixer",
      category: "fixer",
      path: `${basePath}/setting-and-finishing/fixer`,
      icon: FixerIcon,
      description:
        "Enhances makeup longevity, ensuring a smudge-proof, flawless.",
    },
  ],
};

export const foundations_by_finish: LevelTwoCategoryType = {
  id: 5,
  level: 2,
  label: "Foundations by Finish",
  category: "foundations_by_finish",
  path: `${basePath}/foundations-by-finish`,
  subCategories: [
    {
      id: 1,
      level: 3,
      label: "Liquid Foundation",
      category: "liquid_foundation",
      path: `${basePath}/foundations-by-finish/liquid-foundation`,
      icon: LiquidFoundationIcon,
      description:
        "Buildable coverage with a natural finish that blends seamlessly skin.",
    },
    {
      id: 2,
      level: 3,
      label: "Matte Foundation",
      category: "matte_foundation",
      path: `${basePath}/foundations-by-finish/matte-foundation`,
      icon: MatteFoundationIcon,
      description:
        "Oil-absorbing formula for a shine-free, velvety matte look lasts.",
    },
    {
      id: 3,
      level: 3,
      label: "Water Resistant Foundation",
      category: "water_resistant_foundation",
      path: `${basePath}/foundations-by-finish/water-resistant-foundation`,
      icon: WaterResistantFoundationIcon,
      description:
        "Long-wearing, water-resistant foundation that stays flawless day.",
    },
    {
      id: 4,
      level: 3,
      label: "High Coverage Foundation",
      category: "high_coverage_foundation",
      path: `${basePath}/foundations-by-finish/high-coverage-foundation`,
      icon: HighCoverageFoundationIcon,
      description:
        "Conceals imperfections with full coverage, ensuring flawless look.",
    },
    {
      id: 5,
      level: 3,
      label: "Stick Foundation",
      category: "stick_foundation",
      path: `${basePath}/foundations-by-finish/stick-foundation`,
      icon: StickFoundationIcon,
      description:
        "Convenient stick format for easy application and buildable coverage.",
    },
  ],
};

export const foundations_by_skin_type: LevelTwoCategoryType = {
  id: 6,
  level: 2,
  label: "Foundations by Skin Type",
  category: "foundations_by_skin_type",
  path: `${basePath}/foundations-by-skin-type`,
  subCategories: [
    {
      id: 1,
      level: 3,
      label: "Best for Dry Skin",
      category: "best_for_dry_skin",
      path: `${basePath}/foundations-by-skin-type/best-for-dry-skin`,
      icon: BestForDrySkinIcon,
      description:
        "Hydrating formula that nourishes and enhances radiance for dry skin.",
    },
    {
      id: 2,
      level: 3,
      label: "Best for Oily Skin",
      category: "best_for_oily_skin",
      path: `${basePath}/foundations-by-skin-type/best-for-oily-skin`,
      icon: BestForOilySkinIcon,
      description:
        "Oil-controlling foundation that reduces shine, prevents breakouts.",
    },
  ],
};

export const primers_and_removers: LevelTwoCategoryType = {
  id: 7,
  level: 2,
  label: "Primers & Removers",
  category: "primers_and_removers",
  path: `${basePath}/primers-and-removers`,
  subCategories: [
    {
      id: 1,
      level: 3,
      label: "Makeup Remover",
      category: "makeup_remover",
      path: `${basePath}/primers-and-removers/makeup-remover`,
      icon: MakeupRemoverIcon,
      description:
        "Gently removes makeup while hydrating and refreshing the skin.",
    },
    {
      id: 2,
      level: 3,
      label: "Primer",
      category: "primer",
      path: `${basePath}/primers-and-removers/primer`,
      icon: PrimerIcon,
      description:
        "Prepares skin, creating a smooth base for long-lasting makeup.",
    },
  ],
};

export const bronzers_and_contours: LevelTwoCategoryType = {
  id: 8,
  level: 2,
  label: "Bronzers & Contours",
  category: "bronzers_and_contours",
  path: `${basePath}/bronzers-and-contours`,
  subCategories: [
    {
      id: 1,
      level: 3,
      label: "Bronzer",
      category: "bronzer",
      path: `${basePath}/bronzers-and-contours/bronzer`,
      icon: BronzerIcon,
      description:
        "Adds warmth and a sun-kissed glow for a radiant complexion.",
    },
    {
      id: 2,
      level: 3,
      label: "Contour",
      category: "contour",
      path: `${basePath}/bronzers-and-contours/contour`,
      icon: ContourIcon,
      description:
        "Defines features with shadows, enhancing structure and depth.",
    },
  ],
};

export const concealers_and_correctors: LevelTwoCategoryType = {
  id: 9,
  level: 2,
  label: "Concealers & Correctors",
  category: "concealers_and_correctors",
  path: `${basePath}/concealers-and-correctors`,
  subCategories: [
    {
      id: 1,
      level: 3,
      label: "Color Concealer",
      category: "color_concealer",
      path: `${basePath}/concealers-and-correctors/color-concealer`,
      icon: ColorConcealerIcon,
      description:
        "It covers flaws with precision, delivering a flawless, airbrushed.",
    },
    {
      id: 2,
      level: 3,
      label: "Color Corrector",
      category: "color_corrector",
      path: `${basePath}/concealers-and-correctors/color-corrector`,
      icon: ColorCorrectorIcon,
      description:
        "Neutralizes discoloration, balancing skin tone for a radiant finish.",
    },
  ],
};

export const highlightedFaceOptions: string[] = [
  "color_corrector",
  "compact",
  "makeup_remover",
  "matte_foundation",
  "cheek_stain",
  "sindoor",
  "compact_powder",
];
