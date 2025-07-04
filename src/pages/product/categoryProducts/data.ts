interface SubCategory {
  category: string;
  img: string;
  subCategories?: SubCategory[]; // Recursive
}
interface CategoryImageEntry {
  category: string;
  img: string;
  subCategories: SubCategory[];
}

type CategoryImageDataType = {
  [key: string]: CategoryImageEntry;
};

/* ============================== FOR_YOU START ============================== */

/* ==================== SUB-CATEGORIES ==================== */
const new_new = {
  category: "new",
  img: "https://res.cloudinary.com/drbhw0nwt/image/upload/f_auto,q_auto/v1751646152/Beautinique/Category_Images/7-4-2025_1751646152150_New.webp",
  subCategories: [
    {
      category: "new_arrivals",
      img: "https://res.cloudinary.com/drbhw0nwt/image/upload/f_auto,q_auto/v1751646152/Beautinique/Category_Images/7-4-2025_1751646152150_New.webp",
    },
  ],
};

const sugar_play = {
  category: "sugar_play",
  img: "https://res.cloudinary.com/drbhw0nwt/image/upload/f_auto,q_auto/v1751646152/Beautinique/Category_Images/7-4-2025_1751646152166_Sugar_Play.webp",
  subCategories: [
    {
      category: "sugar_play",
      img: "https://res.cloudinary.com/drbhw0nwt/image/upload/f_auto,q_auto/v1751646152/Beautinique/Category_Images/7-4-2025_1751646152166_Sugar_Play.webp",
    },
  ],
};

/* ============================== MAIN FOR_YOU CATEGORY ============================== */
const for_you = {
  category: "for_you",
  img: "https://res.cloudinary.com/drbhw0nwt/image/upload/f_auto,q_auto/v1751646152/Beautinique/Category_Images/7-4-2025_1751646152150_New.webp",
  subCategories: [new_new, sugar_play],
};
/* ============================== FOR_YOU END ============================== */

/* ============================== LIPS START ============================== */
/* ==================== SUB-CATEGORIES ==================== */
const finish_types = {
  category: "finish_types",
  img: "https://res.cloudinary.com/drbhw0nwt/image/upload/f_auto,q_auto/v1751647122/Beautinique/Category_Images/7-4-2025_1751647122238_Lipsticks.webp",
  subCategories: [
    {
      category: "matte_lipstick",
      img: "https://res.cloudinary.com/drbhw0nwt/image/upload/f_auto,q_auto/v1751647020/Beautinique/Category_Images/7-4-2025_1751647020348_Lips.webp",
    },
    {
      category: "satin_lipstick",
      img: "https://res.cloudinary.com/drbhw0nwt/image/upload/f_auto,q_auto/v1751652153/Beautinique/Category_Images/7-4-2025_1751652153458_Collection.webp",
    },
    {
      category: "hi_shine_lipstick",
      img: "https://res.cloudinary.com/drbhw0nwt/image/upload/f_auto,q_auto/v1751652153/Beautinique/Category_Images/7-4-2025_1751652153458_Collection.webp",
    },
    {
      category: "lip_gloss",
      img: "https://res.cloudinary.com/drbhw0nwt/image/upload/f_auto,q_auto/v1751647020/Beautinique/Category_Images/7-4-2025_1751647020348_Lips.webp",
    },
  ],
};

const lipstick_forms = {
  category: "lipstick_forms",
  img: "https://res.cloudinary.com/drbhw0nwt/image/upload/f_auto,q_auto/v1751652153/Beautinique/Category_Images/7-4-2025_1751652153458_Collection.webp",
  subCategories: [
    {
      category: "liquid_lipstick",
      img: "https://res.cloudinary.com/drbhw0nwt/image/upload/f_auto,q_auto/v1751647020/Beautinique/Category_Images/7-4-2025_1751647020348_Lips.webp",
    },
    {
      category: "powder_lipstick",
      img: "https://res.cloudinary.com/drbhw0nwt/image/upload/f_auto,q_auto/v1751647408/Beautinique/Category_Images/7-4-2025_1751647408012_Powder.webp",
    },
    {
      category: "crayon_lipstick",
      img: "https://res.cloudinary.com/drbhw0nwt/image/upload/f_auto,q_auto/v1751647408/Beautinique/Category_Images/7-4-2025_1751647408012_Powder.webp",
    },
    {
      category: "bullet_lipstick",
      img: "https://res.cloudinary.com/drbhw0nwt/image/upload/f_auto,q_auto/v1751647408/Beautinique/Category_Images/7-4-2025_1751647408012_Powder.webp",
    },
  ],
};

