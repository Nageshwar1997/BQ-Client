import { LevelTwoCategoryType, LevelOneCategoryType } from "../types";

/* ============= For You Start ============= */
const new_new: LevelTwoCategoryType = {
  level: 2,
  name: "New",
  category: "new",
  subCategories: [{ level: 3, name: "New Arrivals", category: "new_arrivals" }],
};

const sugar_play: LevelTwoCategoryType = {
  level: 2,
  name: "Sugar Play",
  category: "sugar_play",
  subCategories: [{ level: 3, name: "Sugar Play", category: "sugar_play" }],
};

/* ============= For You End ============= */

/* ============= Lips Start ============= */
const finish_types: LevelTwoCategoryType = {
  level: 2,
  name: "Finish Types",
  category: "finish_types",
  subCategories: [
    { level: 3, name: "Matte Lipstick", category: "matte_lipstick" },
    { level: 3, name: "Satin Lipstick", category: "satin_lipstick" },
    { level: 3, name: "Hi-Shine Lipstick", category: "hi_shine_lipstick" },
    { level: 3, name: "Lip Gloss", category: "lip_gloss" },
  ],
};

const lipstick_forms: LevelTwoCategoryType = {
  level: 2,
  name: "Lipstick Forms",
  category: "lipstick_forms",
  subCategories: [
    { level: 3, name: "Liquid Lipstick", category: "liquid_lipstick" },
    { level: 3, name: "Powder Lipstick", category: "powder_lipstick" },
    { level: 3, name: "Crayon Lipstick", category: "crayon_lipstick" },
    { level: 3, name: "Bullet Lipstick", category: "bullet_lipstick" },
  ],
};

const long_lasting_lipsticks: LevelTwoCategoryType = {
  level: 2,
  name: "Long-Lasting Lipsticks",
  category: "long_lasting_lipsticks",
  subCategories: [
    {
      level: 3,
      name: "Transfer Proof Lipstick",
      category: "transfer_proof_lipstick",
    },
    {
      level: 3,
      name: "Water Proof Lipstick",
      category: "water_proof_lipstick",
    },
    { level: 3, name: "Lip Tint & Stain", category: "lip_tint_and_stain" },
    { level: 3, name: "Smudge Proof", category: "smudge_proof_lipstick" },
  ],
};

const lip_care: LevelTwoCategoryType = {
  level: 2,
  name: "Lip Care",
  category: "lip_care",
  subCategories: [
    { level: 3, name: "Lip Primer & Scrub", category: "lip_primer_and_scrub" },
    {
      level: 3,
      name: "Lipstick Fixer & Remover",
      category: "lipstick_fixer_and_remover",
    },
    { level: 3, name: "Lip Balm", category: "lip_balm" },
    { level: 3, name: "Tinted Lip Balm", category: "tinted_lip_balm" },
  ],
};

const lip_enhancers_and_other: LevelTwoCategoryType = {
  level: 2,
  name: "Lip Enhancers & Other",
  category: "lip_enhancers_and_other",
  subCategories: [
    { level: 3, name: "Lip Liner", category: "lip_liner" },
    { level: 3, name: "Lip Glitter", category: "lip_glitter" },
    { level: 3, name: "View All", category: "view_all" },
  ],
};

const lipstick_sets_and_combos: LevelTwoCategoryType = {
  level: 2,
  name: "Lipstick Set & Combo",
  category: "lipstick_set_and_combo",
  subCategories: [
    { level: 3, name: "Lipstick Set", category: "lipstick_set" },
    { level: 3, name: "Lipstick Combo", category: "lipstick_combo" },
    { level: 3, name: "Lip Palette", category: "lip_palette" },
  ],
};
/* ============= Lips End ============= */

/* ============= Eyes Start ============= */

