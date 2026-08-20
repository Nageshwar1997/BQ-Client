import { MediaApi } from './MediaApi';
import { ContactApi, SellerApi } from './OrganizationApi';
import { CategoryApi, ProductApi } from './ProductApi';
import { AuthApi, UserApi } from './UserApi';

export const authApi = new AuthApi();
export const userApi = new UserApi();

export const categoryApi = new CategoryApi();
export const productApi = new ProductApi();

export const mediaApi = new MediaApi();

export const contactApi = new ContactApi();
export const sellerApi = new SellerApi();