const long_lasting_lipsticks = {
  category: "long_lasting_lipsticks",
  img: "https://res.cloudinary.com/drbhw0nwt/image/upload/f_auto,q_auto/v1751652153/Beautinique/Category_Images/7-4-2025_1751652153480_La-La-Love.webp",
  subCategories: [
    {
      category: "transfer_proof_lipstick",
      img: "https://res.cloudinary.com/drbhw0nwt/image/upload/f_auto,q_auto/v1751647020/Beautinique/Category_Images/7-4-2025_1751647020348_Lips.webp",
    },
    {
      category: "water_proof_lipstick",
      img: "https://res.cloudinary.com/drbhw0nwt/image/upload/f_auto,q_auto/v1751652153/Beautinique/Category_Images/7-4-2025_1751652153480_La-La-Love.webp",
    },
    {
      category: "lip_tint_and_stain",
      img: "https://res.cloudinary.com/drbhw0nwt/image/upload/f_auto,q_auto/v1751652153/Beautinique/Category_Images/7-4-2025_1751652153480_La-La-Love.webp",
    },
    {
      category: "smudge_proof_lipstick",
      img: "https://res.cloudinary.com/drbhw0nwt/image/upload/f_auto,q_auto/v1751652153/Beautinique/Category_Images/7-4-2025_1751652153480_La-La-Love.webp",
    },
  ],
};

const lip_care = {
  category: "lip_care",
  img: "https://res.cloudinary.com/drbhw0nwt/image/upload/f_auto,q_auto/v1751647020/Beautinique/Category_Images/7-4-2025_1751647020348_Lips.webp",
  subCategories: [
    {
      category: "lip_primer_and_scrub",
      img: "https://res.cloudinary.com/drbhw0nwt/image/upload/f_auto,q_auto/v1751650181/Beautinique/Category_Images/7-4-2025_1751650181649_Primer.webp",
    },
    {
      category: "lipstick_fixer_and_remover",
      img: "https://res.cloudinary.com/drbhw0nwt/image/upload/f_auto,q_auto/v1751647020/Beautinique/Category_Images/7-4-2025_1751647020348_Lips.webp",
    },
    {
      category: "lip_balm",
      img: "https://res.cloudinary.com/drbhw0nwt/image/upload/f_auto,q_auto/v1751647020/Beautinique/Category_Images/7-4-2025_1751647020348_Lips.webp",
    },
    {
      category: "tinted_lip_balm",
      img: "https://res.cloudinary.com/drbhw0nwt/image/upload/f_auto,q_auto/v1751647020/Beautinique/Category_Images/7-4-2025_1751647020348_Lips.webp",
    },
  ],
};

const lip_enhancers_and_other = {
  category: "lip_enhancers_and_other",
  img: "https://res.cloudinary.com/drbhw0nwt/image/upload/f_auto,q_auto/v1751651100/Beautinique/Category_Images/7-4-2025_1751651100120_Lip-Cream.webp",
  subCategories: [
    {
      category: "lip_liner",
      img: "https://res.cloudinary.com/drbhw0nwt/image/upload/f_auto,q_auto/v1751651100/Beautinique/Category_Images/7-4-2025_1751651100120_Lip-Cream.webp",
    },
    {
      category: "lip_glitter",
      img: "https://res.cloudinary.com/drbhw0nwt/image/upload/f_auto,q_auto/v1751651100/Beautinique/Category_Images/7-4-2025_1751651100120_Lip-Cream.webp",
    },
    {
      category: "view_all",
      img: "https://res.cloudinary.com/drbhw0nwt/image/upload/f_auto,q_auto/v1751653191/Beautinique/Category_Images/7-4-2025_1751653191664_Sugar-Pop-Bag.jpg",
    },
  ],
};

const lipstick_set_and_combo = {
  category: "lipstick_set_and_combo",
  img: "https://res.cloudinary.com/drbhw0nwt/image/upload/f_auto,q_auto/v1751647558/Beautinique/Category_Images/7-4-2025_1751647558674_Lipsticks-Sets.webp",
  subCategories: [
    {
      category: "lipstick_set",
      img: "https://res.cloudinary.com/drbhw0nwt/image/upload/f_auto,q_auto/v1751647558/Beautinique/Category_Images/7-4-2025_1751647558674_Lipsticks-Sets.webp",
    },
    {
      category: "lipstick_combo",
      img: "https://res.cloudinary.com/drbhw0nwt/image/upload/f_auto,q_auto/v1751647558/Beautinique/Category_Images/7-4-2025_1751647558674_Lipsticks-Sets.webp",
    },
    {
      category: "lip_palette",
      img: "https://res.cloudinary.com/drbhw0nwt/image/upload/f_auto,q_auto/v1751652153/Beautinique/Category_Images/7-4-2025_1751652153495_Beauty-Saving-Offer.webp",
    },
  ],
};

/* ============================== MAIN LIPS CATEGORY ============================== */
const lips = {
  category: "lips",
  img: "https://res.cloudinary.com/drbhw0nwt/image/upload/f_auto,q_auto/v1751647020/Beautinique/Category_Images/7-4-2025_1751647020348_Lips.webp",
  subCategories: [
    finish_types,
    lipstick_forms,
    long_lasting_lipsticks,
    lip_care,
    lip_enhancers_and_other,
    lipstick_set_and_combo,
  ],
};

/* ============================== LIPS END ============================== */

/* ============================== SKIN START ============================== */
/* ==================== SUB-CATEGORIES ==================== */

