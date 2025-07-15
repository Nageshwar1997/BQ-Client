import {
  ChangeEvent,
  HTMLInputAutoCompleteAttribute,
  JSX,
  KeyboardEvent,
  ReactNode,
  SVGProps,
} from "react";
import { UseFormRegisterReturn } from "react-hook-form";

export type ThemeType = "light" | "dark";

export type ThemeStoreType = {
  theme: ThemeType;
  toggleTheme: () => void;
};

export interface ProfilePicInputProps {
  previewUrl?: string;
  previewImage?: string;
  name?: string;
  className?: string;
  errorText?: string;
  onChange: (file: File | null) => void;
}

export interface InputProps {
  type?: string;
  name?: string;
  value?: string;
  label?: string;
  readOnly?: boolean;
  errorText?: string;
  className?: string;
  placeholder?: string;
  successText?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  leftText?: { required?: boolean; text: string | ReactNode };
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

export interface TextDisplayProps {
  content: TextItem[];
  className?: string;
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

export interface RadioProps {
  value: string;
  onChange: (value: string) => void;
  options: { label: string; value: string }[];
  className?: string;
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
  _id?: string;
  shadeName: string;
  colorCode: string;
  stock: number | undefined;
  images: (File | string)[];
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

export interface FetchedProductType extends ProductType {
  _id: string;
  createdAt: string;
  updatedAt: string;
  commonImages: string[];
  discount: number;
  sellingPrice: number;
  originalPrice: number;
  category: PopulatedCategory;
  shades: ShadeType[];
}

export interface ReviewType {
  rating: number;
  title: string;
  comment: string;
  images: (string | File)[];
  videos: (string | File)[];
  user: string;
}

export type TDropdownOption = { name: string; value: string };
export interface TDropdownOptions {
  options: TDropdownOption[];
  selected: string;
  onChange: (opt: TDropdownOption) => void;
  className?: string;
}

export interface TDropdown {
  heading: { title: string; icon?: JSX.Element };
  className?: { open?: string; closed?: string; common?: string };
  containerClassName?: { open?: string; closed?: string; common?: string };
  children?: JSX.Element;
}
