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

const CLOUDINARY_BASE_URL =
  "https://res.cloudinary.com/drbhw0nwt/image/upload/f_auto,q_auto";

/* ============================== IMAGE URLs START ============================== */
const NEW_NEW = `${CLOUDINARY_BASE_URL}/v1751646152/Beautinique/Category_Images/7-4-2025_1751646152150_New.webp`;
const SUGAR_PLAY = `${CLOUDINARY_BASE_URL}/v1751646152/Beautinique/Category_Images/7-4-2025_1751646152166_Sugar_Play.webp`;
const COLLECTION = `${CLOUDINARY_BASE_URL}/v1751652153/Beautinique/Category_Images/7-4-2025_1751652153458_Collection.webp`;
const POWDER = `${CLOUDINARY_BASE_URL}/v1751647408/Beautinique/Category_Images/7-4-2025_1751647408012_Powder.webp`;
const FREE_SUGAR_POP = `${CLOUDINARY_BASE_URL}/v1751652153/Beautinique/Category_Images/7-4-2025_1751652153466_Free-Suagar-Pop.webp`;
const VANEETA_KIT = `${CLOUDINARY_BASE_URL}/v1751649052/Beautinique/Category_Images/7-4-2025_1751649052471_Vaneeta-kit.webp`;
const GIFTING = `${CLOUDINARY_BASE_URL}/v1751648747/Beautinique/Category_Images/7-4-2025_1751648747422_gifting.webp`;
const LIPS = `${CLOUDINARY_BASE_URL}/v1751647020/Beautinique/Category_Images/7-4-2025_1751647020348_Lips.webp`;
const LIPSTICKS = `${CLOUDINARY_BASE_URL}/v1751647122/Beautinique/Category_Images/7-4-2025_1751647122238_Lipsticks.webp`;
const LA_LA_LOVE = `${CLOUDINARY_BASE_URL}/v1751652153/Beautinique/Category_Images/7-4-2025_1751652153480_La-La-Love.webp`;
const PRIMER = `${CLOUDINARY_BASE_URL}/v1751650181/Beautinique/Category_Images/7-4-2025_1751650181649_Primer.webp`;
const LIP_CREAM =
  "${CLOUDINARY_BASE_URL}/v1751651100/Beautinique/Category_Images/7-4-2025_1751651100120_Lip-Cream.webp";
const SUGAR_ELITE = `${CLOUDINARY_BASE_URL}/v1751652153/Beautinique/Category_Images/7-4-2025_1751652153544_Sugar-Elite.webp`;
const SUGAR_POP_BAG = `${CLOUDINARY_BASE_URL}/v1751653191/Beautinique/Category_Images/7-4-2025_1751653191664_Sugar-Pop-Bag.jpg`;
const ULTRASTAY = `${CLOUDINARY_BASE_URL}/v1751647973/Beautinique/Category_Images/7-4-2025_1751647973417_Ultrastay.webp`;
const LIPSTICKS_SETS = `${CLOUDINARY_BASE_URL}/v1751647558/Beautinique/Category_Images/7-4-2025_1751647558674_Lipsticks-Sets.webp`;
const BEAUTY_SAVING_OFFER = `${CLOUDINARY_BASE_URL}/v1751652153/Beautinique/Category_Images/7-4-2025_1751652153495_Beauty-Saving-Offer.webp`;
const BLUSH = `${CLOUDINARY_BASE_URL}/v1751650082/Beautinique/Category_Images/7-4-2025_1751650081924_Blush.webp`;
const YOUR_SKIN = `${CLOUDINARY_BASE_URL}/v1751649312/Beautinique/Category_Images/7-4-2025_1751649311972_Your-Skin.webp`;
const EYES = `${CLOUDINARY_BASE_URL}/v1751650267/Beautinique/Category_Images/7-4-2025_1751650267526_Eyes.webp`;
const FACE = `${CLOUDINARY_BASE_URL}/v1751649704/Beautinique/Category_Images/7-4-2025_1751649704730_Face.webp`;
const FOUNDATION = `${CLOUDINARY_BASE_URL}/v1751649854/Beautinique/Category_Images/7-4-2025_1751649854080_Foundation.webp`;
const TAPSI_SUGAR_MAKEUP = `${CLOUDINARY_BASE_URL}/v1751650920/Beautinique/Category_Images/7-4-2025_1751650920058_Tapsi-Sugar-Makeup.webp`;
const MASCARA = `${CLOUDINARY_BASE_URL}/v1751650592/Beautinique/Category_Images/7-4-2025_1751650592254_Mascara.webp`;
const KOHLS_AND_KAJAL = `${CLOUDINARY_BASE_URL}/v1751650492/Beautinique/Category_Images/7-4-2025_1751650492382_Kohls-and-kajal.webp`;
const PRETTY_PICKS_MAKEUP = `${CLOUDINARY_BASE_URL}/v1751647973/Beautinique/Category_Images/7-4-2025_1751647973400_Pretty-Picks-Makeup.webp`;
const EYEBROW = `${CLOUDINARY_BASE_URL}/v1751650655/Beautinique/Category_Images/7-4-2025_1751650655914_Eyebrow.webp`;
const COMPLETE_MAKEUP_KIT = `${CLOUDINARY_BASE_URL}/v1751647973/Beautinique/Category_Images/7-4-2025_1751647973405_Complete_Makeup_Kit.webp`;
const ALL_IN_ONE = `${CLOUDINARY_BASE_URL}/v1751647973/Beautinique/Category_Images/7-4-2025_1751647973407_All_In_One.gif`;
const NAILS = `${CLOUDINARY_BASE_URL}/v1751649579/Beautinique/Category_Images/7-4-2025_1751649579274_Nails.gif`;
/* ============================== IMAGE URLs END ============================== */

