import type { ReactNode } from 'react';
import type { IButton, TClassName } from './component.type';

interface IBaseToast extends TClassName {
  icon?: ReactNode;
  buttonProps?: Partial<IButton>;
}

type TToastClosable = {
  isClosable?: boolean;
  autoClose?: boolean;
  closeTimer?: number;
};

type TTitleDescription = {
  title: string;
  description: string;
};

export interface IDefaultToast extends IBaseToast, TToastClosable, TTitleDescription {
  type: 'success' | 'error' | 'warning' | 'default';
}

export interface ICustomToast extends IBaseToast, TToastClosable {
  type: 'custom';
  children: ReactNode;
  title?: never;
  description?: never;
}

export interface ILoadingToast extends IBaseToast, TTitleDescription {
  type: 'loading';
  isClosable?: never;
  autoClose?: never;
  closeTimer?: never;
}

export type TToast = IDefaultToast | ICustomToast | ILoadingToast;

export type TToastItem = TToast & { id: string };

export interface IToastStore {
  toasts: TToastItem[];
  addToast: (toast: TToast) => void;
  removeToast: (id: string) => void;
}

export type TTheme = 'light' | 'dark';

export type TThemeStore = {
  theme: TTheme;
  toggleTheme: () => void;
};
