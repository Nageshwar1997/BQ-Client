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
} from './Service';

export const Service = {
  Address: new AddressService(),
  Auth: new AuthService(),
  Blog: new BlogService(),
  Cart: new CartService(),
  GForm: new GFormService(),
  Media: new MediaService(),
  Order: new OrderService(),
  Product: new ProductService(),
  Review: new ReviewService(),
  User: new UserService(),
};