/* ============================== FOR_YOU START ============================== */
/* ==================== SUB-CATEGORIES ==================== */
const new_new = {
  category: "new",
  img: NEW_NEW,
  subCategories: [{ category: "new_arrivals", img: NEW_NEW }],
};

const sugar_play = {
  category: "sugar_play",
  img: SUGAR_PLAY,
  subCategories: [{ category: "sugar_play", img: SUGAR_PLAY }],
};

/* ============================== MAIN FOR_YOU CATEGORY ============================== */
const for_you = {
  category: "for_you",
  img: NEW_NEW,
  subCategories: [new_new, sugar_play],
};
/* ============================== FOR_YOU END ============================== */

/* ============================== LIPS START ============================== */
/* ==================== SUB-CATEGORIES ==================== */
const finish_types = {
  category: "finish_types",
  img: LIPSTICKS,
  subCategories: [
    { category: "matte_lipstick", img: LIPS },
    { category: "satin_lipstick", img: COLLECTION },
    { category: "hi_shine_lipstick", img: COLLECTION },
    { category: "lip_gloss", img: LIPS },
  ],
};

const lipstick_forms = {
  category: "lipstick_forms",
  img: COLLECTION,
  subCategories: [
    { category: "liquid_lipstick", img: LIPS },
    { category: "powder_lipstick", img: POWDER },
    { category: "crayon_lipstick", img: POWDER },
    { category: "bullet_lipstick", img: POWDER },
  ],
};

const long_lasting_lipsticks = {
  category: "long_lasting_lipsticks",
  img: LA_LA_LOVE,
  subCategories: [
    { category: "transfer_proof_lipstick", img: LIPS },
    { category: "water_proof_lipstick", img: LA_LA_LOVE },
    { category: "lip_tint_and_stain", img: LA_LA_LOVE },
    { category: "smudge_proof_lipstick", img: LA_LA_LOVE },
  ],
};

const lip_care = {
  category: "lip_care",
  img: LIPS,
  subCategories: [
    { category: "lip_primer_and_scrub", img: PRIMER },
    { category: "lipstick_fixer_and_remover", img: LIPS },
    { category: "lip_balm", img: LIPS },
    { category: "tinted_lip_balm", img: LIPS },
  ],
};

const lip_enhancers_and_other = {
  category: "lip_enhancers_and_other",
  img: LIP_CREAM,
  subCategories: [
    { category: "lip_liner", img: LIP_CREAM },
    { category: "lip_glitter", img: LIP_CREAM },
    { category: "view_all", img: SUGAR_POP_BAG },
  ],
};

