import { Icon } from '@iconify/react';
import type { ModuleCardProps } from '../../types';
import { useNavigate } from 'react-router';

export const ModuleCard = ({
  module,
  selectable = false,
  selected = false,
  onSelect,
  direction = 'column',
  moduleClassName = '',
}: ModuleCardProps) => {
  const { title, desc, icon, bgImage, className, selectedClassName } = module;
  const navigate = useNavigate();
  const isActive = selectable && selected;
  const handleClick = () => {
    if (selectable) {
      onSelect?.(module);
    } else if (module.path) {
      // Ensure path is absolute
      const absolutePath = module.path.startsWith('/')
        ? module.path
        : `/${module.path}`;
      navigate(absolutePath);
    }
  };
  return (
    <div
      onClick={handleClick}
      className={`group flex w-full max-w-50 cursor-pointer ${direction === 'row' ? 'flex-row' : 'flex-col'} gap-4 rounded-xl border-[1.5px] px-5 py-6 ${bgImage ? 'relative overflow-hidden' : ''} ${isActive ? selectedClassName : `border-neutral-gray-200 hover:shadow-[0_0_16px_0_rgba(46,156,255,0.2)] ${className}`} ${moduleClassName}`}
    >
      {bgImage && (
        <img
          className="absolute inset-0 h-full w-full object-cover"
          src={bgImage}
        />
      )}
      <Icon icon={icon} className="size-9 shrink-0" />

      <div>
        <h3 className="font-metropolis text-neutral-gray-900 text-base leading-5 font-semibold">
          {title}
        </h3>
        <p
          className={`font-metropolis text-sm leading-4.5 font-normal ${
            isActive
              ? 'text-neutral-gray-900'
              : 'text-neutral-gray-600 group-hover:text-neutral-gray-900'
          }`}
        >
          {desc}
        </p>
      </div>
    </div>
  );
};
