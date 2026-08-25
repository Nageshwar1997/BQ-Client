import { Icon } from '@iconify/react';
import Divider from '../../../../../../components/Divider';
import type { ExperienceCardType, ModuleType } from '../../../../../../types';
import { Fragment } from 'react/jsx-runtime';
import { experienceSectionData } from '../../../../../../data';
import ExperienceModuleItem from './ExperienceModuleItem';
import { useOutletContext } from 'react-router';
import type { ToastCardProps } from '../../../../../../types';

interface ContextType {
  setEditing: (val: { id: string; moduleIndex: number; type: string; link?: string } | null) => void;
  setToastCardProps: (val: ToastCardProps | undefined) => void;
}

const ExperienceCard = ({
  id,
  data,
  isOpen,
  onToggle,
}: {
  id: string;
  data: ExperienceCardType;
  isOpen: boolean;
  onToggle: () => void;
}) => {
  const { setEditing, setToastCardProps } = useOutletContext<ContextType>();
  return (
    <div
      className="border-neutral-gray-200 flex flex-col gap-3 rounded-xl border p-2 transition-all duration-300 hover:bg-neutral-gray-150"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src={data.image}
            className="aspect-square h-12 w-12 rounded-xl object-cover"
          />
          <div className="flex flex-col">
            <div className="text-xs leading-[18px] font-medium">
              {data.title}
            </div>
            <div className="text-neutral-gray-600 flex gap-1 text-[10px] leading-[14px]">
              <div className="font-semibold">{data.category}</div>
              <div className="-translate-y-0.5">.</div>
              <div>{data.price}</div>
            </div>
          </div>
        </div>
        <div className="flex gap-6 px-3">
          {data.modules.length > 0 && (
            <Fragment>
              <div className="flex gap-3">
                {data.modules.map((module: ModuleType, index: number) => {
                  const selectedModule = experienceSectionData.find((s: any) =>
                    Array.isArray(s.type) ? s.type.includes(module.type) : s.type === module.type
                  );
                  if (!selectedModule) return null;

                  return (
                    <div
                      key={index}
                      className={`relative flex h-6 w-6 items-center justify-center rounded-md border p-1 ${isOpen ? `${selectedModule.bgClassName} text-neutral-gray-100 border-transparent` : `${selectedModule.className} border-neutral-gray-200`}`}
                    >
                      <Icon icon={selectedModule.icon} />
                      <div className="bg-neutral-gray-700 text-neutral-gray-100 absolute -top-1 -right-2 flex h-4 w-4 items-center justify-center rounded-full text-[10px] leading-[14px] font-semibold">
                        {module.count}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="bg-neutral-gray-300 h-6 w-px" />
            </Fragment>
          )}
          <Icon
            icon="solar:alt-arrow-down-linear"
            className={`h-6 w-6 cursor-pointer transition-transform duration-300 ${isOpen ? 'rotate-180' : 'text-neutral-gray-400 -rotate-90'}`}
            onClick={onToggle}
          />
        </div>
      </div>
      <div
        className={`grid w-full transition-all duration-150 ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
      >
        <div className="flex flex-col gap-3 overflow-hidden">
          <Divider className="border-t-neutral-gray-200! border-transparent!" />
          <div className="flex flex-col">
            {data.modules.map((module: ModuleType, index: number) => {
              return (
                <Fragment key={index}>
                  <div className="flex flex-col">
                    <ExperienceModuleItem
                      type={module.type}
                      link={module.link}
                      onEdit={() => setEditing({ id, moduleIndex: index, type: module.type, link: module.link })}
                      onCopy={() => {
                        navigator.clipboard.writeText(module.link);
                        setToastCardProps({ type: 'success', title: 'Link copied to clipboard' });
                      }}
                      toOpen={() => window.open(module.link.startsWith('http') ? module.link : `https://${module.link}`, '_blank')}
                    />
                    {index !== data.modules.length - 1 && (
                      <Divider className="border-t-neutral-gray-200! my-[7px]! border-transparent!" />
                    )}
                  </div>
                </Fragment>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExperienceCard;
