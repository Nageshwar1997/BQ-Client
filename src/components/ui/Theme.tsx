import useThemeStore from '@/stores/theme.store';
import type { TClassName } from '@/types/component.type';
import { Icon } from '@iconify/react';

const Theme = ({ className }: TClassName) => {
  const { theme, toggleTheme } = useThemeStore();

  return (
    <button type="button" onClick={toggleTheme} className={`cursor-pointer ${className || ''}`}>
      <Icon
        icon={theme === 'dark' ? 'solar:sun-2-linear' : 'solar:moon-linear'}
        className="text-tertiary hover:text-secondary size-5 md:size-6"
      />
    </button>
  );
};

export default Theme;
