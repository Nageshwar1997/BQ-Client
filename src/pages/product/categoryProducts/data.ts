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

export const CATEGORY_IMAGE_DATA: CategoryImageDataType = {
  for_you: {
    category: "for_you",
    img: "/images/category-images/for-you/new.webp",
    subCategories: [
      {
        category: "new",
        img: "/images/category-images/for-you/new.webp",
        subCategories: [
          {
            category: "new_arrivals",
            img: "/images/category-images/for-you/new.webp",
          },
        ],
      },
      {
        category: "sugar_play",
        img: "/images/category-images/for-you/new.webp",
        subCategories: [
          {
            category: "sugar_play",
            img: "/images/category-images/for-you/new.webp",
          },
        ],
      },
    ],
  },
  lips: {
    category: "lips",
    img: "/images/category-images/for-you/new.webp",
    subCategories: [
      {
        category: "finish_types",
        img: "/images/category-images/for-you/new.webp",
        subCategories: [
          {
            category: "matte_lipstick",
            img: "/images/category-images/for-you/new.webp",
          },
          {
            category: "satin_lipstick",
            img: "/images/category-images/for-you/new.webp",
          },
          {
            category: "hi_shine_lipstick",
            img: "/images/category-images/for-you/new.webp",
          },
          {
            category: "lip_gloss",
            img: "/images/category-images/for-you/new.webp",
          },
        ],
      },
      {
        category: "lipstick_forms",
        img: "/images/category-images/for-you/new.webp",
        subCategories: [
          {
            category: "liquid_lipstick",
            img: "/images/category-images/for-you/new.webp",
          },
          {
            category: "powder_lipstick",
            img: "/images/category-images/for-you/new.webp",
          },
          {
            category: "crayon_lipstick",
            img: "/images/category-images/for-you/new.webp",
          },
          {
            category: "bullet_lipstick",
            img: "/images/category-images/for-you/new.webp",
          },
        ],
      },
      {
        category: "long_lasting_lipsticks",
        img: "/images/category-images/for-you/new.webp",
        subCategories: [
          {
            category: "transfer_proof_lipstick",
            img: "/images/category-images/for-you/new.webp",
          },
          {
            category: "water_proof_lipstick",
            img: "/images/category-images/for-you/new.webp",
          },
          {
            category: "lip_tint_and_stain",
            img: "/images/category-images/for-you/new.webp",
          },
          {
            category: "smudge_proof_lipstick",
            img: "/images/category-images/for-you/new.webp",
          },
        ],
      },
      {
        category: "lip_care",
        img: "/images/category-images/for-you/new.webp",
        subCategories: [
          {
            category: "lip_primer_and_scrub",
            img: "/images/category-images/for-you/new.webp",
          },
          {
            category: "lipstick_fixer_and_remover",
            img: "/images/category-images/for-you/new.webp",
          },
          {
            category: "lip_balm",
            img: "/images/category-images/for-you/new.webp",
          },
          {
            category: "tinted_lip_balm",
            img: "/images/category-images/for-you/new.webp",
          },
        ],
      },
      {
        category: "lip_enhancers_and_other",
        img: "/images/category-images/for-you/new.webp",
        subCategories: [
          {
            category: "lip_liner",
            img: "/images/category-images/for-you/new.webp",
          },
          {
            category: "lip_glitter",
            img: "/images/category-images/for-you/new.webp",
          },
          {
            category: "view_all",
            img: "/images/category-images/for-you/new.webp",
          },
        ],
      },
      {
        category: "lipstick_set_and_combo",
        img: "/images/category-images/for-you/new.webp",
        subCategories: [
          {
            category: "lipstick_set",
            img: "/images/category-images/for-you/new.webp",
          },
          {
            category: "lipstick_combo",
            img: "/images/category-images/for-you/new.webp",
          },
          {
            category: "lip_palette",
            img: "/images/category-images/for-you/new.webp",
          },
        ],
      },
    ],
  },
  skin: {
    category: "skin",
    img: "/images/category-images/for-you/new.webp",
    subCategories: [
      {
        category: "moisturizers",
        img: "/images/category-images/for-you/new.webp",
        subCategories: [
          {
            category: "night_cream",
            img: "/images/category-images/for-you/new.webp",
          },
          {
            category: "eye_cream",
            img: "/images/category-images/for-you/new.webp",
          },
          {
            category: "serum",
            img: "/images/category-images/for-you/new.webp",
          },
          {
            category: "skincare_kit",
            img: "/images/category-images/for-you/new.webp",
          },
        ],
      },
      {
        category: "cleansing_and_exfoliation",
        img: "/images/category-images/for-you/new.webp",
        subCategories: [
          {
            category: "cleanser",
            img: "/images/category-images/for-you/new.webp",
          },
          {
            category: "face_wash",
            img: "/images/category-images/for-you/new.webp",
          },
          {
            category: "exfoliator_and_scrub",
            img: "/images/category-images/for-you/new.webp",
          },
          {
            category: "sunscreen",
            img: "/images/category-images/for-you/new.webp",
          },
        ],
      },
      {
        category: "natures_blend",
        img: "/images/category-images/for-you/new.webp",
        subCategories: [
          {
            category: "aquaholic",
            img: "/images/category-images/for-you/new.webp",
          },
          {
            category: "coffee_culture",
            img: "/images/category-images/for-you/new.webp",
          },
          {
            category: "citrus_got_real",
            img: "/images/category-images/for-you/new.webp",
          },
          {
            category: "view_all",
            img: "/images/category-images/for-you/new.webp",
          },
        ],
      },
      {
        category: "face_mask",
        img: "/images/category-images/for-you/new.webp",
        subCategories: [
          {
            category: "sheet_mask",
            img: "/images/category-images/for-you/new.webp",
          },
          {
            category: "face_pack",
            img: "/images/category-images/for-you/new.webp",
          },
          {
            category: "view_all",
            img: "/images/category-images/for-you/new.webp",
          },
        ],
      },
    ],
  },
  face: {
    category: "face",
    img: "/images/category-images/for-you/new.webp",
    subCategories: [
      {
        category: "face_makeup",
        img: "/images/category-images/for-you/new.webp",
        subCategories: [
          {
            category: "foundation",
            img: "/images/category-images/for-you/new.webp",
          },
          {
            category: "bb_cream",
            img: "/images/category-images/for-you/new.webp",
          },
          {
            category: "compact_powder",
            img: "/images/category-images/for-you/new.webp",
          },
          {
            category: "loose_powder",
            img: "/images/category-images/for-you/new.webp",
          },
          {
            category: "banana_powder",
            img: "/images/category-images/for-you/new.webp",
          },
          {
            category: "spf_foundation",
            img: "/images/category-images/for-you/new.webp",
          },
        ],
      },
      {
        category: "traditional_and_essentials",
        img: "/images/category-images/for-you/new.webp",
        subCategories: [
          {
            category: "sindoor",
            img: "/images/category-images/for-you/new.webp",
          },
        ],
      },
      {
        category: "cheeks_and_glow",
        img: "/images/category-images/for-you/new.webp",
        subCategories: [
          {
            category: "highlighter",
            img: "/images/category-images/for-you/new.webp",
          },
          {
            category: "liquid_highlighter",
            img: "/images/category-images/for-you/new.webp",
          },
          {
            category: "blush",
            img: "/images/category-images/for-you/new.webp",
          },
          {
            category: "cheek_stain",
            img: "/images/category-images/for-you/new.webp",
          },
        ],
      },
      {
        category: "setting_and_finishing",
        img: "/images/category-images/for-you/new.webp",
        subCategories: [
          {
            category: "setting_spray",
            img: "/images/category-images/for-you/new.webp",
          },
          {
            category: "compact",
            img: "/images/category-images/for-you/new.webp",
          },
          {
            category: "fixer",
            img: "/images/category-images/for-you/new.webp",
          },
        ],
      },
      {
        category: "foundations_by_finish",
        img: "/images/category-images/for-you/new.webp",
        subCategories: [
          {
            category: "liquid_foundation",
            img: "/images/category-images/for-you/new.webp",
          },
          {
            category: "matte_foundation",
            img: "/images/category-images/for-you/new.webp",
          },
          {
            category: "water_resistant_foundation",
            img: "/images/category-images/for-you/new.webp",
          },
          {
            category: "high_coverage_foundation",
            img: "/images/category-images/for-you/new.webp",
          },
          {
            category: "stick_foundation",
            img: "/images/category-images/for-you/new.webp",
          },
        ],
      },
      {
        category: "foundations_by_skin_type",
        img: "/images/category-images/for-you/new.webp",
        subCategories: [
          {
            category: "best_for_dry_skin",
            img: "/images/category-images/for-you/new.webp",
          },
          {
            category: "best_for_oily_skin",
            img: "/images/category-images/for-you/new.webp",
          },
        ],
      },
      {
        category: "primers_and_removers",
        img: "/images/category-images/for-you/new.webp",
        subCategories: [
          {
            category: "makeup_remover",
            img: "/images/category-images/for-you/new.webp",
          },
          {
            category: "primer",
            img: "/images/category-images/for-you/new.webp",
          },
        ],
      },
      {
        category: "bronzers_and_contours",
        img: "/images/category-images/for-you/new.webp",
        subCategories: [
          {
            category: "bronzer",
            img: "/images/category-images/for-you/new.webp",
          },
          {
            category: "contour",
            img: "/images/category-images/for-you/new.webp",
          },
        ],
      },
      {
        category: "concealers_and_correctors",
        img: "/images/category-images/for-you/new.webp",
        subCategories: [
          {
            category: "color_concealer",
            img: "/images/category-images/for-you/new.webp",
          },
          {
            category: "color_corrector",
            img: "/images/category-images/for-you/new.webp",
          },
        ],
      },
    ],
  },
  eyes: {
    category: "eyes",
    img: "/images/category-images/for-you/new.webp",
    subCategories: [
      {
        category: "kohl_and_kajal",
        img: "/images/category-images/for-you/new.webp",
        subCategories: [
          {
            category: "kohl",
            img: "/images/category-images/for-you/new.webp",
          },
          {
            category: "kajal",
            img: "/images/category-images/for-you/new.webp",
          },
          {
            category: "smudge_proof_kajal",
            img: "/images/category-images/for-you/new.webp",
          },
        ],
      },
      {
        category: "mascaras",
        img: "/images/category-images/for-you/new.webp",
        subCategories: [
          {
            category: "volumizing_mascara",
            img: "/images/category-images/for-you/new.webp",
          },
          {
            category: "curl_lengthening_mascara",
            img: "/images/category-images/for-you/new.webp",
          },
          {
            category: "waterproof_mascara",
            img: "/images/category-images/for-you/new.webp",
          },
        ],
      },
      {
        category: "eyeliners",
        img: "/images/category-images/for-you/new.webp",
        subCategories: [
          {
            category: "liquid_eyeliner",
            img: "/images/category-images/for-you/new.webp",
          },
          {
            category: "gel_eyeliner",
            img: "/images/category-images/for-you/new.webp",
          },
          {
            category: "pen_eyeliner",
            img: "/images/category-images/for-you/new.webp",
          },
        ],
      },
      {
        category: "eyeshadow",
        img: "/images/category-images/for-you/new.webp",
        subCategories: [
          {
            category: "eyeshadow_palette",
            img: "/images/category-images/for-you/new.webp",
          },
          {
            category: "liquid_eyeshadow",
            img: "/images/category-images/for-you/new.webp",
          },
          {
            category: "glitter_eyeshadow",
            img: "/images/category-images/for-you/new.webp",
          },
        ],
      },
      {
        category: "eyebrows",
        img: "/images/category-images/for-you/new.webp",
        subCategories: [
          {
            category: "brow_definer",
            img: "/images/category-images/for-you/new.webp",
          },
          {
            category: "brow_pencil",
            img: "/images/category-images/for-you/new.webp",
          },
          {
            category: "brow_gel",
            img: "/images/category-images/for-you/new.webp",
          },
        ],
      },
      {
        category: "eye_value_set",
        img: "/images/category-images/for-you/new.webp",
        subCategories: [
          {
            category: "eyelashes",
            img: "/images/category-images/for-you/new.webp",
          },
          {
            category: "eye_gift_set",
            img: "/images/category-images/for-you/new.webp",
          },
          {
            category: "eye_combo",
            img: "/images/category-images/for-you/new.webp",
          },
        ],
      },
    ],
  },
  collections: {
    category: "collections",
    img: "/images/category-images/for-you/new.webp",
    subCategories: [
      {
        category: "bath_and_body",
        img: "/images/category-images/for-you/new.webp",
        subCategories: [
          {
            category: "shower_gel",
            img: "/images/category-images/for-you/new.webp",
          },
          {
            category: "soap",
            img: "/images/category-images/for-you/new.webp",
          },
          {
            category: "body_lotion",
            img: "/images/category-images/for-you/new.webp",
          },
          {
            category: "body_spray",
            img: "/images/category-images/for-you/new.webp",
          },
          {
            category: "hand_wash",
            img: "/images/category-images/for-you/new.webp",
          },
          {
            category: "foot_cream",
            img: "/images/category-images/for-you/new.webp",
          },
          {
            category: "hand_cream",
            img: "/images/category-images/for-you/new.webp",
          },
        ],
      },
      {
        category: "sugar_pop",
        img: "/images/category-images/for-you/new.webp",
        subCategories: [
          {
            category: "lips",
            img: "/images/category-images/for-you/new.webp",
          },
          {
            category: "eyes",
            img: "/images/category-images/for-you/new.webp",
          },
          {
            category: "face",
            img: "/images/category-images/for-you/new.webp",
          },
          {
            category: "nails",
            img: "/images/category-images/for-you/new.webp",
          },
          {
            category: "skincare",
            img: "/images/category-images/for-you/new.webp",
          },
          {
            category: "body_care",
            img: "/images/category-images/for-you/new.webp",
          },
          {
            category: "best_of_sugar_pop",
            img: "/images/category-images/for-you/new.webp",
          },
        ],
      },
      {
        category: "hair_care",
        img: "/images/category-images/for-you/new.webp",
        subCategories: [
          {
            category: "shampoo",
            img: "/images/category-images/for-you/new.webp",
          },
          {
            category: "conditioner",
            img: "/images/category-images/for-you/new.webp",
          },
          {
            category: "hair_oil",
            img: "/images/category-images/for-you/new.webp",
          },
          {
            category: "serum",
            img: "/images/category-images/for-you/new.webp",
          },
          {
            category: "hair_mask",
            img: "/images/category-images/for-you/new.webp",
          },
          {
            category: "combo",
            img: "/images/category-images/for-you/new.webp",
          },
          {
            category: "view_all",
            img: "/images/category-images/for-you/new.webp",
          },
        ],
      },
      {
        category: "gifting",
        img: "/images/category-images/for-you/new.webp",
        subCategories: [
          {
            category: "lipstick_set",
            img: "/images/category-images/for-you/new.webp",
          },
          {
            category: "sugar_merch",
            img: "/images/category-images/for-you/new.webp",
          },
          {
            category: "value_set",
            img: "/images/category-images/for-you/new.webp",
          },
          {
            category: "makeup_kit",
            img: "/images/category-images/for-you/new.webp",
          },
          {
            category: "corporate_gifting",
            img: "/images/category-images/for-you/new.webp",
          },
          {
            category: "sugar_set",
            img: "/images/category-images/for-you/new.webp",
          },
        ],
      },
    ],
  },
};