const kohl_and_kajal: LevelTwoCategoryType = {
  level: 2,
  name: "Kohl & Kajal",
  category: "kohl_and_kajal",
  subCategories: [
    { level: 3, name: "Kohl", category: "kohl" },
    { level: 3, name: "Kajal", category: "kajal" },
    { level: 3, name: "Smudge Proof Kajal", category: "smudge_proof_kajal" },
  ],
};

const mascaras: LevelTwoCategoryType = {
  level: 2,
  name: "Mascaras",
  category: "mascaras",
  subCategories: [
    { level: 3, name: "Volumizing Mascara", category: "volumizing_mascara" },
    {
      level: 3,
      name: "Curl Lengthening Mascara",
      category: "curl_lengthening_mascara",
    },
    { level: 3, name: "Waterproof Mascara", category: "waterproof_mascara" },
  ],
};

const eyeliners: LevelTwoCategoryType = {
  level: 2,
  name: "Eyeliners",
  category: "eyeliners",
  subCategories: [
    { level: 3, name: "Liquid Eyeliner", category: "liquid_eyeliner" },
    { level: 3, name: "Gel Eyeliner", category: "gel_eyeliner" },
    { level: 3, name: "Pen Eyeliner", category: "pen_eyeliner" },
  ],
};

const eyeshadow: LevelTwoCategoryType = {
  level: 2,
  name: "Eyeshadow",
  category: "eyeshadow",
  subCategories: [
    { level: 3, name: "Eyeshadow Palette", category: "eyeshadow_palette" },
    { level: 3, name: "Liquid Eyeshadow", category: "liquid_eyeshadow" },
    { level: 3, name: "Glitter Eyeshadow", category: "glitter_eyeshadow" },
  ],
};

const eyebrows: LevelTwoCategoryType = {
  level: 2,
  name: "Eyebrows",
  category: "eyebrows",
  subCategories: [
    { level: 3, name: "Brow Definer", category: "brow_definer" },
    { level: 3, name: "Brow Pencil", category: "brow_pencil" },
    { level: 3, name: "Brow Gel", category: "brow_gel" },
  ],
};

const eye_value_set: LevelTwoCategoryType = {
  level: 2,
  name: "Eye Value Set",
  category: "eye_value_set",
  subCategories: [
    { level: 3, name: "Eyelashes", category: "eyelashes" },
    { level: 3, name: "Eye Gift Set", category: "eye_gift_set" },
    { level: 3, name: "Eye Combo", category: "eye_combo" },
  ],
};

/* ============= Eyes End ============= */

/* ============= Face Start ============= */
const face_makeup: LevelTwoCategoryType = {
  level: 2,
  name: "Face Makeup",
  category: "face_makeup",
  subCategories: [
    { level: 3, name: "Foundation", category: "foundation" },
    { level: 3, name: "BB Cream", category: "bb_cream" },
    { level: 3, name: "Compact Powder", category: "compact_powder" },
    { level: 3, name: "Loose Powder", category: "loose_powder" },
    { level: 3, name: "Banana Powder", category: "banana_powder" },
    { level: 3, name: "SPF Foundation", category: "spf_foundation" },
  ],
};

const traditional_and_essentials: LevelTwoCategoryType = {
  level: 2,
  name: "Traditional & Essentials",
  category: "traditional_and_essentials",
  subCategories: [{ level: 3, name: "Sindoor", category: "sindoor" }],
};

const cheeks_and_glow: LevelTwoCategoryType = {
  level: 2,
  name: "Cheeks & Glow",
  category: "cheeks_and_glow",
  subCategories: [
    { level: 3, name: "Highlighter", category: "highlighter" },
    { level: 3, name: "Liquid Highlighter", category: "liquid_highlighter" },
    { level: 3, name: "Blush", category: "blush" },
    { level: 3, name: "Cheek Stain", category: "cheek_stain" },
  ],
};

const setting_and_finishing: LevelTwoCategoryType = {
  level: 2,
  name: "Setting & Finishing",
  category: "setting_and_finishing",
  subCategories: [
    { level: 3, name: "Setting Spray", category: "setting_spray" },
    { level: 3, name: "Compact", category: "compact" },
    { level: 3, name: "Fixer", category: "fixer" },
  ],
};