const moisturizers = {
  category: "moisturizers",
  img: "https://res.cloudinary.com/drbhw0nwt/image/upload/f_auto,q_auto/v1751649312/Beautinique/Category_Images/7-4-2025_1751649311972_Your-Skin.webp",
  subCategories: [
    {
      category: "night_cream",
      img: "https://res.cloudinary.com/drbhw0nwt/image/upload/f_auto,q_auto/v1751652153/Beautinique/Category_Images/7-4-2025_1751652153458_Collection.webp",
    },
    {
      category: "eye_cream",
      img: "https://res.cloudinary.com/drbhw0nwt/image/upload/f_auto,q_auto/v1751650267/Beautinique/Category_Images/7-4-2025_1751650267526_Eyes.webp",
    },
    {
      category: "serum",
      img: "https://res.cloudinary.com/drbhw0nwt/image/upload/f_auto,q_auto/v1751652153/Beautinique/Category_Images/7-4-2025_1751652153544_Sugar-Elite.webp",
    },
    {
      category: "skincare_kit",
      img: "https://res.cloudinary.com/drbhw0nwt/image/upload/f_auto,q_auto/v1751649052/Beautinique/Category_Images/7-4-2025_1751649052471_Vaneeta-kit.webp",
    },
  ],
};

const cleansing_and_exfoliation = {
  category: "cleansing_and_exfoliation",
  img: "https://res.cloudinary.com/drbhw0nwt/image/upload/f_auto,q_auto/v1751649312/Beautinique/Category_Images/7-4-2025_1751649311972_Your-Skin.webp",
  subCategories: [
    {
      category: "cleanser",
      img: "https://res.cloudinary.com/drbhw0nwt/image/upload/f_auto,q_auto/v1751649312/Beautinique/Category_Images/7-4-2025_1751649311972_Your-Skin.webp",
    },
    {
      category: "face_wash",
      img: "https://res.cloudinary.com/drbhw0nwt/image/upload/f_auto,q_auto/v1751649704/Beautinique/Category_Images/7-4-2025_1751649704730_Face.webp",
    },
    {
      category: "exfoliator_and_scrub",
      img: "https://res.cloudinary.com/drbhw0nwt/image/upload/f_auto,q_auto/v1751649312/Beautinique/Category_Images/7-4-2025_1751649311972_Your-Skin.webp",
    },
    {
      category: "sunscreen",
      img: "https://res.cloudinary.com/drbhw0nwt/image/upload/f_auto,q_auto/v1751649312/Beautinique/Category_Images/7-4-2025_1751649311972_Your-Skin.webp",
    },
  ],
};

const natures_blend = {
  category: "natures_blend",
  img: "https://res.cloudinary.com/drbhw0nwt/image/upload/f_auto,q_auto/v1751652153/Beautinique/Category_Images/7-4-2025_1751652153544_Sugar-Elite.webp",
  subCategories: [
    {
      category: "aquaholic",
      img: "https://res.cloudinary.com/drbhw0nwt/image/upload/f_auto,q_auto/v1751652153/Beautinique/Category_Images/7-4-2025_1751652153544_Sugar-Elite.webp",
    },
    {
      category: "coffee_culture",
      img: "https://res.cloudinary.com/drbhw0nwt/image/upload/f_auto,q_auto/v1751652153/Beautinique/Category_Images/7-4-2025_1751652153544_Sugar-Elite.webp",
    },
    {
      category: "citrus_got_real",
      img: "https://res.cloudinary.com/drbhw0nwt/image/upload/f_auto,q_auto/v1751652153/Beautinique/Category_Images/7-4-2025_1751652153544_Sugar-Elite.webp",
    },
    {
      category: "view_all",
      img: "https://res.cloudinary.com/drbhw0nwt/image/upload/f_auto,q_auto/v1751652153/Beautinique/Category_Images/7-4-2025_1751652153544_Sugar-Elite.webp",
    },
  ],
};

const face_mask = {
  category: "face_mask",
  img: "https://res.cloudinary.com/drbhw0nwt/image/upload/f_auto,q_auto/v1751649704/Beautinique/Category_Images/7-4-2025_1751649704730_Face.webp",
  subCategories: [
    {
      category: "sheet_mask",
      img: "https://res.cloudinary.com/drbhw0nwt/image/upload/f_auto,q_auto/v1751649704/Beautinique/Category_Images/7-4-2025_1751649704730_Face.webp",
    },
    {
      category: "face_pack",
      img: "https://res.cloudinary.com/drbhw0nwt/image/upload/f_auto,q_auto/v1751649704/Beautinique/Category_Images/7-4-2025_1751649704730_Face.webp",
    },
    {
      category: "view_all",
      img: "https://res.cloudinary.com/drbhw0nwt/image/upload/f_auto,q_auto/v1751649704/Beautinique/Category_Images/7-4-2025_1751649704730_Face.webp",
    },
  ],
};

/* ============================== MAIN SKIN CATEGORY ============================== */
const skin = {
  category: "skin",
  img: "https://res.cloudinary.com/drbhw0nwt/image/upload/f_auto,q_auto/v1751649312/Beautinique/Category_Images/7-4-2025_1751649311972_Your-Skin.webp",
  subCategories: [
    moisturizers,
    cleansing_and_exfoliation,
    natures_blend,
    face_mask,
  ],
};

