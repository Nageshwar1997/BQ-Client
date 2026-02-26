import { MoonIcon, SunIcon } from '@/Icons';
import { ThemeStore } from '@/Stores';
import type { TClassName } from '@/Types/Common.type';

export const Theme = ({ className }: TClassName) => {
  const { theme, toggleTheme } = ThemeStore();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`[&>svg]:stroke-tertiary cursor-pointer [&>svg]:size-5 md:[&>svg]:size-6 ${className}`}
    >
      {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
    </button>
  );
};