const foundations_by_finish: LevelTwoCategoryType = {
  level: 2,
  name: "Foundations by Finish",
  category: "foundations_by_finish",
  subCategories: [
    { level: 3, name: "Liquid Foundation", category: "liquid_foundation" },
    { level: 3, name: "Matte Foundation", category: "matte_foundation" },
    {
      level: 3,
      name: "Water Resistant Foundation",
      category: "water_resistant_foundation",
    },
    {
      level: 3,
      name: "High Coverage Foundation",
      category: "high_coverage_foundation",
    },
    { level: 3, name: "Stick Foundation", category: "stick_foundation" },
  ],
};

const foundations_by_skin_type: LevelTwoCategoryType = {
  level: 2,
  name: "Foundations by Skin Type",
  category: "foundations_by_skin_type",
  subCategories: [
    { level: 3, name: "Best for Dry Skin", category: "best_for_dry_skin" },
    { level: 3, name: "Best for Oily Skin", category: "best_for_oily_skin" },
  ],
};

const primers_and_removers: LevelTwoCategoryType = {
  level: 2,
  name: "Primers & Removers",
  category: "primers_and_removers",
  subCategories: [
    { level: 3, name: "Makeup Remover", category: "makeup_remover" },
    { level: 3, name: "Primer", category: "primer" },
  ],
};

const bronzers_and_contours: LevelTwoCategoryType = {
  level: 2,
  name: "Bronzers & Contours",
  category: "bronzers_and_contours",
  subCategories: [
    { level: 3, name: "Bronzer", category: "bronzer" },
    { level: 3, name: "Contour", category: "contour" },
  ],
};

const concealers_and_correctors: LevelTwoCategoryType = {
  level: 2,
  name: "Concealers & Correctors",
  category: "concealers_and_correctors",
  subCategories: [
    { level: 3, name: "Color Concealer", category: "color_concealer" },
    { level: 3, name: "Color Corrector", category: "color_corrector" },
  ],
};

/* ============= Face End ============= */

/* ============= Skin Start ============= */
const moisturizers: LevelTwoCategoryType = {
  level: 2,
  name: "Moisturizers",
  category: "moisturizers",
  subCategories: [
    { level: 3, name: "Night Cream", category: "night_cream" },
    { level: 3, name: "Eye Cream", category: "eye_cream" },
    { level: 3, name: "Serum", category: "serum" },
    { level: 3, name: "Skincare Kit", category: "skincare_kit" },
  ],
};

const cleansing_and_exfoliation: LevelTwoCategoryType = {
  level: 2,
  name: "Cleansing & Exfoliation",
  category: "cleansing_and_exfoliation",
  subCategories: [
    { level: 3, name: "Cleanser", category: "cleanser" },
    { level: 3, name: "Face Wash", category: "face_wash" },
    { level: 3, name: "Exfoliator & Scrub", category: "exfoliator_and_scrub" },
    { level: 3, name: "Sunscreen", category: "sunscreen" },
  ],
};

const natures_blend: LevelTwoCategoryType = {
  level: 2,
  name: "Nature's Blend",
  category: "natures_blend",
  subCategories: [
    { level: 3, name: "Aquaholic", category: "aquaholic" },
    { level: 3, name: "Coffee Culture", category: "coffee_culture" },
    { level: 3, name: "Citrus Got Real", category: "citrus_got_real" },
    { level: 3, name: "View All", category: "view_all" },
  ],
};

const face_mask: LevelTwoCategoryType = {
  level: 2,
  name: "Face Mask",
  category: "face_mask",
  subCategories: [
    { level: 3, name: "Sheet Mask", category: "sheet_mask" },
    { level: 3, name: "Face Pack", category: "face_pack" },
    { level: 3, name: "View All", category: "view_all" },
  ],
};

/* ============= Skin End ============= */

