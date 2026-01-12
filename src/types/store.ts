// Theme Types

export type TTheme = 'light' | 'dark';

export type TThemeStore = {
  theme: TTheme;
  toggleTheme: () => void;
};