/* ============================== SKIN END ============================== */

/* ============================== FACE START ============================== */
/* ==================== SUB-CATEGORIES ==================== */
const face_makeup = {
  category: "face_makeup",
  img: "https://res.cloudinary.com/drbhw0nwt/image/upload/f_auto,q_auto/v1751649704/Beautinique/Category_Images/7-4-2025_1751649704730_Face.webp",
  subCategories: [
    {
      category: "foundation",
      img: "https://res.cloudinary.com/drbhw0nwt/image/upload/f_auto,q_auto/v1751649854/Beautinique/Category_Images/7-4-2025_1751649854080_Foundation.webp",
    },
    {
      category: "bb_cream",
      img: "https://res.cloudinary.com/drbhw0nwt/image/upload/f_auto,q_auto/v1751649854/Beautinique/Category_Images/7-4-2025_1751649854080_Foundation.webp",
    },
    {
      category: "compact_powder",
      img: "https://res.cloudinary.com/drbhw0nwt/image/upload/f_auto,q_auto/v1751649704/Beautinique/Category_Images/7-4-2025_1751649704730_Face.webp",
    },
    {
      category: "loose_powder",
      img: "https://res.cloudinary.com/drbhw0nwt/image/upload/f_auto,q_auto/v1751649704/Beautinique/Category_Images/7-4-2025_1751649704730_Face.webp",
    },
    {
      category: "banana_powder",
      img: "https://res.cloudinary.com/drbhw0nwt/image/upload/f_auto,q_auto/v1751649704/Beautinique/Category_Images/7-4-2025_1751649704730_Face.webp",
    },
    {
      category: "spf_foundation",
      img: "https://res.cloudinary.com/drbhw0nwt/image/upload/f_auto,q_auto/v1751649704/Beautinique/Category_Images/7-4-2025_1751649704730_Face.webp",
    },
  ],
};

const traditional_and_essentials = {
  category: "traditional_and_essentials",
  img: "https://res.cloudinary.com/drbhw0nwt/image/upload/f_auto,q_auto/v1751652153/Beautinique/Category_Images/7-4-2025_1751652153495_Beauty-Saving-Offer.webp",
  subCategories: [
    {
      category: "sindoor",
      img: "https://res.cloudinary.com/drbhw0nwt/image/upload/f_auto,q_auto/v1751652153/Beautinique/Category_Images/7-4-2025_1751652153495_Beauty-Saving-Offer.webp",
    },
  ],
};

const cheeks_and_glow = {
  category: "cheeks_and_glow",
  img: "https://res.cloudinary.com/drbhw0nwt/image/upload/f_auto,q_auto/v1751652153/Beautinique/Category_Images/7-4-2025_1751652153458_Collection.webp",
  subCategories: [
    {
      category: "highlighter",
      img: "https://res.cloudinary.com/drbhw0nwt/image/upload/f_auto,q_auto/v1751652153/Beautinique/Category_Images/7-4-2025_1751652153458_Collection.webp",
    },
    {
      category: "liquid_highlighter",
      img: "https://res.cloudinary.com/drbhw0nwt/image/upload/f_auto,q_auto/v1751652153/Beautinique/Category_Images/7-4-2025_1751652153458_Collection.webp",
    },
    {
      category: "blush",
      img: "https://res.cloudinary.com/drbhw0nwt/image/upload/f_auto,q_auto/v1751650082/Beautinique/Category_Images/7-4-2025_1751650081924_Blush.webp",
    },
    {
      category: "cheek_stain",
      img: "https://res.cloudinary.com/drbhw0nwt/image/upload/f_auto,q_auto/v1751652153/Beautinique/Category_Images/7-4-2025_1751652153458_Collection.webp",
    },
  ],
};

const setting_and_finishing = {
  category: "setting_and_finishing",
  img: "https://res.cloudinary.com/drbhw0nwt/image/upload/f_auto,q_auto/v1751647408/Beautinique/Category_Images/7-4-2025_1751647408012_Powder.webp",
  subCategories: [
    {
      category: "setting_spray",
      img: "https://res.cloudinary.com/drbhw0nwt/image/upload/f_auto,q_auto/v1751647408/Beautinique/Category_Images/7-4-2025_1751647408012_Powder.webp",
    },
    {
      category: "compact",
      img: "https://res.cloudinary.com/drbhw0nwt/image/upload/f_auto,q_auto/v1751647408/Beautinique/Category_Images/7-4-2025_1751647408012_Powder.webp",
    },
    {
      category: "fixer",
      img: "https://res.cloudinary.com/drbhw0nwt/image/upload/f_auto,q_auto/v1751647408/Beautinique/Category_Images/7-4-2025_1751647408012_Powder.webp",
    },
  ],
};