/* ============= Collections Start ============= */
const bath_and_body: LevelTwoCategoryType = {
  level: 2,
  name: "Bath & Body",
  category: "bath_and_body",
  subCategories: [
    { level: 3, name: "Shower Gel", category: "shower_gel" },
    { level: 3, name: "Soap", category: "soap" },
    { level: 3, name: "Body Lotion", category: "body_lotion" },
    { level: 3, name: "Body Spray", category: "body_spray" },
    { level: 3, name: "Hand Wash", category: "hand_wash" },
    { level: 3, name: "Foot Cream", category: "foot_cream" },
    { level: 3, name: "Hand Cream", category: "hand_cream" },
  ],
};

const sugar_pop: LevelTwoCategoryType = {
  level: 2,
  name: "Sugar Pop",
  category: "sugar_pop",
  subCategories: [
    { level: 3, name: "Lips", category: "lips" },
    { level: 3, name: "Eyes", category: "eyes" },
    { level: 3, name: "Face", category: "face" },
    { level: 3, name: "Nails", category: "nails" },
    { level: 3, name: "Skincare", category: "skincare" },
    { level: 3, name: "Body Care", category: "body_care" },
    { level: 3, name: "Best of Sugar Pop", category: "best_of_sugar_pop" },
  ],
};

const hair_care: LevelTwoCategoryType = {
  level: 2,
  name: "Hair Care",
  category: "hair_care",
  subCategories: [
    { level: 3, name: "Shampoo", category: "shampoo" },
    { level: 3, name: "Conditioner", category: "conditioner" },
    { level: 3, name: "Hair Oil", category: "hair_oil" },
    { level: 3, name: "Serum", category: "serum" },
    { level: 3, name: "Hair Mask", category: "hair_mask" },
    { level: 3, name: "Combo", category: "combo" },
    { level: 3, name: "View All", category: "view_all" },
  ],
};

const gifting: LevelTwoCategoryType = {
  level: 2,
  name: "Gifting",
  category: "gifting",
  subCategories: [
    { level: 3, name: "Lipstick Set", category: "lipstick_set" },
    { level: 3, name: "Sugar Merch", category: "sugar_merch" },
    { level: 3, name: "Value Set", category: "value_set" },
    { level: 3, name: "Makeup Kit", category: "makeup_kit" },
    { level: 3, name: "Corporate Gifting", category: "corporate_gifting" },
    { level: 3, name: "Sugar Set", category: "sugar_set" },
  ],
};

/* ============= Collections End ============= */

export const CATEGORIES_DATA: LevelOneCategoryType[] = [
  {
    level: 1,
    name: "For You",
    category: "for_you",
    subCategories: [new_new, sugar_play], // only new is reserved keyword we can't use new
  },
  {
    level: 1,
    name: "Lips",
    category: "lips",
    subCategories: [
      finish_types,
      lipstick_forms,
      long_lasting_lipsticks,
      lip_care,
      lip_enhancers_and_other,
      lipstick_sets_and_combos,
    ],
  },
  {
    level: 1,
    name: "Eyes",
    category: "eyes",
    subCategories: [
      kohl_and_kajal,
      mascaras,
      eyeliners,
      eyeshadow,
      eyebrows,
      eye_value_set,
    ],
  },
  {
    level: 1,
    name: "Face",
    category: "face",
    subCategories: [
      face_makeup,
      traditional_and_essentials,
      cheeks_and_glow,
      setting_and_finishing,
      primers_and_removers,
      bronzers_and_contours,
      concealers_and_correctors,
      foundations_by_skin_type,
      foundations_by_finish,
    ],
  },
  {
    level: 1,
    name: "Skin",
    category: "skin",
    subCategories: [
      moisturizers,
      cleansing_and_exfoliation,
      natures_blend,
      face_mask,
    ],
  },
  {
    level: 1,
    name: "Collections",
    category: "collections",
    subCategories: [bath_and_body, sugar_pop, hair_care, gifting],
  },
];
