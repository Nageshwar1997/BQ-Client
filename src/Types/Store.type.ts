import type { ReactNode } from 'react';
import type { IUser } from './api.type';
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
  addToast: (toast: TToast) => string;
  removeToast: (id: string) => void;
}

export type TTheme = 'light' | 'dark';

export type TThemeStore = {
  theme: TTheme;
  toggleTheme: () => void;
};

export type TUserStore = {
  user: IUser | null;
  authenticated: boolean;
  setUser: (user: IUser | null) => void;
};

export type ActionFn = () => void | Promise<void>;

export type ActionItem = {
  id: string;
  fn: ActionFn;
  retries: number;
  maxRetries: number;
};

export type TActionsStore = {
  actions: ActionItem[];

  addAction: (fn: ActionFn, options?: { maxRetries?: number }) => string;

  removeAction: (id: string) => void;
  clearActions: () => void;

  runNextAction: () => Promise<void>;
  runAllActions: () => Promise<void>;
};