const foundations_by_finish = {
  category: "foundations_by_finish",
  img: "https://res.cloudinary.com/drbhw0nwt/image/upload/f_auto,q_auto/v1751649854/Beautinique/Category_Images/7-4-2025_1751649854080_Foundation.webp",
  subCategories: [
    {
      category: "liquid_foundation",
      img: "https://res.cloudinary.com/drbhw0nwt/image/upload/f_auto,q_auto/v1751649854/Beautinique/Category_Images/7-4-2025_1751649854080_Foundation.webp",
    },
    {
      category: "matte_foundation",
      img: "https://res.cloudinary.com/drbhw0nwt/image/upload/f_auto,q_auto/v1751649854/Beautinique/Category_Images/7-4-2025_1751649854080_Foundation.webp",
    },
    {
      category: "water_resistant_foundation",
      img: "https://res.cloudinary.com/drbhw0nwt/image/upload/f_auto,q_auto/v1751649854/Beautinique/Category_Images/7-4-2025_1751649854080_Foundation.webp",
    },
    {
      category: "high_coverage_foundation",
      img: "https://res.cloudinary.com/drbhw0nwt/image/upload/f_auto,q_auto/v1751649854/Beautinique/Category_Images/7-4-2025_1751649854080_Foundation.webp",
    },
    {
      category: "stick_foundation",
      img: "https://res.cloudinary.com/drbhw0nwt/image/upload/f_auto,q_auto/v1751649854/Beautinique/Category_Images/7-4-2025_1751649854080_Foundation.webp",
    },
  ],
};

const foundations_by_skin_type = {
  category: "foundations_by_skin_type",
  img: "https://res.cloudinary.com/drbhw0nwt/image/upload/f_auto,q_auto/v1751649854/Beautinique/Category_Images/7-4-2025_1751649854080_Foundation.webp",
  subCategories: [
    {
      category: "best_for_dry_skin",
      img: "https://res.cloudinary.com/drbhw0nwt/image/upload/f_auto,q_auto/v1751649854/Beautinique/Category_Images/7-4-2025_1751649854080_Foundation.webp",
    },
    {
      category: "best_for_oily_skin",
      img: "https://res.cloudinary.com/drbhw0nwt/image/upload/f_auto,q_auto/v1751649854/Beautinique/Category_Images/7-4-2025_1751649854080_Foundation.webp",
    },
  ],
};

const primers_and_removers = {
  category: "primers_and_removers",
  img: "https://res.cloudinary.com/drbhw0nwt/image/upload/f_auto,q_auto/v1751650181/Beautinique/Category_Images/7-4-2025_1751650181649_Primer.webp",
  subCategories: [
    {
      category: "makeup_remover",
      img: "https://res.cloudinary.com/drbhw0nwt/image/upload/f_auto,q_auto/v1751650920/Beautinique/Category_Images/7-4-2025_1751650920058_Tapsi-Sugar-Makeup.webp",
    },
    {
      category: "primer",
      img: "https://res.cloudinary.com/drbhw0nwt/image/upload/f_auto,q_auto/v1751650181/Beautinique/Category_Images/7-4-2025_1751650181649_Primer.webp",
    },
  ],
};

const bronzers_and_contours = {
  category: "bronzers_and_contours",
  img: "https://res.cloudinary.com/drbhw0nwt/image/upload/f_auto,q_auto/v1751652153/Beautinique/Category_Images/7-4-2025_1751652153544_Sugar-Elite.webp",
  subCategories: [
    {
      category: "bronzer",
      img: "https://res.cloudinary.com/drbhw0nwt/image/upload/f_auto,q_auto/v1751652153/Beautinique/Category_Images/7-4-2025_1751652153544_Sugar-Elite.webp",
    },
    {
      category: "contour",
      img: "https://res.cloudinary.com/drbhw0nwt/image/upload/f_auto,q_auto/v1751652153/Beautinique/Category_Images/7-4-2025_1751652153544_Sugar-Elite.webp",
    },
  ],
};

const concealers_and_correctors = {
  category: "concealers_and_correctors",
  img: "https://res.cloudinary.com/drbhw0nwt/image/upload/f_auto,q_auto/v1751652153/Beautinique/Category_Images/7-4-2025_1751652153544_Sugar-Elite.webp",
  subCategories: [
    {
      category: "color_concealer",
      img: "https://res.cloudinary.com/drbhw0nwt/image/upload/f_auto,q_auto/v1751652153/Beautinique/Category_Images/7-4-2025_1751652153544_Sugar-Elite.webp",
    },
    {
      category: "color_corrector",
      img: "https://res.cloudinary.com/drbhw0nwt/image/upload/f_auto,q_auto/v1751652153/Beautinique/Category_Images/7-4-2025_1751652153544_Sugar-Elite.webp",
    },
  ],
};

/* ============================== MAIN FACE CATEGORY ============================== */
const face = {
  category: "face",
  img: "https://res.cloudinary.com/drbhw0nwt/image/upload/f_auto,q_auto/v1751649704/Beautinique/Category_Images/7-4-2025_1751649704730_Face.webp",
  subCategories: [
    face_makeup,
    traditional_and_essentials,
    cheeks_and_glow,
    setting_and_finishing,
    foundations_by_finish,
    foundations_by_skin_type,
    primers_and_removers,
    bronzers_and_contours,
    concealers_and_correctors,
  ],
};

/* ============================== FACE END ============================== */

/* ============================== EYES START ============================== */
/* ==================== SUB-CATEGORY GROUPS ==================== */

