import type { ButtonHTMLAttributes, ReactNode } from 'react';
import type { TGradientPos, TScrollDirection } from './hook.type';
import type { IconProps } from '@iconify/react';

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
