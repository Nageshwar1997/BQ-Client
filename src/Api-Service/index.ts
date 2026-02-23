import { AddressService } from './Service/Address.service';
import { AuthService } from './Service/Auth.service';
import { BlogService } from './Service/Blog.service';
import { CartService } from './Service/Cart.service';
import { GFormService } from './Service/G-Form.service';
import { MediaService } from './Service/Media.service';
import { OrderService } from './Service/Order.service';
import { ProductService } from './Service/Product.service';
import { ReviewService } from './Service/Review.service';
import { UserService } from './Service/User.service';

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
