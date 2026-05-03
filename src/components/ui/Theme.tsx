import useThemeStore from '@/storess/theme.store';
import type { TClassName } from '@/typess/component.type';
import { Icon } from '@iconify/react';

const Theme = ({ className = '' }: TClassName) => {
  const { theme, toggleTheme } = useThemeStore();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`[&>svg]:stroke-tertiary cursor-pointer [&>svg]:size-5 md:[&>svg]:size-6 ${className}`}
    >
      <Icon
        icon={theme === 'dark' ? 'solar:sun-2-linear' : 'solar:moon-linear'}
        className="text-primary [&_path]:stroke-primary size-6"
        strokeWidth={0.1}
      />
    </button>
  );
};

export default Theme;
