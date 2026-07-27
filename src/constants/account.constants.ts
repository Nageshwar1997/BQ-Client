import { ROUTES } from './common.constants';

const { PROFILE } = ROUTES;

export const ACCOUNT_SIDEBAR_DATA = [
  {
    title: 'Profile',
    icon: 'solar:user-circle-linear',
    path: `/${PROFILE.BASE}`,
  },
  {
    title: 'Orders',
    icon: 'solar:delivery-linear',
    path: `/${PROFILE.BASE}/${PROFILE.ORDERS}`,
  },
  {
    title: 'Addresses',
    icon: 'solar:map-point-linear',
    path: `/${PROFILE.BASE}/${PROFILE.ADDRESSES}`,
  },
  {
    title: 'Wishlist',
    icon: 'solar:heart-linear',
    path: `/${PROFILE.BASE}/${PROFILE.WISHLIST}`,
  },
  {
    title: 'My Reviews',
    icon: 'solar:star-linear',
    path: `/${PROFILE.BASE}/${PROFILE.REVIEWS}`,
  },
  {
    title: 'Refer a Friend',
    icon: 'solar:users-group-rounded-linear',
    path: `/${PROFILE.BASE}/${PROFILE.REFER_A_FRIEND}`,
  },
  {
    title: 'Gift Cards',
    icon: 'ic:round-card-giftcard',
    path: `/${PROFILE.BASE}/${PROFILE.GIFT_CARDS}`,
  },
  {
    title: 'Notifications',
    icon: 'solar:bell-linear',
    path: `/${PROFILE.BASE}/${PROFILE.NOTIFICATIONS}`,
  },
] as const;
