import type { IUser } from './api.type';

export type TTheme = 'light' | 'dark';

export interface IThemeStore {
  theme: TTheme;
  toggleTheme: () => void;
}

export interface IUserStore {
  user: IUser | null;
  authenticated: boolean;
  setUser: (user: IUser | null) => void;
}

type TActionFn = () => void | Promise<void>;

export interface IActionItem {
  id: string;
  fn: TActionFn;
  retries: number;
  maxRetries: number;
}

export interface IActionsStore {
  actions: IActionItem[];
  addAction: (fn: TActionFn, options?: { maxRetries?: number }) => string;
  removeAction: (id: string) => void;
  clearActions: () => void;
  runNextAction: () => Promise<void>;
  runAllActions: () => Promise<void>;
}
