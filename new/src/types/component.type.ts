import type { ButtonHTMLAttributes, ReactNode } from 'react';

export type TClassName = { className?: string };

export type TChildren = { children?: ReactNode };

export interface IButton extends TClassName {
  buttonProps?: Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'content'>;
  content: ReactNode | string;
  pattern: 'primary' | 'secondary' | 'tertiary' | 'outline' | 'transparent';
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}
