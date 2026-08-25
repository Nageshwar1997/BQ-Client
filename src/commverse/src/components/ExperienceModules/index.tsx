import { Icon } from '@iconify/react';
import { experienceSectionData } from '../../data';
import type { ExperienceSectionProps } from '../../types';

const groupHoverBgMap: Record<string, string> = {
  'bg-module-3d-viz': 'group-hover:bg-module-3d-viz',
  'bg-module-ar': 'group-hover:bg-module-ar',
  'bg-module-configurator': 'group-hover:bg-module-configurator',
  'bg-module-tryon': 'group-hover:bg-module-tryon',
  'bg-module-video': 'group-hover:bg-module-video',
  'bg-module-social': 'group-hover:bg-module-social',
  'bg-module-storefront': 'group-hover:bg-module-storefront',
};

const getIconClassName = (
  item: (typeof experienceSectionData)[number],
  isSelected: boolean,
  showHover: boolean
) => {
  const base = 'size-6 rounded-md p-1';

  if (isSelected) {
    return `${base} text-white ${item.bgClassName}`;
  }

  if (showHover) {
    return `${base} border-neutral-gray-200 border ${item.className} group-hover:text-neutral-gray-100 ${groupHoverBgMap[item.bgClassName]}`;
  }

  return `${base} border-neutral-gray-200 border ${item.className}`;
};

const ExperienceModules = ({
  modules,
  isSelected = false,
  showHover = false,
}: ExperienceSectionProps) => {
  const activeModules = experienceSectionData.filter((item) =>
    modules.some((module) => module.variant === item.variant)
  );

  if (activeModules.length === 0) return null;

  return (
    <div className="flex items-center gap-2">
      {activeModules.map((item) => {
        const moduleData = modules.find((m) => m.variant === item.variant);
        const count = moduleData?.count ?? 0;

        return (
          <div key={item.variant} className="relative">
            <Icon
              icon={item.icon}
              className={getIconClassName(item, isSelected, showHover)}
            />
            {count > 0 && (
              <span className="bg-neutral-gray-700 font-metropolis absolute bottom-[calc(100%-8px)] left-[calc(100%-8px)] z-10 flex aspect-square min-h-2 min-w-2 items-center justify-center rounded-full p-1 pt-1.5 text-[10px] text-white">
                {count}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ExperienceModules;
