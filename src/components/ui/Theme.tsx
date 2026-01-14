import type { TClassName } from '../../types';
import { MoonIcon, SunIcon } from '../../icons';
import { useThemeStore } from '../../store';

export const Theme = ({ className }: TClassName) => {
  const { theme, toggleTheme } = useThemeStore();

  return (
    <button type="button" onClick={toggleTheme} className={`cursor-pointer ${className}`}>
      {theme === 'dark' ? (
        <SunIcon className="stroke-tertiary h-5 w-5 md:h-6 md:w-6" />
      ) : (
        <MoonIcon className="stroke-tertiary h-5 w-5 md:h-6 md:w-6" />
      )}
    </button>
  );
};
