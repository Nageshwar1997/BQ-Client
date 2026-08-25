import { Icon } from '@iconify/react';
import type { RefObject } from 'react';
import Button from '../../../components/Button';
import FilterDropdown from '../../../components/FilterDropdown';
import type { SelectedOption } from '../../../types';

interface VersaExportOptionsCardProps {
  outsideClickRef: RefObject<HTMLDivElement | null>;
  exportFormat: string;
  formattedOptions: string[];
  onExportFormatChange: (format: string) => void;
  onDownload: () => void;
  copyUrl?: string;
  copied: boolean;
  onCopy: () => void;
}

export function VersaExportOptionsCard({
  outsideClickRef,
  exportFormat,
  formattedOptions,
  onExportFormatChange,
  onDownload,
  copyUrl,
  copied,
  onCopy,
}: VersaExportOptionsCardProps) {
  return (
    <div
      ref={outsideClickRef}
      className="border-neutral-gray-200 bg-neutral-gray-100 shadow-toast-card absolute top-full right-0 z-100 mt-4 flex w-xs flex-col gap-5 rounded-xl border p-5"
    >
      <div className="flex flex-col gap-3">
        <span className="font-metropolis text-sm leading-4.5 font-semibold">
          Export Options
        </span>
        <div className="flex items-center gap-2">
          <FilterDropdown
            innerLabel={exportFormat}
            options={formattedOptions.map((value, idx) => ({
              id: value,
              label: value,
              value,
              default: idx === 0,
            }))}
            onChange={(val) =>
              onExportFormatChange((val as SelectedOption)?.value || '')
            }
            className="[&>button]:bg-neutral-gray-300 [&>button>svg]:text-neutral-gray-700 h-10 w-1/2! **:uppercase [&>button]:h-full [&>button]:min-w-full [&>button]:border-none [&>button>span]:font-semibold [&>button>span:nth-child(2)]:hidden! [&>button>svg]:size-5"
          />
          <Button
            content="Download"
            size="sm"
            onClick={onDownload}
            className="h-10! w-1/2!"
            disabled={!exportFormat}
          />
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <span className="font-metropolis text-sm leading-4.5 font-semibold">
          Share
        </span>
        <span className="font-metropolis border-neutral-gray-400 truncate rounded-lg border px-2 py-1 text-sm leading-4.5 font-normal">
          {copyUrl}
        </span>
        <div className="flex items-center gap-2">
          {/* <Button
            variant="ghost"
            content="Preview"
            size="sm"
            className="h-10! w-1/2! text-sm!"
            rightIcon={<Icon icon="solar:arrow-right-up-linear" className="size-5" />}
          /> */}
          <Button
            variant="tertiary"
            content={copied ? 'Copied' : 'Copy Link'}
            size="sm"
            leftIcon={<Icon icon="solar:copy-linear" className="size-5" />}
            onClick={onCopy}
            className="h-10! text-sm!"
          />
        </div>
      </div>
    </div>
  );
}
