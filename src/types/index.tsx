import {
  ChangeEvent,
  HTMLInputAutoCompleteAttribute,
  KeyboardEvent,
  ReactElement,
  ReactNode,
  RefObject,
  SVGProps,
  VideoHTMLAttributes,
} from "react";
import { UseFormRegisterReturn } from "react-hook-form";

export interface ClassName {
  className?: string;
}

export type ThemeType = "light" | "dark";

export type ThemeStoreType = {
  theme: ThemeType;
  toggleTheme: () => void;
};

export interface ProfilePicInputProps extends ClassName {
  previewUrl?: string;
  previewImage?: string;
  name?: string;
  errorText?: string;
  onChange: (file: File | null) => void;
}

export interface InputProps extends ClassName {
  min?: number;
  max?: number;
  type?: string;
  name?: string;
  value?: string;
  label?: string;
  leftText?: string;
  readOnly?: boolean;
  errorText?: string;
  placeholder?: string;
  successText?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  leftIconClick?: () => void;
  rightIconClick?: () => void;
  containerClassName?: string;
  register?: UseFormRegisterReturn;
  onChange?: (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  onKeyDown?: (
    e: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  autoComplete?: HTMLInputAutoCompleteAttribute | undefined;
}

export interface TextItem {
  text: string;
  isHighlighted?: boolean;
  break?: boolean;
}

export interface TextDisplayProps extends ClassName {
  content: TextItem[];
  contentClassName?: string;
}

export interface RegisterFormInputProps {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
  profilePic?: File; // Correctly type the file input
  remember?: boolean;
}

export interface RegisterInputMapDataProps {
  name: keyof RegisterFormInputProps;
  label?: string;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
}

export type LoginTypes = "email" | "phoneNumber";

export interface LoginFormInputProps {
  loginMethod: LoginTypes;
  email?: string;
  phoneNumber?: string;
  password: string;
  remember?: boolean;
}

export interface LoginInputMapDataProps {
  name: keyof LoginFormInputProps;
  label?: string;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
}

export interface RadioProps extends ClassName {
  value: string;
  onChange: (value: string) => void;
  options: { label: string; value: string }[];
}

export interface VerticalScrollType {
  top: boolean;
  bottom: boolean;
}

export interface HorizontalScrollType {
  left: boolean;
  right: boolean;
}

export type IconProps = SVGProps<SVGSVGElement>;

export interface UserTypes {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  profilePic: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserStoreType {
  user: UserTypes | null;
  isAuthenticated: boolean;
  setUser: (user: UserTypes) => void;
  logout: () => void;
}

export interface QueryParams {
  [key: string]: string;
}

export interface CategoryType {
  level: number;
  name: string;
  category: string;
}

export type LevelThreeCategoryType = CategoryType;

export interface LevelTwoCategoryType extends CategoryType {
  subCategories: LevelThreeCategoryType[];
}

export interface LevelOneCategoryType extends CategoryType {
  subCategories: LevelTwoCategoryType[];
}

export interface ShadeType {
  shadeName: string;
  colorCode: string;
  stock: number | undefined;
  images: (File | string)[];
}

export interface FetchedShadeType extends ShadeType {
  _id: string;
  images: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ProductType {
  title: string;
  brand: string;
  description: string;
  howToUse?: string;
  ingredients?: string;
  additionalDetails?: string;
  categoryLevelOne: { name: string; category: string };
  categoryLevelTwo: { name: string; category: string };
  categoryLevelThree: { name: string; category: string };
  originalPrice: number | undefined;
  sellingPrice: number | undefined;
  totalStock: number | undefined;
  commonImages: (File | string)[];
  shades?: ShadeType[];
}

export interface PopulatedCategory {
  _id: string;
  name: string;
  category: string;
  level: number;
  parentCategory: {
    _id: string;
    name: string;
    category: string;
    level: number;
    parentCategory: {
      _id: string;
      name: string;
      category: string;
      level: number;
    };
  };
}

export interface ReviewType {
  _id?: string;
  rating: number;
  title: string;
  comment: string;
  images: (string | File)[];
  videos: (string | File)[];
  user: string;
  product: string;
}

export interface ReviewType {
  _id?: string;
  rating: number;
  title: string;
  comment: string;
  images: (string | File)[];
  videos: (string | File)[];
  user: string;
  product: string;
}

export interface FetchedReviewType
  extends Omit<ReviewType, "images" | "videos" | "user"> {
  images: string[];
  videos: string[];
  user: UserTypes;
  createdAt: string;
  updatedAt: string;
}

export interface FetchedProductType extends ProductType {
  _id: string;
  createdAt: string;
  updatedAt: string;
  commonImages: string[];
  discount: number;
  sellingPrice: number;
  originalPrice: number;
  category: PopulatedCategory;
  shades: FetchedShadeType[];
  reviews: FetchedReviewType[];
}

export type TDropdownOption = { name: string; value: string };
export interface TDropdownOptions extends ClassName {
  options: TDropdownOption[];
  selected: string;
  onChange: (opt: TDropdownOption) => void;
  onSelect?: () => void;
}

export interface TDropdown extends ClassName {
  title: string | ReactElement;
  icons?: Partial<Record<"left" | "right", ReactElement>>;
  children: ReactElement<{ onSelect?: () => void }>;
  closeOnOutsideClick?: boolean;
  isAbsolute?: boolean;
  showShadow?: boolean;
  closeOnOptionClick?: boolean;
  options?: TDropdownOption[];
  isRounded?: boolean;
}

export type TMediaType = "image" | "video";

export type TCarouselOption = { type: TMediaType; url: string };

export interface ICarouselOptions {
  data: TCarouselOption[];
}

export interface TMediaCarousel extends ClassName, ICarouselOptions {
  currentIndex?: number | null;
  setCurrentIndex: (index: number) => void;
  thumbnailRefs?: RefObject<(HTMLDivElement | null)[]>;
  onImageClick?: () => void;
}

export interface IVideo {
  videoProps?: VideoHTMLAttributes<HTMLVideoElement>;
}

export interface IVideoPlayer extends ClassName, IVideo {}

export interface IMediaCarouselWithParentMedia
  extends ClassName,
    IVideo,
    ICarouselOptions {
  selected?: number | null;
  needButtonControls?: boolean;
}

export type TPossibleTimeFormats =
  | "DD-MM-YYYY"
  | "DD/MM/YYYY"
  | "LT"
  | "LTS"
  | "L"
  | "LL"
  | "LLL"
  | "LLLL"
  | "l"
  | "ll"
  | "lll"
  | "llll";