const lipstick_set_and_combo = {
  category: "lipstick_set_and_combo",
  img: LIPSTICKS_SETS,
  subCategories: [
    { category: "lipstick_set", img: LIPSTICKS_SETS },
    { category: "lipstick_combo", img: LIPSTICKS_SETS },
    { category: "lip_palette", img: BEAUTY_SAVING_OFFER },
  ],
};

/* ============================== MAIN LIPS CATEGORY ============================== */
const lips = {
  category: "lips",
  img: LIPS,
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
  img: YOUR_SKIN,
  subCategories: [
    { category: "night_cream", img: COLLECTION },
    { category: "eye_cream", img: EYES },
    { category: "serum", img: SUGAR_ELITE },
    { category: "skincare_kit", img: VANEETA_KIT },
  ],
};

const cleansing_and_exfoliation = {
  category: "cleansing_and_exfoliation",
  img: YOUR_SKIN,
  subCategories: [
    { category: "cleanser", img: YOUR_SKIN },
    { category: "face_wash", img: FACE },
    { category: "exfoliator_and_scrub", img: YOUR_SKIN },
    { category: "sunscreen", img: YOUR_SKIN },
  ],
};

const natures_blend = {
  category: "natures_blend",
  img: SUGAR_ELITE,
  subCategories: [
    { category: "aquaholic", img: SUGAR_ELITE },
    { category: "coffee_culture", img: SUGAR_ELITE },
    { category: "citrus_got_real", img: SUGAR_ELITE },
    { category: "view_all", img: SUGAR_ELITE },
  ],
};

const face_mask = {
  category: "face_mask",
  img: FACE,
  subCategories: [
    { category: "sheet_mask", img: FACE },
    { category: "face_pack", img: FACE },
    { category: "view_all", img: FACE },
  ],
};

/* ============================== MAIN SKIN CATEGORY ============================== */
const skin = {
  category: "skin",
  img: YOUR_SKIN,
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
  img: FACE,
  subCategories: [
    { category: "foundation", img: FOUNDATION },
    { category: "bb_cream", img: FOUNDATION },
    { category: "compact_powder", img: FACE },
    { category: "loose_powder", img: FACE },
    { category: "banana_powder", img: FACE },
    { category: "spf_foundation", img: FACE },
  ],
};

const traditional_and_essentials = {
  category: "traditional_and_essentials",
  img: BEAUTY_SAVING_OFFER,
  subCategories: [{ category: "sindoor", img: BEAUTY_SAVING_OFFER }],
};

const cheeks_and_glow = {
  category: "cheeks_and_glow",
  img: COLLECTION,
  subCategories: [
    { category: "highlighter", img: COLLECTION },
    { category: "liquid_highlighter", img: COLLECTION },
    { category: "blush", img: BLUSH },
    { category: "cheek_stain", img: COLLECTION },
  ],
};

const setting_and_finishing = {
  category: "setting_and_finishing",
  img: POWDER,
  subCategories: [
    { category: "setting_spray", img: POWDER },
    { category: "compact", img: POWDER },
    { category: "fixer", img: POWDER },
  ],
};

const foundations_by_finish = {
  category: "foundations_by_finish",
  img: FOUNDATION,
  subCategories: [
    { category: "liquid_foundation", img: FOUNDATION },
    { category: "matte_foundation", img: FOUNDATION },
    { category: "water_resistant_foundation", img: FOUNDATION },
    { category: "high_coverage_foundation", img: FOUNDATION },
    { category: "stick_foundation", img: FOUNDATION },
  ],
};

const foundations_by_skin_type = {
  category: "foundations_by_skin_type",
  img: FOUNDATION,
  subCategories: [
    { category: "best_for_dry_skin", img: FOUNDATION },
    { category: "best_for_oily_skin", img: FOUNDATION },
  ],
};

const primers_and_removers = {
  category: "primers_and_removers",
  img: PRIMER,
  subCategories: [
    { category: "makeup_remover", img: TAPSI_SUGAR_MAKEUP },
    { category: "primer", img: PRIMER },
  ],
};

const bronzers_and_contours = {
  category: "bronzers_and_contours",
  img: SUGAR_ELITE,
  subCategories: [
    { category: "bronzer", img: SUGAR_ELITE },
    { category: "contour", img: SUGAR_ELITE },
  ],
};

