import { Collections, Eyes, Face, ForYou, Lips, Skin } from '../../Components/Layout';
import {
  CareIcon,
  CashIcon,
  GiftCardIcon,
  PercentCircleIcon,
  ShoppingBag,
  TrackIcon,
  TruckIcon,
  UserCircleIcon,
} from '../../Icons';
import type { ICategoryL1 } from '@/Types';
import { bath_and_body, gifting, hair_care, sugar_pop } from './collections';
import { eye_value_set, eyebrows, eyeliners, eyeshadow, kohl_and_kajal, mascaras } from './eyes';
import {
  bronzers_and_contours,
  cheeks_and_glow,
  concealers_and_correctors,
  face_makeup,
  foundations_by_finish,
  foundations_by_skin_type,
  primers_and_removers,
  setting_and_finishing,
  traditional_and_essentials,
} from './face';
import { blogs, new_new, offers, sugar_play } from './for-you';
import {
  finish_types,
  lip_care,
  lip_enhancers_and_other,
  lipstick_forms,
  lipstick_sets_and_combos,
  long_lasting_lipsticks,
} from './lips';
import { cleansing_and_exfoliation, face_mask, moisturizers, natures_blend } from './skin';

export const NAVBAR_TOP_LAYER_DATA = [
  {
    text: 'Refer a Friend',
    icon: CashIcon,
    className: 'stroke-secondary',
    path: '/refer',
    private: true,
  },
  { text: 'Gift Card', icon: GiftCardIcon, className: 'fill-secondary', path: '/offers' },
  { text: 'BQ Care', icon: CareIcon, className: 'fill-secondary', path: '/contact' },
  {
    text: 'Track Orders',
    icon: TrackIcon,
    className: 'stroke-secondary',
    path: '/track',
    private: true,
  },
];

export const USER_MENU_POPUP_DATA = [
  { text: 'My Profile', icon: UserCircleIcon, path: '/account', private: true },
  { text: 'My Profile', icon: TrackIcon, path: '/account/track', private: true },
  { text: 'Track Orders', icon: TruckIcon, path: '/account/orders', private: true },
  { text: 'Cart', icon: ShoppingBag, path: '/account/cart', private: true },
  { text: 'Offers', icon: PercentCircleIcon, path: '/offers' },
];

export const HIGHLIGHTED_CATEGORIES = {
  about: ['mission_vision_values', 'retail_e_commerce'],
  collections: ['best_of_sugar_pop', 'soap', 'serum', 'sugar_set'],
  eyes: [
    'kohl',
    'curl_lengthening_mascara',
    'liquid_eyeliner',
    'glitter_eyeshadow',
    'brow_pencil',
    'eye_combo',
  ],
  face: [
    'color_corrector',
    'compact',
    'makeup_remover',
    'matte_foundation',
    'cheek_stain',
    'sindoor',
    'compact_powder',
  ],
  lips: [
    'lip_gloss',
    'liquid_lipstick',
    'lip_tint_and_stain',
    'lipstick_fixer_and_remover',
    'lip_glitter',
    'lip_palette',
  ],
  skin: ['serum', 'sunscreen', 'aquaholic', 'face_pack'],
};

export const for_you: ICategoryL1 = {
  id: 1,
  level: 1,
  label: 'For You',
  category: 'for_you',
  path: '/products/for_you',
  component: ForYou,
  subCategories: [new_new, sugar_play, offers, blogs], // NOTE -  only new is reserved keyword we can't use new so new_new used
};

export const lips: ICategoryL1 = {
  id: 2,
  level: 1,
  label: 'Lips',
  category: 'lips',
  path: '/products/lips',
  component: Lips,
  subCategories: [
    finish_types,
    lipstick_forms,
    long_lasting_lipsticks,
    lip_care,
    lip_enhancers_and_other,
    lipstick_sets_and_combos,
  ],
};

export const eyes: ICategoryL1 = {
  id: 3,
  level: 1,
  label: 'Eyes',
  category: 'eyes',
  path: '/products/eyes',
  component: Eyes,
  subCategories: [kohl_and_kajal, mascaras, eyeliners, eyeshadow, eyebrows, eye_value_set],
};

export const face: ICategoryL1 = {
  id: 4,
  level: 1,
  label: 'Face',
  category: 'face',
  path: '/products/face',
  component: Face,
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
};

export const skin: ICategoryL1 = {
  id: 5,
  level: 1,
  label: 'Skin',
  category: 'skin',
  path: '/products/skin',
  component: Skin,
  subCategories: [moisturizers, cleansing_and_exfoliation, natures_blend, face_mask],
};

export const collections: ICategoryL1 = {
  id: 6,
  level: 1,
  label: 'Collections',
  category: 'collections',
  path: '/products/collections',
  component: Collections,
  subCategories: [bath_and_body, sugar_pop, hair_care, gifting],
};
