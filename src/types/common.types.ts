import type {
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
} from 'react';

import type { UseFormRegisterReturn } from 'react-hook-form';
import type { ICategory, IProduct, IReview, IShade, IUser } from './api.types';
import type { TAddress, TLogin, TRegister } from './schema.types';
import type { FOOTER_CATEGORIES } from '../constants';

export type TClassName = { className?: string };

export type TChildren = { children?: ReactNode };

export interface ILoading extends TClassName {
  text: string;
}

export interface IGradientText extends TClassName, TChildren {
  text: string;
  type: 'accent' | 'silver';
  path?: string;
}

export type TIcon = SVGProps<SVGSVGElement>;

export type TStringRecord = Record<string, string>;

export type TPagination = Partial<Record<'page' | 'limit', number>>;

export type TParams = TStringRecord;

export type TFile = 'image' | 'video';

export type TMediaOption = { type: TFile; url: string };

export type TGradientPos = 'top' | 'bottom' | 'left' | 'right';

export interface IVideo {
  videoProps: VideoHTMLAttributes<HTMLVideoElement>;
  ref?: RefObject<HTMLVideoElement | null>;
}

export interface IVideoPlayer extends TClassName, IVideo {}

export type TScrollDirection = 'horizontal' | 'vertical';

export interface IScrollableGradientContainer
  extends TClassName, TChildren, Pick<IBaseInput, 'containerClassName'> {
  gradientClassNames?: Partial<Record<TGradientPos, string>>;
  direction: TScrollDirection;
}

export interface IMediaCarousel
  extends TClassName, Pick<IScrollableGradientContainer, 'gradientClassNames'> {
  media: TMediaOption[];
  selected?: number | null;
  onClick: (index: number) => void;
  thumbnailRefs?: RefObject<(HTMLDivElement | null)[]>;
  handleRemove?: (index: number) => void;
}

export interface IMediaCarouselWithParent
  extends TClassName, IVideo, Pick<IMediaCarousel, 'media' | 'selected' | 'handleRemove'> {
  needButtonControls?: boolean;
}

export type TInputIcon = { text?: string; icon?: ReactNode; onClick?: () => void };
export interface IBaseInput extends TClassName {
  containerClassName?: string;
  needRef?: boolean;
  icons?: { left?: TInputIcon; right?: Omit<TInputIcon, 'text'> };
  register?: UseFormRegisterReturn;
  label?: string;
  error?: string;
}

type TFormInputMap = {
  label: string;
  type: string;
  autoComplete: string;
  placeholder: string;
};

export interface TLoginInput extends TFormInputMap {
  name: keyof TLogin;
}
export interface TRegisterInput extends TFormInputMap {
  name: keyof TRegister;
}

export interface TAddressInput extends TFormInputMap {
  name: keyof TAddress;
  options?: TDropdownOption[];
}

export interface IInput extends IBaseInput {
  inputProps: InputHTMLAttributes<HTMLInputElement>;
}
export interface ITextArea extends Omit<IBaseInput, 'icons'> {
  textAreaProps: TextareaHTMLAttributes<HTMLTextAreaElement>;
}

export interface IFileInput extends Omit<IBaseInput, 'error'> {
  fileInputProps: Omit<InputHTMLAttributes<HTMLInputElement>, 'type'>;
  errors?: string[];
  handleRemoveImage?: (index: number) => void;
  previews?: TMediaOption[];
  mediaModalClassName?: string;
  mediaCarouselClassName?: string;
}
export interface ICheckbox extends IBaseInput {
  labelClassName?: string;
  rightText?: string | ReactNode;
  checkboxProps: Omit<InputHTMLAttributes<HTMLInputElement>, 'type'>;
}
export interface IRadio extends TClassName {
  value: string;
  onChange: (value: string) => void;
  options: { label: string; value: string }[];
}

export interface ISelect extends Omit<IBaseInput, 'icons' | 'needRef' | 'register'> {
  selectProps: SelectHTMLAttributes<HTMLSelectElement> &
    Partial<Pick<InputHTMLAttributes<HTMLInputElement>, 'placeholder'>>;
  icons?: { left?: Omit<TInputIcon, 'text'> };
  options: TDropdownOption[];
  optionsClassName?: string;
  optionsPosition?: 'top' | 'bottom';
}

