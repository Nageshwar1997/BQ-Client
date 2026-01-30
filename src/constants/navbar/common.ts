import { ForYou } from '../../components';
import {
  CareIcon,
  CashIcon,
  GiftCardIcon,
  PercentCircleIcon,
  ShoppingBag,
  TrackIcon,
  TruckIcon,
  UserCircleIcon,
} from '../../icons';
import type { ICategoryL1 } from '../../types';
import { blogs, new_new, offers, sugar_play } from './for-you';

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
