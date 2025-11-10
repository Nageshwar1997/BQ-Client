import {
  ButtonHTMLAttributes,
  FC,
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
import z from "zod";
import {
  ADDRESS_TYPES,
  ALLOWED_CURRENCIES,
  ALLOWED_PAYMENT_MODE,
  ORDER_STATUS,
  RAZORPAY_PAYMENT_METHODS,
  RAZORPAY_PAYMENT_STATUS,
} from "../constants";
import { loginSchema, registerSchema } from "../pages/auth/helpers/auth.schema";
import { addressSchema } from "../schemas/address";
import { footerCategories } from "../components/footer/data";

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

export type TId = { _id: string };

export interface ITimeStamp extends TId {
  createdAt: string;
  updatedAt: string;
}

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

export type TRegister = z.infer<typeof registerSchema>;
export type TLogin = z.infer<typeof loginSchema>;

export type TPasswordField = keyof Pick<
  TRegister,
  "password" | "confirmPassword"
>;

export interface RegisterInputMapDataProps {
  name: keyof TRegister;
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

export interface UserTypes
  extends Pick<TRegister, "firstName" | "lastName" | "email" | "phoneNumber">,
    ITimeStamp {
  profilePic: string;
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

export interface FetchedShadeType extends ShadeType, ITimeStamp {
  images: string[];
  stock: number;
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

export type TCartProduct = TId & {
  cart: string;
  product: TId &
    Pick<
      FetchedProductType,
      | "title"
      | "brand"
      | "originalPrice"
      | "sellingPrice"
      | "discount"
      | "commonImages"
      | "totalStock"
    >;
  shade?: TId & Pick<FetchedShadeType, "shadeName" | "images" | "stock">;
  quantity: number;
};

export interface ICart extends ITimeStamp {
  charges: number;
  products: TCartProduct[];
}

export interface PopulatedCategory extends TId {
  name: string;
  category: string;
  level: number;
  parentCategory: TId & {
    name: string;
    category: string;
    level: number;
    parentCategory: TId & {
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
  extends Omit<ReviewType, "images" | "videos" | "user">,
    ITimeStamp {
  images: string[];
  videos: string[];
  user: UserTypes;
}

export interface FetchedProductType extends ProductType, ITimeStamp {
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
  videoProps: VideoHTMLAttributes<HTMLVideoElement>;
  ref?: RefObject<HTMLVideoElement | null>;
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
  | "validUrl"
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

export interface IFooterOptionList {
  options: (typeof footerCategories)[number]["options"];
  title?: string;
  isFirst?: boolean;
}

export type TBaseAddress = z.infer<typeof addressSchema>;
export interface IAddress extends TBaseAddress, ITimeStamp {
  user: string;
}

export interface IUserAddresses extends ITimeStamp {
  user: string;
  addresses: IAddress[];
  defaultAddress: string | null;
}

export interface IAddressCard extends ClassName {
  address: IAddress;
  handleAddressSelect: (
    type: (typeof ADDRESS_TYPES)[number],
    id: string
  ) => void;
  isBilling?: boolean;
  isShipping?: boolean;
  isBoth?: boolean;
}

export interface TAddressForm {
  name: keyof TBaseAddress;
  label: string;
  placeholder: string;
  autoComplete: string;
  type?: string;
  options?: TDropdownOption[];
}

export interface ModalProps extends ClassName {
  isOpen: boolean;
  onClose: () => void;
  children: JSX.Element;
  containerProps?: JSX.IntrinsicElements["div"];
  heading?: string;
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
  modalProps?: Omit<ModalProps, "children">;
  buttons?: {
    left?: Omit<ButtonProps, "pattern">;
    right?: Omit<ButtonProps, "pattern">;
  };
}

export interface IOrder {
  _id: string;
  user: string;
  products: TCartProduct[];
  addresses: {
    shipping?: Omit<IAddress, "user"> | null;
    billing?: Omit<IAddress, "user"> | null;
    both?: Omit<IAddress, "user"> | null;
  };
  razorpay_payment_result: {
    payment_mode: (typeof ALLOWED_PAYMENT_MODE)[number];
    currency: (typeof ALLOWED_CURRENCIES)[number];
    rzp_order_id: string;
    rzp_payment_id: string;
    rzp_signature: string;
    rzp_payment_status: (typeof RAZORPAY_PAYMENT_STATUS)[number];
  };
  order_result: {
    order_status: (typeof ORDER_STATUS)[number];
    price: number;
    discount: number;
    charges: number;
    order_receipt: string;
    paid_at?: Date;
    delivered_at?: Date;
    cancelled_at?: Date;
    returned_at?: Date;
  };
  payment_details?: {
    method: (typeof RAZORPAY_PAYMENT_METHODS)[number];
    refund_status?: string | null;
    bank?: string | null;
    wallet?: string | null;
    email: string;
    contact: string;
    fee: number;
    tax: number;
    upi?: {
      acquirer_data: { rrn: string; upi_transaction_id: string; vpa: string };
    };
    netbanking?: { acquirer_data: { bank_transaction_id: string } };
    card?: {
      token_id: string;
      acquirer_data: { auth_code: string };
      card: {
        id?: string;
        name?: string;
        last4: string;
        network: string;
        type: string;
        issuer: string;
      };
    };
  };
  createdAt: Date;
  updatedAt: Date;
}

// ========== Teams Page Types ==========
export type TEmployee = {
  name: string;
  role: string;
  gender: string;
  image: string;
  description?: { title: string; description: string };
};

export type TBaseDept = {
  title: string;
  value: string;
};

export interface IDepartment extends TBaseDept {
  employees: TEmployee[];
}

export type TRoleOpening = {
  role: string;
  experience: string;
  description: string;
  type: string;
  location: string;
  salary: string;
  tags: string[];
  technologies: string[];
  summary: string;
  responsibilities: string[];
  requirements: string[];
  qualifications: string[];
  benefits: string[];
};

export interface IOpening {
  department: TBaseDept & {
    color: string;
    icon?: FC<IconProps>;
  };
  openings: TRoleOpening[];
}
