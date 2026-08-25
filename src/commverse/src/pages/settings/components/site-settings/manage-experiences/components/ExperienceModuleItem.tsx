import { Icon } from '@iconify/react';
import { experienceSectionData } from '../../../../../../data';

interface ExperienceModuleItemProps {
    type: string;
    link: string;
    onEdit: () => void;
    onCopy: () => void;
    toOpen: () => void;
}

const ExperienceModuleItem = ({
    type,
    link,
    onEdit,
    onCopy,
    toOpen,
}: ExperienceModuleItemProps) => {
    const selectedModule = experienceSectionData.find((m: any) =>
        Array.isArray(m.type) ? m.type.includes(type) : m.type === type
    );

    if (!selectedModule) return null;

    return (
        <div className="flex h-[33px] w-full min-w-0 items-center justify-between">
            <div className="flex min-w-0 flex-1 items-center gap-4">
                <div className="flex shrink-0 items-center gap-[9px]">
                    <Icon
                        icon={selectedModule.icon}
                        className={`h-4 w-4 ${selectedModule.className}`}
                    />
                    <div className="text-[10px] font-medium leading-[14px]">
                        {selectedModule.title}
                    </div>
                </div>
                <div className="flex min-w-0 flex-1 items-center gap-0.5">
                    <div className="bg-neutral-gray-100 flex min-w-0 items-center rounded-sm px-1 py-0.5">
                        <div className="text-brand w-full overflow-hidden text-[10px] font-semibold text-ellipsis whitespace-nowrap leading-[14px]">
                            {link}
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex shrink-0 items-center gap-[18px] pr-2">

                <div
                    className="bg-neutral-gray-100 flex h-6 w-6 shrink-0 cursor-pointer items-center justify-center rounded-sm p-1 hover:bg-neutral-gray-200 transition-colors"
                    onClick={toOpen}
                >
                    <Icon icon="solar:arrow-right-up-linear" className="h-5 w-5" />
                </div>
                <div
                    className="bg-neutral-gray-100 flex h-6 w-6 shrink-0 cursor-pointer items-center justify-center rounded-sm p-1 hover:bg-neutral-gray-200 transition-colors"
                    onClick={onEdit}
                >
                    <Icon icon="solar:pen-linear" className="h-5 w-5" />
                </div>
                <div
                    className="bg-neutral-gray-100 flex h-6 w-6 shrink-0 cursor-pointer items-center justify-center rounded-sm p-1 hover:bg-neutral-gray-200 transition-colors"
                    onClick={onCopy}
                >
                    <Icon icon="solar:copy-linear" className="h-5 w-5" />
                </div>
            </div>
        </div>
    );
};

export default ExperienceModuleItem;
