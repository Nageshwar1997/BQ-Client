import { Icon } from '@iconify/react';

import useThemeStore from '@/stores/theme.store';
import type { IClassName } from '@/types/component.type';

const Theme = ({ className = '' }: IClassName) => {
  const theme = useThemeStore((s) => s.theme);
  const toggleTheme = useThemeStore((s) => s.toggleTheme);

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
      className={`size-5 cursor-pointer md:size-6 ${className}`}
    >
      <Icon
        icon={theme === 'dark' ? 'line-md:sunny-loop' : 'line-md:moon-loop'}
        className="text-tertiary hover:text-secondary size-full [&_path]:stroke-[1.5]"
      />
    </button>
  );
};

export default Theme;
