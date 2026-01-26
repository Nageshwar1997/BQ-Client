// Theme Types

import type { IUser } from './common.types';

export type TTheme = 'light' | 'dark';

export type TThemeStore = {
  theme: TTheme;
  toggleTheme: () => void;
};

export type TUserStore = {
  user: IUser | null;
  authenticated: boolean;
  setUser: (user: IUser) => void;
  localLogout: () => void;
};
