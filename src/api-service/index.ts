import {
  AddressService,
  AuthService,
  BlogService,
  CartService,
  GFormService,
  MediaService,
  OrderService,
  ProductService,
  ReviewService,
  UserService,
} from './service';

export const service = {
  address: new AddressService(),
  auth: new AuthService(),
  blog: new BlogService(),
  cart: new CartService(),
  gForm: new GFormService(),
  media: new MediaService(),
  order: new OrderService(),
  product: new ProductService(),
  review: new ReviewService(),
  user: new UserService(),
};
