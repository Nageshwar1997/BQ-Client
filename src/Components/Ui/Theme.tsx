import { MoonIcon, SunIcon } from '@/Icons';
import { Store } from '@/Stores';
import type { TClassName } from '@/Types';

export const Theme = ({ className }: TClassName) => {
  const { theme, toggleTheme } = Store.Theme();

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
