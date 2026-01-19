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
};