const concealers_and_correctors = {
  category: "concealers_and_correctors",
  img: SUGAR_ELITE,
  subCategories: [
    { category: "color_concealer", img: SUGAR_ELITE },
    { category: "color_corrector", img: SUGAR_ELITE },
  ],
};

/* ============================== MAIN FACE CATEGORY ============================== */
const face = {
  category: "face",
  img: FACE,
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
  img: KOHLS_AND_KAJAL,
  subCategories: [
    { category: "kohl", img: KOHLS_AND_KAJAL },
    { category: "kajal", img: KOHLS_AND_KAJAL },
    { category: "smudge_proof_kajal", img: KOHLS_AND_KAJAL },
  ],
};

const mascaras = {
  category: "mascaras",
  img: MASCARA,
  subCategories: [
    { category: "volumizing_mascara", img: MASCARA },
    { category: "curl_lengthening_mascara", img: MASCARA },
    { category: "waterproof_mascara", img: MASCARA },
  ],
};

const eyeliners = {
  category: "eyeliners",
  img: EYES,
  subCategories: [
    { category: "liquid_eyeliner", img: EYES },
    { category: "gel_eyeliner", img: EYES },
    { category: "pen_eyeliner", img: EYES },
  ],
};

const eyeshadow = {
  category: "eyeshadow",
  img: EYES,
  subCategories: [
    { category: "eyeshadow_palette", img: EYES },
    { category: "liquid_eyeshadow", img: EYES },
    { category: "glitter_eyeshadow", img: EYES },
  ],
};

const eyebrows = {
  category: "eyebrows",
  img: EYEBROW,
  subCategories: [
    { category: "brow_definer", img: EYEBROW },
    { category: "brow_pencil", img: EYEBROW },
    { category: "brow_gel", img: EYEBROW },
  ],
};

const eye_value_set = {
  category: "eye_value_set",
  img: POWDER,
  subCategories: [
    { category: "eyelashes", img: EYES },
    { category: "eye_gift_set", img: POWDER },
    { category: "eye_combo", img: EYES },
  ],
};

/* ============================== MAIN EYES CATEGORY ============================== */

const eyes = {
  category: "eyes",
  img: EYES,
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
  img: COLLECTION,
  subCategories: [
    { category: "shower_gel", img: COLLECTION },
    { category: "soap", img: COLLECTION },
    { category: "body_lotion", img: COLLECTION },
    { category: "body_spray", img: COLLECTION },
    { category: "hand_wash", img: COLLECTION },
    { category: "foot_cream", img: COLLECTION },
    { category: "hand_cream", img: COLLECTION },
  ],
};

const sugar_pop = {
  category: "sugar_pop",
  img: PRETTY_PICKS_MAKEUP,
  subCategories: [
    { category: "lips", img: ULTRASTAY },
    { category: "eyes", img: COMPLETE_MAKEUP_KIT },
    { category: "face", img: COMPLETE_MAKEUP_KIT },
    { category: "nails", img: NAILS },
    { category: "skincare", img: COMPLETE_MAKEUP_KIT },
    { category: "body_care", img: COMPLETE_MAKEUP_KIT },
    { category: "best_of_sugar_pop", img: ALL_IN_ONE },
  ],
};

const hair_care = {
  category: "hair_care",
  img: SUGAR_ELITE,
  subCategories: [
    { category: "shampoo", img: SUGAR_ELITE },
    { category: "conditioner", img: SUGAR_ELITE },
    { category: "hair_oil", img: SUGAR_ELITE },
    { category: "serum", img: SUGAR_ELITE },
    { category: "hair_mask", img: SUGAR_ELITE },
    { category: "combo", img: SUGAR_ELITE },
    { category: "view_all", img: SUGAR_ELITE },
  ],
};

const gifting = {
  category: "gifting",
  img: GIFTING,
  subCategories: [
    { category: "lipstick_set", img: POWDER },
    { category: "sugar_merch", img: FREE_SUGAR_POP },
    { category: "value_set", img: POWDER },
    { category: "makeup_kit", img: VANEETA_KIT },
    { category: "corporate_gifting", img: FREE_SUGAR_POP },
    { category: "sugar_set", img: POWDER },
  ],
};

/* ============================== MAIN COLLECTIONS CATEGORY ============================== */

const collections = {
  category: "collections",
  img: COLLECTION,
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
