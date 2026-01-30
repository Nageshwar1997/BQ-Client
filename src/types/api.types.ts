import type { AUTH_PROVIDER } from '../constants';
import type { TCategoryBaseL } from './common.types';
import type { TProduct, TRegister, TReview, TShade } from './schema.types';

type TId = { _id: string };
type TTS = { createdAt: string; updatedAt: string };
export interface IUser
  extends
    TId,
    TTS,
    Omit<TRegister, 'confirmPassword' | 'otp' | 'password' | 'profilePic' | 'remember'> {
  profilePic: string;
  providers: (typeof AUTH_PROVIDER)[keyof typeof AUTH_PROVIDER];
}
export interface IAddress extends TId, TTS {}
export interface IShade extends TId, TTS, TShade {
  images: string[];
}
export interface IProduct extends TId, TTS, TProduct {
  commonImages: string[];
  discount: number;
  sellingPrice: number;
  originalPrice: number;
  totalStock: number;
  category: ICategory;
  shades: IShade[];
  reviews: IReview[];
}
interface IL extends TId, TTS, Omit<TCategoryBaseL, 'id' | 'path'> {}

export interface ICategory extends IL {
  parentCategory: IL & { parentCategory: IL };
}

export interface IReview extends TReview, TId, TTS {}

export interface IWishlist extends TId, TTS {
  products: IProduct[];
}

export interface ICartItem extends TId {
  cart: string;
  product: TId &
    Pick<
      IProduct,
      | 'title'
      | 'brand'
      | 'originalPrice'
      | 'sellingPrice'
      | 'discount'
      | 'commonImages'
      | 'totalStock'
    >;
  shade?: TId & Pick<IShade, 'shadeName' | 'images' | 'stock'>;
  quantity: number;
}

export interface ICart extends TId, TTS {
  products: ICartItem[];
}