const kohl_and_kajal = {
  category: "kohl_and_kajal",
  img: "https://res.cloudinary.com/drbhw0nwt/image/upload/f_auto,q_auto/v1751650492/Beautinique/Category_Images/7-4-2025_1751650492382_Kohls-and-kajal.webp",
  subCategories: [
    {
      category: "kohl",
      img: "https://res.cloudinary.com/drbhw0nwt/image/upload/f_auto,q_auto/v1751650492/Beautinique/Category_Images/7-4-2025_1751650492382_Kohls-and-kajal.webp",
    },
    {
      category: "kajal",
      img: "https://res.cloudinary.com/drbhw0nwt/image/upload/f_auto,q_auto/v1751650492/Beautinique/Category_Images/7-4-2025_1751650492382_Kohls-and-kajal.webp",
    },
    {
      category: "smudge_proof_kajal",
      img: "https://res.cloudinary.com/drbhw0nwt/image/upload/f_auto,q_auto/v1751650492/Beautinique/Category_Images/7-4-2025_1751650492382_Kohls-and-kajal.webp",
    },
  ],
};

const mascaras = {
  category: "mascaras",
  img: "https://res.cloudinary.com/drbhw0nwt/image/upload/f_auto,q_auto/v1751650592/Beautinique/Category_Images/7-4-2025_1751650592254_Mascara.webp",
  subCategories: [
    {
      category: "volumizing_mascara",
      img: "https://res.cloudinary.com/drbhw0nwt/image/upload/f_auto,q_auto/v1751650592/Beautinique/Category_Images/7-4-2025_1751650592254_Mascara.webp",
    },
    {
      category: "curl_lengthening_mascara",
      img: "https://res.cloudinary.com/drbhw0nwt/image/upload/f_auto,q_auto/v1751650592/Beautinique/Category_Images/7-4-2025_1751650592254_Mascara.webp",
    },
    {
      category: "waterproof_mascara",
      img: "https://res.cloudinary.com/drbhw0nwt/image/upload/f_auto,q_auto/v1751650592/Beautinique/Category_Images/7-4-2025_1751650592254_Mascara.webp",
    },
  ],
};

const eyeliners = {
  category: "eyeliners",
  img: "https://res.cloudinary.com/drbhw0nwt/image/upload/f_auto,q_auto/v1751650267/Beautinique/Category_Images/7-4-2025_1751650267526_Eyes.webp",
  subCategories: [
    {
      category: "liquid_eyeliner",
      img: "https://res.cloudinary.com/drbhw0nwt/image/upload/f_auto,q_auto/v1751650267/Beautinique/Category_Images/7-4-2025_1751650267526_Eyes.webp",
    },
    {
      category: "gel_eyeliner",
      img: "https://res.cloudinary.com/drbhw0nwt/image/upload/f_auto,q_auto/v1751650267/Beautinique/Category_Images/7-4-2025_1751650267526_Eyes.webp",
    },
    {
      category: "pen_eyeliner",
      img: "https://res.cloudinary.com/drbhw0nwt/image/upload/f_auto,q_auto/v1751650267/Beautinique/Category_Images/7-4-2025_1751650267526_Eyes.webp",
    },
  ],
};

const eyeshadow = {
  category: "eyeshadow",
  img: "https://res.cloudinary.com/drbhw0nwt/image/upload/f_auto,q_auto/v1751650267/Beautinique/Category_Images/7-4-2025_1751650267526_Eyes.webp",
  subCategories: [
    {
      category: "eyeshadow_palette",
      img: "https://res.cloudinary.com/drbhw0nwt/image/upload/f_auto,q_auto/v1751650267/Beautinique/Category_Images/7-4-2025_1751650267526_Eyes.webp",
    },
    {
      category: "liquid_eyeshadow",
      img: "https://res.cloudinary.com/drbhw0nwt/image/upload/f_auto,q_auto/v1751650267/Beautinique/Category_Images/7-4-2025_1751650267526_Eyes.webp",
    },
    {
      category: "glitter_eyeshadow",
      img: "https://res.cloudinary.com/drbhw0nwt/image/upload/f_auto,q_auto/v1751650267/Beautinique/Category_Images/7-4-2025_1751650267526_Eyes.webp",
    },
  ],
};

const eyebrows = {
  category: "eyebrows",
  img: "https://res.cloudinary.com/drbhw0nwt/image/upload/f_auto,q_auto/v1751650655/Beautinique/Category_Images/7-4-2025_1751650655914_Eyebrow.webp",
  subCategories: [
    {
      category: "brow_definer",
      img: "https://res.cloudinary.com/drbhw0nwt/image/upload/f_auto,q_auto/v1751650655/Beautinique/Category_Images/7-4-2025_1751650655914_Eyebrow.webp",
    },
    {
      category: "brow_pencil",
      img: "https://res.cloudinary.com/drbhw0nwt/image/upload/f_auto,q_auto/v1751650655/Beautinique/Category_Images/7-4-2025_1751650655914_Eyebrow.webp",
    },
    {
      category: "brow_gel",
      img: "https://res.cloudinary.com/drbhw0nwt/image/upload/f_auto,q_auto/v1751650655/Beautinique/Category_Images/7-4-2025_1751650655914_Eyebrow.webp",
    },
  ],
};

