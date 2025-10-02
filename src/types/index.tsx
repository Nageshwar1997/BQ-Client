import {
  ButtonHTMLAttributes,
  InputHTMLAttributes,
  JSX,
  ReactElement,
  ReactNode,
  RefObject,
  SelectHTMLAttributes,
  SVGProps,
  TextareaHTMLAttributes,
  VideoHTMLAttributes,
} from "react";
import { UseFormRegisterReturn } from "react-hook-form";
import { ADDRESS_TYPES } from "../constants";

export interface ClassName {
  className?: string;
}

export type TTheme = "light" | "dark";

export type TThemeStore = {
  theme: TTheme;
  toggleTheme: () => void;
};

export type TAuthAction = {
  action: (() => void) | null;
  setAction: (action: () => void) => void;
  runAction: () => void;
  clearAction: () => void;
};

export interface ProfilePicInputProps extends ClassName {
  previewUrl?: string;
  previewImage?: string;
  name?: string;
  errorText?: string;
  onChange: (file: File | null) => void;
}

export type TFile = "image" | "video";

export type TMediaOption = { type: TFile; url: string };

interface TBaseInput extends ClassName {
  containerClassName?: string;
  needRef?: boolean;
  icons?: { left?: TInputIcon; right?: Omit<TInputIcon, "text"> };
  register?: UseFormRegisterReturn;
  label?: string;
  error?: string;
}

type TInputIcon = { text?: string; icon?: ReactNode; onClick?: () => void };

export interface IInput extends TBaseInput {
  inputProps: InputHTMLAttributes<HTMLInputElement>;
}

export interface ISelect extends Omit<TBaseInput, "icons" | "needRef"> {
  selectProps: SelectHTMLAttributes<HTMLSelectElement> &
    Partial<Pick<InputHTMLAttributes<HTMLInputElement>, "placeholder">>;
  icons?: { left?: TInputIcon };
  options: TDropdownOption[];
  optionsClassName?: string;
  optionsPosition?: "top" | "bottom";
}

export interface ITextArea extends Omit<TBaseInput, "icons"> {
  textAreaProps: TextareaHTMLAttributes<HTMLTextAreaElement>;
}

export interface IFileInput extends Omit<TBaseInput, "error"> {
  fileInputProps: Omit<InputHTMLAttributes<HTMLInputElement>, "type">;
  errors?: string[];
  handleRemoveImage?: (index: number) => void;
  previews?: TMediaOption[];
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

export type TPasswordField = keyof Pick<
  RegisterFormInputProps,
  "password" | "confirmPassword"
>;
export type TPasswordVisibility = Record<TPasswordField, boolean>;

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

export interface IQueryParams {
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
  stock: number;
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

export type TCartProduct = {
  _id: string;
  cart: string;
  product: Pick<
    FetchedProductType,
    | "_id"
    | "title"
    | "brand"
    | "originalPrice"
    | "sellingPrice"
    | "discount"
    | "commonImages"
    | "totalStock"
  >;
  shade?: Pick<FetchedShadeType, "_id" | "shadeName" | "images" | "stock">;
  quantity: number;
};

export interface ICart {
  _id: string;
  charges: number;
  createdAt: string;
  updatedAt: string;
  products: TCartProduct[];
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
  rating: number;
  title: string;
  comment: string;
  images: (string | File)[];
  videos: (string | File)[];
  user: string;
  product: string;
  likes: string[];
  dislikes: string[];
  helpful: string[];
}

export interface FetchedReviewType
  extends Omit<ReviewType, "images" | "videos" | "user"> {
  _id: string;
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
  totalStock: number;
  category: PopulatedCategory;
  shades: FetchedShadeType[];
  reviews: FetchedReviewType[];
}

export type TDropdownOption = {
  name: string;
  value: string;
  disabled?: boolean;
};
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
  defaultOpen?: boolean;
}

export interface ICarouselOptions {
  data: TMediaOption[];
}

export interface TMediaCarousel extends ClassName, ICarouselOptions {
  selected?: number | null;
  onClick: (index: number) => void;
  thumbnailRefs?: RefObject<(HTMLDivElement | null)[]>;
  handleRemove?: (index: number) => void;
  gradientClassName?: string;
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
  handleRemove?: (index: number) => void;
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

export type TRegexes =
  | "noSpace"
  | "singleSpace"
  | "hexCode"
  | "date"
  | "validName"
  | "password"
  | "validEmail"
  | "validPinCode"
  | "validGST"
  | "validPhone"
  | "phoneStart"
  | "phoneExactLength"
  | "onlyDigits"
  | "onlyLetters"
  | "onlyUppercase"
  | "onlyLowercase"
  | "atLeastOneDigit"
  | "onlyLettersAndSpaces"
  | "atLeastOneLowercaseLetter"
  | "atLeastOneSpecialCharacter"
  | "atLeastOneUppercaseLetter"
  | "onlyLettersAndSpacesAndDots";

type TFooterOption = {
  title: string;
  disable?: boolean;
  path?: string;
};

export interface IFooterOptionList {
  options: TFooterOption[];
  title?: string;
  isFirst?: boolean;
}

export interface IAddress extends IBaseAddress {
  _id: string;
  user: string;
  createdAt: string;
  updatedAt: string;
}

export interface IBaseAddress
  extends Pick<UserTypes, "firstName" | "lastName" | "email" | "phoneNumber"> {
  altPhoneNumber?: string;
  address: string;
  landmark?: string;
  city: string;
  state: string;
  pinCode: string;
  country: string;
  gst?: string;
  type: (typeof ADDRESS_TYPES)[number];
}

export interface IUserAddresses {
  _id: string;
  user: string;
  addresses: IAddress[];
  defaultAddress: string | null;
}

export interface IAddressCard {
  address: IAddress;
  handleAddressSelect: (
    type: (typeof ADDRESS_TYPES)[number],
    id: string
  ) => void;
  isBilling?: boolean;
  isShipping?: boolean;
  isBoth?: boolean;
  className?: string;
}

export interface TAddressForm {
  name: keyof IBaseAddress;
  label: string;
  placeholder: string;
  autoComplete: string;
  type?: string;
  options?: TDropdownOption[];
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: JSX.Element;
  containerProps?: JSX.IntrinsicElements["div"];
  heading?: string;
  className?: string;
}

export interface ButtonProps extends ClassName {
  buttonProps?: Omit<
    ButtonHTMLAttributes<HTMLButtonElement>,
    "children" | "content"
  >;
  content: ReactNode | string;
  pattern: "primary" | "secondary" | "tertiary" | "outline" | "transparent";
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

export interface IConfirmModal {
  type: "success" | "error" | "warning" | "custom";
  title?: string;
  description?: string;
  children?: ReactNode;
  modalProps?: ModalProps;
  buttons?: {
    left?: Omit<ButtonProps, "pattern">;
    right?: Omit<ButtonProps, "pattern">;
  };
}
