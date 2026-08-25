import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import { useLocation, useNavigate } from 'react-router';
import Chip from '../Chip';
import type { SidebarItem, SidebarButtonProps, ChipVariant } from '../../types';
import { sidebarItems } from '../../data';

const topItems = sidebarItems.slice(0, -1);
const bottomItems = sidebarItems.slice(-1);

const SidebarButton: React.FC<SidebarButtonProps> = ({
  item,
  isActive,
  isHovered,
  onHover,
  showActiveStyle = true,
  chipPosition = 'right',
}) => {
  const isDisabled = !item.path;
  const highlighted = isActive || isHovered;
  const navigate = useNavigate();

  const getIcon = () => {
    if (highlighted && item.fillIcon) return item.fillIcon;
    if (typeof item.icon === 'string') {
      const icon = highlighted
        ? item.icon.replace(/-outline$/, '-bold').replace(/-linear$/, '-bold')
        : item.icon;
      return <Icon icon={icon} width={20} />;
    }
    return item.icon;
  };
  const chipVariantMap: Record<string, ChipVariant> = {
    'Versa AI': 'gradient',
    // Create: 'primary',
  };

  return (
    <button
      onMouseEnter={() => onHover(item.id)}
      onMouseLeave={() => onHover(null)}
      className={`relative flex size-9 items-center justify-center rounded-xl ${
        isDisabled
          ? 'text-neutral-gray-400 cursor-not-allowed!'
          : 'cursor-pointer'
      } ${
        showActiveStyle && isActive && item.path
          ? 'bg-neutral-gray-400 text-neutral-gray-900'
          : 'text-neutral-gray-500 hover:bg-neutral-gray-400 hover:text-neutral-gray-800'
      }`}
      key={item.id}
      onClick={() => !isDisabled && navigate(item.path)}
      aria-disabled={isDisabled}
    >
      {getIcon()}
      {isHovered && (
        <Chip
          text={item.title}
          className={`px-1.5! text-sm! leading-none!`}
          position={chipPosition}
          variant={chipVariantMap[item.title] ?? 'tertiary'}
        />
      )}
    </button>
  );
};

const Sidebar: React.FC = () => {
  const { pathname } = useLocation();
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const isPathActive = (itemPath: string) =>
    pathname === itemPath || pathname.startsWith(`${itemPath}/`);

  const renderItems = (items: SidebarItem[], showActiveStyle = true) =>
    items.map((item) => (
      <SidebarButton
        key={item.id}
        item={item}
        isActive={isPathActive(item.path)}
        isHovered={hoveredId === item.id}
        onHover={setHoveredId}
        showActiveStyle={showActiveStyle}
      />
    ));

  return (
    <aside className="bg-neutral-gray-150 fixed top-0 left-0 z-50 flex h-screen w-16 flex-col items-center border-r border-neutral-400 px-2 py-8">
      {/* <Icon
        icon="solar:hamburger-menu-linear"
        className="text-neutral-gray-900 size-6"
      /> */}
      <div className="mt-2 flex grow flex-col justify-between gap-2">
        <div className="flex flex-col items-center gap-4">
          {renderItems(topItems)}
        </div>
        <div className="flex flex-col items-center gap-4">
          {renderItems(bottomItems)}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
