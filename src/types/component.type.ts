import type { FOOTER_CATEGORIES } from '@/constants/footer.constants';
import type { IconProps } from '@iconify/react';
import type { ButtonHTMLAttributes, JSX, ReactNode, RefObject, VideoHTMLAttributes } from 'react';
import type { TGradientPos, TScrollDirection } from './hook.type';

export type TClassName = { className?: string };

export type TContainerClassName = { containerClassName?: string };

export type TChildren = { children?: ReactNode };

export interface IButton extends TClassName {
  buttonProps?: Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'content'>;
  content: IconProps | string;
  pattern: 'primary' | 'secondary' | 'tertiary' | 'outline' | 'transparent';
  leftIcon?: IconProps;
  rightIcon?: IconProps;
}

export interface ILoading extends TClassName {
  text: string;
}

export interface IScrollableGradientContainer extends TClassName, TChildren, TContainerClassName {
  gradientClassNames?: Partial<Record<TGradientPos, string>>;
  direction: TScrollDirection;
}

export interface ILinerGradient extends TClassName {
  position: TGradientPos;
}

export interface IGradientText extends TClassName, TChildren {
  text: string;
  type: 'accent' | 'silver';
  path?: string;
}

export interface IResend extends TClassName {
  label: string;
  count: number;
  onResend?: () => void;
}

type TBaseStatus = TClassName & {
  title: string | ReactNode;
  description?: string | ReactNode;
  divider?: boolean;
};

type TErrorStatus = TBaseStatus & { status: 'error' };
type TEmptyStatus = TBaseStatus & { status: 'empty' };
type TLoadingStatus = TClassName & { status: 'loading'; text?: string };

export type TApiStatus = TErrorStatus | TEmptyStatus | TLoadingStatus;

export interface IModalWrapper extends TClassName {
  isOpen: boolean;
  onClose: () => void;
  children: JSX.Element;
  containerProps?: JSX.IntrinsicElements['div'];
  header?: { title?: string; showCloseIcon?: boolean };
}

export interface IFooterOptionList {
  options: (typeof FOOTER_CATEGORIES)[number]['options'];
  title?: string;
  isFirst?: boolean;
}

export interface IVideoPlayer extends TClassName {
  videoProps: VideoHTMLAttributes<HTMLVideoElement>;
  ref?: RefObject<HTMLVideoElement | null>;
}