const eye_value_set = {
  category: "eye_value_set",
  img: "https://res.cloudinary.com/drbhw0nwt/image/upload/f_auto,q_auto/v1751647408/Beautinique/Category_Images/7-4-2025_1751647408012_Powder.webp",
  subCategories: [
    {
      category: "eyelashes",
      img: "https://res.cloudinary.com/drbhw0nwt/image/upload/f_auto,q_auto/v1751650267/Beautinique/Category_Images/7-4-2025_1751650267526_Eyes.webp",
    },
    {
      category: "eye_gift_set",
      img: "https://res.cloudinary.com/drbhw0nwt/image/upload/f_auto,q_auto/v1751647408/Beautinique/Category_Images/7-4-2025_1751647408012_Powder.webp",
    },
    {
      category: "eye_combo",
      img: "https://res.cloudinary.com/drbhw0nwt/image/upload/f_auto,q_auto/v1751650267/Beautinique/Category_Images/7-4-2025_1751650267526_Eyes.webp",
    },
  ],
};

/* ============================== MAIN EYES CATEGORY ============================== */

const eyes = {
  category: "eyes",
  img: "https://res.cloudinary.com/drbhw0nwt/image/upload/f_auto,q_auto/v1751650267/Beautinique/Category_Images/7-4-2025_1751650267526_Eyes.webp",
  subCategories: [
    kohl_and_kajal,
    mascaras,
    eyeliners,
    eyeshadow,
    eyebrows,
    eye_value_set,
  ],
};

/* ============================== EYES END ============================== */

/* ============================== COLLECTIONS START ============================== */
/* ==================== SUB-CATEGORY GROUPS ==================== */

const bath_and_body = {
  category: "bath_and_body",
  img: "https://res.cloudinary.com/drbhw0nwt/image/upload/f_auto,q_auto/v1751652153/Beautinique/Category_Images/7-4-2025_1751652153458_Collection.webp",
  subCategories: [
    {
      category: "shower_gel",
      img: "https://res.cloudinary.com/drbhw0nwt/image/upload/f_auto,q_auto/v1751652153/Beautinique/Category_Images/7-4-2025_1751652153458_Collection.webp",
    },
    {
      category: "soap",
      img: "https://res.cloudinary.com/drbhw0nwt/image/upload/f_auto,q_auto/v1751652153/Beautinique/Category_Images/7-4-2025_1751652153458_Collection.webp",
    },
    {
      category: "body_lotion",
      img: "https://res.cloudinary.com/drbhw0nwt/image/upload/f_auto,q_auto/v1751652153/Beautinique/Category_Images/7-4-2025_1751652153458_Collection.webp",
    },
    {
      category: "body_spray",
      img: "https://res.cloudinary.com/drbhw0nwt/image/upload/f_auto,q_auto/v1751652153/Beautinique/Category_Images/7-4-2025_1751652153458_Collection.webp",
    },
    {
      category: "hand_wash",
      img: "https://res.cloudinary.com/drbhw0nwt/image/upload/f_auto,q_auto/v1751652153/Beautinique/Category_Images/7-4-2025_1751652153458_Collection.webp",
    },
    {
      category: "foot_cream",
      img: "https://res.cloudinary.com/drbhw0nwt/image/upload/f_auto,q_auto/v1751652153/Beautinique/Category_Images/7-4-2025_1751652153458_Collection.webp",
    },
    {
      category: "hand_cream",
      img: "https://res.cloudinary.com/drbhw0nwt/image/upload/f_auto,q_auto/v1751652153/Beautinique/Category_Images/7-4-2025_1751652153458_Collection.webp",
    },
  ],
};

const sugar_pop = {
  category: "sugar_pop",
  img: "https://res.cloudinary.com/drbhw0nwt/image/upload/f_auto,q_auto/v1751647973/Beautinique/Category_Images/7-4-2025_1751647973400_Pretty-Picks-Makeup.webp",
  subCategories: [
    {
      category: "lips",
      img: "https://res.cloudinary.com/drbhw0nwt/image/upload/f_auto,q_auto/v1751647973/Beautinique/Category_Images/7-4-2025_1751647973417_Ultrastay.webp",
    },
    {
      category: "eyes",
      img: "https://res.cloudinary.com/drbhw0nwt/image/upload/f_auto,q_auto/v1751647973/Beautinique/Category_Images/7-4-2025_1751647973405_Complete_Makeup_Kit.webp",
    },
    {
      category: "face",
      img: "https://res.cloudinary.com/drbhw0nwt/image/upload/f_auto,q_auto/v1751647973/Beautinique/Category_Images/7-4-2025_1751647973405_Complete_Makeup_Kit.webp",
    },
    {
      category: "nails",
      img: "https://res.cloudinary.com/drbhw0nwt/image/upload/f_auto,q_auto/v1751647973/Beautinique/Category_Images/7-4-2025_1751647973405_Complete_Makeup_Kit.webp",
    },
    {
      category: "skincare",
      img: "https://res.cloudinary.com/drbhw0nwt/image/upload/f_auto,q_auto/v1751647973/Beautinique/Category_Images/7-4-2025_1751647973405_Complete_Makeup_Kit.webp",
    },
    {
      category: "body_care",
      img: "https://res.cloudinary.com/drbhw0nwt/image/upload/f_auto,q_auto/v1751647973/Beautinique/Category_Images/7-4-2025_1751647973405_Complete_Makeup_Kit.webp",
    },
    {
      category: "best_of_sugar_pop",
      img: "https://res.cloudinary.com/drbhw0nwt/image/upload/f_auto,q_auto/v1751647973/Beautinique/Category_Images/7-4-2025_1751647973407_All_In_One.gif",
    },
  ],
};

