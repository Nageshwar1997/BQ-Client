import { Icon } from '@iconify/react';
import Button from '../../../../components/Button';
import ExperienceCard from '../../../product-inventory/components/ExperienceCard';
import { moduleMap } from '../../../../constants';
import type { TModules } from '../../../../types';
import { useEffect, useRef, useState } from 'react';

export type CreateExperienceItem = {
  id: string;
  status: 'published' | 'draft';
  title: string;
  updatedAt: string;
  experienceType?: string;
  totalViews: string;
  imageUrl: string;
};

const CreateExperiencesGrid = ({
  experiences = [],
  emptyStateTitle,
  emptyStateDescription,
  emptyStateButtonText,
  emptyStateButtonIcon,
  onEmptyStateButtonClick,
  onEdit,
  onDelete,
  onPreview,
  onCopyLink,
  onCopyEmbedCode,
  onPublish,
  onUnpublish,
  onRename,
}: {
  experiences?: CreateExperienceItem[];
  emptyStateTitle: string;
  emptyStateDescription: string;
  emptyStateButtonText: string;
  emptyStateButtonIcon: string;
  onEmptyStateButtonClick: () => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onPreview?: (siteInfo: any, expType: string) => void;
  onCopyLink?: (siteInfo: any, expType: string) => void;
  onCopyEmbedCode?: (siteInfo: any, expType: string) => void;
  onPublish?: (id: string) => void;
  onUnpublish?: (id: string, experienceType: string) => void;
  onRename?: (id: string) => void;
}) => {
  const [columns, setColumns] = useState(1);
  const gridRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (experiences.length === 0) {
      setColumns(1);
      return;
    }

    const calculateColumns = () => {
      const container = gridRef.current;
      if (!container) return;

      const containerWidth = container.clientWidth;

      const minColumnWidth = 220;
      const gap = 12;
      const cols = Math.floor((containerWidth + gap) / (minColumnWidth + gap));
      setColumns(cols || 1);
    };

    calculateColumns();

    const resizeObserver = new ResizeObserver(calculateColumns);
    if (gridRef.current) {
      resizeObserver.observe(gridRef.current);
    }

    window.addEventListener('resize', calculateColumns);
    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', calculateColumns);
    };
  }, [experiences.length]);

  const hasRowFilled = experiences.length >= columns;

  if (experiences.length === 0) {
    // ... empty state code remains same
    return (
      <section className="mt-3 w-full">
        <div className="flex min-h-[420px] w-full flex-col items-center justify-center py-8">
          <div
            className="flex flex-col items-center gap-8"
            data-node-id="6671:403326"
          >
            <img
              src="/assets/icons/file-send.svg"
              alt=""
              aria-hidden
              className="aspect-video w-[clamp(145px,11.3vw,220px)] shrink-0 object-contain"
              data-node-id="6671:403327"
            />
            <div className="flex flex-col items-center gap-3">
              <div className="flex flex-col items-center gap-1 text-center">
                <p className="font-metropolis text-neutral-gray-600 text-[14px] leading-[125%] font-medium">
                  {emptyStateTitle}
                </p>
                <p className="font-metropolis text-neutral-gray-500 text-[12px] leading-[150%] font-normal">
                  {emptyStateDescription}
                </p>
              </div>
            </div>

            <Button
              variant="secondary"
              content={emptyStateButtonText}
              leftIcon={
                <Icon
                  icon={emptyStateButtonIcon}
                  style={{ width: 20, height: 20, flexShrink: 0 }}
                />
              }
              className="h-10 w-fit! rounded-[8px]! px-4 py-[10px] [&>div]:gap-[6px] [&>div>span]:text-[14px] [&>div>span]:leading-[125%] [&>div>span]:font-semibold"
              onClick={onEmptyStateButtonClick}
            />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="mt-3 w-full">
      <div
        ref={gridRef}
        id="exp-grid"
        className={`grid gap-3 ${
          hasRowFilled
            ? '[grid-template-columns:repeat(auto-fit,minmax(220px,1fr))]'
            : '[grid-template-columns:repeat(auto-fit,minmax(220px,230px))]'
        }`}
      >
        {experiences.map((item: any) => {
          return (
            <ExperienceCard
              key={item.id}
              // variant="compact"
              status={item.status}
              imageUrl={item.imageUrl}
              title={item.title}
              updatedAt={item.updatedAt}
              experienceType={item.experienceType}
              onEdit={() => onEdit?.(item.id)}
              onDelete={() => onDelete?.(item.id)}
              onPreview={() =>
                onPreview?.(
                  item.siteInfo,
                  moduleMap[item.experienceType as TModules]
                )
              }
              onCopyLink={() =>
                onCopyLink?.(
                  item.siteInfo,
                  moduleMap[item.experienceType as TModules] || ''
                )
              }
              onCopyEmbedCode={() =>
                onCopyEmbedCode?.(
                  item.siteInfo,
                  moduleMap[item.experienceType as TModules] || ''
                )
              }
              onPublish={() => onPublish?.(item.id)}
              onUnpublish={() => onUnpublish?.(item.id, item.experienceType)}
              onRename={() => onRename?.(item.id)}
            />
          );
        })}
      </div>
    </section>
  );
};

export default CreateExperiencesGrid;
