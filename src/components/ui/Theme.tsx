import type { TClassName } from '../../types';
import { MoonIcon, SunIcon } from '../../icons';
import { store } from '../../store';

export const Theme = ({ className }: TClassName) => {
  const { theme, toggleTheme } = store.theme();

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