const hair_care = {
  category: "hair_care",
  img: "https://res.cloudinary.com/drbhw0nwt/image/upload/f_auto,q_auto/v1751652153/Beautinique/Category_Images/7-4-2025_1751652153544_Sugar-Elite.webp",
  subCategories: [
    {
      category: "shampoo",
      img: "https://res.cloudinary.com/drbhw0nwt/image/upload/f_auto,q_auto/v1751652153/Beautinique/Category_Images/7-4-2025_1751652153544_Sugar-Elite.webp",
    },
    {
      category: "conditioner",
      img: "https://res.cloudinary.com/drbhw0nwt/image/upload/f_auto,q_auto/v1751652153/Beautinique/Category_Images/7-4-2025_1751652153544_Sugar-Elite.webp",
    },
    {
      category: "hair_oil",
      img: "https://res.cloudinary.com/drbhw0nwt/image/upload/f_auto,q_auto/v1751652153/Beautinique/Category_Images/7-4-2025_1751652153544_Sugar-Elite.webp",
    },
    {
      category: "serum",
      img: "https://res.cloudinary.com/drbhw0nwt/image/upload/f_auto,q_auto/v1751652153/Beautinique/Category_Images/7-4-2025_1751652153544_Sugar-Elite.webp",
    },
    {
      category: "hair_mask",
      img: "https://res.cloudinary.com/drbhw0nwt/image/upload/f_auto,q_auto/v1751652153/Beautinique/Category_Images/7-4-2025_1751652153544_Sugar-Elite.webp",
    },
    {
      category: "combo",
      img: "https://res.cloudinary.com/drbhw0nwt/image/upload/f_auto,q_auto/v1751652153/Beautinique/Category_Images/7-4-2025_1751652153544_Sugar-Elite.webp",
    },
    {
      category: "view_all",
      img: "https://res.cloudinary.com/drbhw0nwt/image/upload/f_auto,q_auto/v1751652153/Beautinique/Category_Images/7-4-2025_1751652153544_Sugar-Elite.webp",
    },
  ],
};

const gifting = {
  category: "gifting",
  img: "https://res.cloudinary.com/drbhw0nwt/image/upload/f_auto,q_auto/v1751648747/Beautinique/Category_Images/7-4-2025_1751648747422_gifting.webp",
  subCategories: [
    {
      category: "lipstick_set",
      img: "https://res.cloudinary.com/drbhw0nwt/image/upload/f_auto,q_auto/v1751647408/Beautinique/Category_Images/7-4-2025_1751647408012_Powder.webp",
    },
    {
      category: "sugar_merch",
      img: "https://res.cloudinary.com/drbhw0nwt/image/upload/f_auto,q_auto/v1751652153/Beautinique/Category_Images/7-4-2025_1751652153466_Free-Suagar-Pop.webp",
    },
    {
      category: "value_set",
      img: "https://res.cloudinary.com/drbhw0nwt/image/upload/f_auto,q_auto/v1751647408/Beautinique/Category_Images/7-4-2025_1751647408012_Powder.webp",
    },
    {
      category: "makeup_kit",
      img: "https://res.cloudinary.com/drbhw0nwt/image/upload/f_auto,q_auto/v1751649052/Beautinique/Category_Images/7-4-2025_1751649052471_Vaneeta-kit.webp",
    },
    {
      category: "corporate_gifting",
      img: "https://res.cloudinary.com/drbhw0nwt/image/upload/f_auto,q_auto/v1751652153/Beautinique/Category_Images/7-4-2025_1751652153466_Free-Suagar-Pop.webp",
    },
    {
      category: "sugar_set",
      img: "https://res.cloudinary.com/drbhw0nwt/image/upload/f_auto,q_auto/v1751647408/Beautinique/Category_Images/7-4-2025_1751647408012_Powder.webp",
    },
  ],
};

/* ============================== MAIN COLLECTIONS CATEGORY ============================== */

const collections = {
  category: "collections",
  img: "https://res.cloudinary.com/drbhw0nwt/image/upload/f_auto,q_auto/v1751652153/Beautinique/Category_Images/7-4-2025_1751652153458_Collection.webp",
  subCategories: [bath_and_body, sugar_pop, hair_care, gifting],
};

/* ============================== COLLECTIONS END ============================== */

export const CATEGORY_IMAGE_DATA: CategoryImageDataType = {
  for_you,
  lips,
  skin,
  face,
  eyes,
  collections,
};