export type TAuthAction = {
  action: (() => void) | null;
  setAction: (action: () => void) => void;
  runAction: () => void;
  clearAction: () => void;
};

export interface IButton extends TClassName {
  buttonProps?: Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'content'>;
  content: ReactNode | string;
  pattern: 'primary' | 'secondary' | 'tertiary' | 'outline' | 'transparent';
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

export interface IModalWrapper extends TClassName {
  isOpen: boolean;
  onClose: () => void;
  children: JSX.Element;
  containerProps?: JSX.IntrinsicElements['div'];
  header?: { title?: string; showCloseIcon?: boolean };
}

export interface IApiStatus extends TClassName {
  error?: Partial<Record<'title' | 'description', string | ReactNode>>;
  empty?: Partial<Record<'title' | 'description', string | ReactNode>>;
  loading?: { title: string };
  showHrLine?: boolean;
  status: 'error' | 'empty' | 'loading';
}

export type TRegexes =
  | 'noSpace'
  | 'singleSpace'
  | 'hexCode'
  | 'date'
  | 'name'
  | 'password'
  | 'email'
  | 'otp'
  | 'pin_code'
  | 'gst'
  | 'url'
  | 'phone'
  | 'phoneStart'
  | 'phoneExactLength'
  | 'onlyDigits'
  | 'onlyLetters'
  | 'onlyUppercase'
  | 'onlyLowercase'
  | 'atLeastOneDigit'
  | 'onlyLettersAndSpaces'
  | 'atLeastOneLowercaseLetter'
  | 'atLeastOneSpecialCharacter'
  | 'atLeastOneUppercaseLetter'
  | 'only_letters_and_spaces_and_dots'
  | 'pan';

export type TCategoryBaseL = {
  id: number;
  path?: string;
  level: number;
  label: string;
  category: string;
};

export interface ICategoryL1 extends TCategoryBaseL {
  component: FC;
  subCategories: ICategoryL2[];
}

export interface ICategoryL2 extends TCategoryBaseL {
  subCategories: ICategoryL3[];
  heading?: string;
  videoUrl?: string;
  thumbnail?: string;
  description?: string;
}

export interface ICategoryL3 extends TCategoryBaseL {
  icon: FC<TIcon>;
  description: string;
}

export type TApiQueryProps = {
  pageParams?: TPagination;
  queryParams?: TParams;
  enabled?: boolean;
};

export interface IApiProductQueryProps extends TApiQueryProps {
  requiredFields?: (keyof IProduct)[];
  populateFields?: {
    shades?: (keyof IShade)[];
    seller?: Omit<keyof IUser, 'password'>[];
    category?: (keyof ICategory)[];
    reviews?: (keyof IReview)[];
  };
}

export interface IApiReviewQueryProps extends TApiQueryProps {
  requiredFields?: (keyof IReview)[];
  populateFields?: { user?: Omit<keyof IUser, 'password'>[] };
}

export type TLikeDislikeHelpfulReview = {
  liked?: boolean;
  disliked?: boolean;
  isHelpful?: boolean;
};

export type TDropdownOption = {
  label: string;
  value: string;
  disabled?: boolean;
};

export interface IDropdownOptions extends TClassName {
  options: TDropdownOption[];
  selected: string;
  onChange: (opt: TDropdownOption) => void;
  onSelect?: () => void;
}

export interface TDropdown extends TClassName, Partial<Pick<IDropdownOptions, 'options'>> {
  title: string | ReactElement;
  icons?: Partial<Record<'left' | 'right', ReactElement>>;
  children: ReactElement<{ onSelect?: () => void }>;
  closeOnOutsideClick?: boolean;
  isAbsolute?: boolean;
  showShadow?: boolean;
  closeOnOptionClick?: boolean;
  isRounded?: boolean;
  defaultOpen?: boolean;
}

export interface IFooterOptionList {
  options: (typeof FOOTER_CATEGORIES)[number]['options'];
  title?: string;
  isFirst?: boolean;
}
