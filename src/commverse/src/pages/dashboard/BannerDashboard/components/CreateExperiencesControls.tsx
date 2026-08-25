import { Icon } from '@iconify/react';

type FilterKey = 'all' | 'published' | 'drafts';
type Direction = 'asc' | 'desc';

const getFilterConfig = (allIcon: string): Array<{
  key: FilterKey;
  label: string;
  icon: string;
}> => [
  { key: 'all', label: 'All', icon: allIcon },
  { key: 'published', label: 'Published', icon: 'lucide:rocket' },
  { key: 'drafts', label: 'Drafts', icon: 'solar:notes-linear' },
];

interface CreateExperiencesControlsProps {
  activeFilter: FilterKey;
  onFilterChange: (filter: FilterKey) => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  activeAction: 'sort' | 'date';
  onActionChange: (action: 'sort' | 'date') => void;
  dateDirection: Direction;
  onDateDirectionChange: (dir: Direction) => void;
  alphaDirection: Direction;
  onAlphaDirectionChange: (dir: Direction) => void;
  allFilterIcon?: string;
}

const CreateExperiencesControls = ({
  activeFilter,
  onFilterChange,
  searchTerm,
  onSearchChange,
  activeAction,
  onActionChange,
  dateDirection,
  onDateDirectionChange,
  alphaDirection,
  onAlphaDirectionChange,
  allFilterIcon = 'lucide:rotate-3d',
}: CreateExperiencesControlsProps) => {
  const filterConfig = getFilterConfig(allFilterIcon);

  const handleSortClick = () => {
    if (activeAction === 'sort') {
      onAlphaDirectionChange(alphaDirection === 'asc' ? 'desc' : 'asc');
      return;
    }

    onActionChange('sort');
    onAlphaDirectionChange('asc');
  };

  const handleDateClick = () => {
    if (activeAction === 'date') {
      onDateDirectionChange(dateDirection === 'asc' ? 'desc' : 'asc');
      return;
    }

    onActionChange('date');
    onDateDirectionChange('desc');
  };

  return (
    <section
      className="mt-5 flex w-full flex-col gap-4"
      data-node-id="4857:421867"
    >
      <div className="flex w-full items-center justify-between gap-4">
        <h2 className="font-metropolis text-neutral-gray-900 text-[20px] leading-[150%] font-semibold">
          3D Visualizer Experiences
        </h2>

        <div
          className="flex items-center gap-2"
          data-name="Filters"
          data-node-id="4857:422288"
        >
          {filterConfig.map((filter) => {
            const isActive = filter.key === activeFilter;

            return (
              <button
                key={filter.key}
                type="button"
                className={`font-metropolis inline-flex h-10 items-center justify-center gap-1 rounded-[8px] border px-2 text-[12px] leading-[125%] font-medium transition ${
                  isActive
                    ? 'bg-neutral-gray-900 border-neutral-gray-900 text-white'
                    : 'border-neutral-gray-400 text-neutral-gray-700 hover:bg-neutral-gray-150 cursor-pointer bg-white'
                }`}
                onClick={() => onFilterChange(filter.key)}
              >
                <Icon icon={filter.icon} className="size-4 shrink-0" />
                <span>{filter.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div
        className="relative z-20 flex w-full items-center gap-4"
        data-node-id="4858:362258"
      >
        <div
          className="bg-neutral-gray-100 border-neutral-gray-400 flex min-h-10 min-w-0 flex-1 items-center gap-1 rounded-[8px] border px-3 py-2"
          data-name="Input"
          data-node-id="4858:362259"
        >
          <Icon
            icon="solar:magnifer-linear"
            className="text-neutral-gray-500 shrink-0"
            style={{ width: 20, height: 20, flexShrink: 0 }}
            aria-hidden
          />
          <input
            type="text"
            value={searchTerm}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search products"
            className="font-metropolis text-neutral-gray-900 placeholder:text-neutral-gray-500 min-w-0 flex-1 bg-transparent text-[12px] leading-[150%] font-normal outline-none"
          />
        </div>

        <button
          type="button"
          className={`inline-flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center gap-[6px] rounded-[8px] px-4 py-[10px] ${
            activeAction === 'sort'
              ? 'bg-neutral-gray-900 text-neutral-gray-100'
              : 'bg-neutral-gray-300 text-[#1C274C]'
          }`}
          aria-label="Sort"
          data-name="Button"
          data-node-id="4858:362261"
          onClick={handleSortClick}
        >
          <Icon
            icon={
              alphaDirection === 'asc'
                ? 'solar:list-arrow-up-minimalistic-linear'
                : 'solar:list-arrow-down-minimalistic-linear'
            }
            className="shrink-0"
            style={{ width: 20, height: 20, flexShrink: 0 }}
          />
        </button>
        <button
          type="button"
          className={`inline-flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center gap-[6px] rounded-[8px] px-4 py-[10px] ${
            activeAction === 'date'
              ? 'bg-neutral-gray-900 text-neutral-gray-100'
              : 'bg-neutral-gray-300 text-[#1C274C]'
          }`}
          aria-label="Date Filter"
          data-name="Button"
          data-node-id="4858:362262"
          onClick={handleDateClick}
        >
          <Icon
            icon={
              dateDirection === 'desc'
                ? 'lucide:calendar-arrow-down'
                : 'lucide:calendar-arrow-up'
            }
            className="shrink-0"
            style={{ width: 20, height: 20, flexShrink: 0 }}
          />
        </button>
      </div>
    </section>
  );
};

export default CreateExperiencesControls;
