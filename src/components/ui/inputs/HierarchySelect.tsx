import { Icon } from '@iconify/react';
import { type ChangeEvent, useMemo, useState } from 'react';

import ApiStatus from '@/components/layout/ApiStatus';
import { useOutsideClick } from '@/hooks/useOutsideClick';
import type { IChildren } from '@/types/component.type';
import type {
  IHierarchySelect,
  IHierarchySelectOption,
  IHierarchySelectTreeNode,
} from '@/types/input.type';

import { InputError, InputIcon, InputLabel } from './children';
import Input from './Input';

const IconContainer = ({ children }: IChildren) => (
  <div className="flex size-5 shrink-0 items-center justify-center">{children}</div>
);

const filterTree = (nodes: IHierarchySelectOption[], keyword: string): IHierarchySelectOption[] => {
  if (!keyword.trim()) return nodes;

  const lower = keyword.toLowerCase();

  return nodes.reduce<IHierarchySelectOption[]>((acc, node) => {
    const searchableText = node.searchLabel ?? (typeof node.label === 'string' ? node.label : '');

    const matched = searchableText.toLowerCase().includes(lower);

    const children = node.children ? filterTree(node.children, keyword) : [];

    if (matched || children.length) {
      acc.push({
        ...node,
        children,
      });
    }

    return acc;
  }, []);
};

const TreeNode = ({
  node,
  level = 0,
  value,
  expanded,
  onToggle,
  onSelect,
}: IHierarchySelectTreeNode) => {
  const hasChildren = !!node.children?.length;
  const isExpanded = expanded[node.value];
  const isSelected = value === node.value;

  return (
    <>
      <li
        className={`hover:bg-primary/5 text-tertiary flex items-center gap-2 rounded-sm px-2 py-1.5 text-[13px] ${
          isSelected ? 'bg-primary/8' : ''
        } ${node.disabled ? 'cursor-not-allowed opacity-80' : 'cursor-pointer'}`}
        style={{ paddingLeft: `${String(level * 10)}px` }}
        onClick={() => {
          if (node.disabled) return;

          if (hasChildren) {
            onToggle(node.value);
            return;
          }

          onSelect(node.value);
        }}
      >
        <button
          type="button"
          onClick={(e) => {
            if (!hasChildren) return;

            e.stopPropagation();
            onToggle(node.value);
          }}
          className="flex shrink-0"
        >
          <IconContainer>
            {hasChildren ? (
              <Icon
                icon={isExpanded ? 'solar:alt-arrow-down-linear' : 'solar:alt-arrow-right-linear'}
                className="size-4 cursor-pointer"
              />
            ) : null}
          </IconContainer>
        </button>

        <IconContainer>
          <Icon
            icon={
              hasChildren
                ? isExpanded
                  ? 'solar:folder-open-linear'
                  : 'solar:folder-linear'
                : 'solar:file-linear'
            }
            className="size-4"
          />
        </IconContainer>

        <span className="flex-1 text-left text-[13px]">{node.label}</span>

        {isSelected && (
          <IconContainer>
            <Icon icon="solar:unread-linear" className="text-primary size-4 md:size-5" />
          </IconContainer>
        )}
      </li>

      {hasChildren &&
        isExpanded &&
        node.children?.map((child) => (
          <TreeNode
            key={child.value}
            node={child}
            level={level + 1}
            value={value}
            expanded={expanded}
            onToggle={onToggle}
            onSelect={onSelect}
          />
        ))}
    </>
  );
};

const HierarchySelect = ({
  options,
  selectProps,
  className = '',
  containerClassName = '',
  error,
  icons,
  label,
  optionsClassName = '',
  position,
  inputProps,
}: IHierarchySelect) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState<Record<string | number, boolean>>({});

  const containerRef = useOutsideClick<HTMLDivElement>(
    () => {
      setIsOpen(false);
    },
    { enabled: isOpen },
  );

  const searchValue = inputProps?.value ?? search;

  const handleToggle = () => {
    if (selectProps.disabled || !options.length) return;
    setIsOpen((prev) => !prev);
  };

  const toggleExpand = (value: string | number) => {
    setExpanded((prev) => ({
      ...prev,
      [value]: !prev[value],
    }));
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (typeof inputProps?.value !== 'string') {
      setSearch(e.target.value);
    }

    inputProps?.onChange?.(e);
  };

  const searchKeyword = searchValue.toString();

  const filteredOptions = useMemo(
    () => filterTree(options, searchKeyword),
    [options, searchKeyword],
  );

  const selectedOption = useMemo(() => {
    const find = (items: IHierarchySelectOption[]): IHierarchySelectOption | undefined => {
      for (const item of items) {
        if (item.value === selectProps.value) return item;

        if (item.children?.length) {
          const found = find(item.children);

          if (found) return found;
        }
      }

      return undefined;
    };

    return find(options);
  }, [options, selectProps.value]);

  const handleSelect = (value: string | number) => {
    selectProps.onChange(value);
    setIsOpen(false);
  };

  return (
    <div
      ref={containerRef}
      className={`flex max-w-full min-w-0 flex-col gap-1.5 ${containerClassName}`}
    >
      <div className="relative">
        <InputLabel onClick={handleToggle} className="z-2 cursor-pointer">
          {label}
        </InputLabel>

        <div
          className={`border-primary/10 bg-smoke-eerie flex items-center gap-3 overflow-hidden rounded-lg border px-3 ${className}`}
        >
          <InputIcon icon={icons?.left} />
          <div
            className={`text-primary flex flex-1 items-center justify-between gap-0.5 truncate border-none bg-transparent text-[13px] ${
              selectProps.disabled ? 'cursor-no-drop' : 'cursor-pointer'
            }`}
            onClick={handleToggle}
          >
            <span
              className={`flex-1 truncate py-2 xl:py-3 ${!selectedOption?.value ? 'text-primary/30' : ''}`}
            >
              {selectedOption?.label ?? selectProps.placeholder ?? 'Select'}
            </span>

            <Icon
              icon="solar:alt-arrow-down-linear"
              className={`size-4 transition-transform md:size-5 ${isOpen ? 'rotate-180' : ''} ${
                selectedOption?.value ? 'text-primary' : 'text-primary/30'
              }`}
            />
            {isOpen && options.length > 0 && (
              <div
                className={`border-primary/10 bg-smoke-eerie absolute left-0 z-3 w-full overflow-hidden rounded-lg border shadow-md ${
                  position === 'top' ? 'bottom-full mb-2' : 'top-full mt-2'
                } ${optionsClassName}`}
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <Input
                  needRef={true}
                  inputProps={{
                    ...inputProps,
                    value: searchValue,
                    onChange: handleSearch,
                    placeholder: inputProps?.placeholder ?? 'Search here...',
                    className: `py-2! ${inputProps?.className ?? ''}`,
                  }}
                  icons={{
                    right: {
                      icon: searchValue ? 'lucide:x' : 'solar:magnifer-linear',
                      className: `size-4 text-primary ${searchValue ? 'cursor-pointer' : 'opacity-30'}`,
                      onClick: () => {
                        if (typeof inputProps?.value !== 'string') {
                          setSearch('');
                        }

                        inputProps?.onChange?.({
                          target: { value: '' },
                        } as ChangeEvent<HTMLInputElement>);
                      },
                    },
                  }}
                  containerClassName="p-2 border-b border-b-primary/20"
                  className="bg-silver-jet/8!"
                />

                <ul className="flex max-h-60 flex-col gap-0.5 overflow-auto scroll-smooth p-1">
                  {filteredOptions.length ? (
                    filteredOptions.map((node) => (
                      <TreeNode
                        key={node.value}
                        node={node}
                        value={selectProps.value}
                        expanded={expanded}
                        onToggle={toggleExpand}
                        onSelect={handleSelect}
                      />
                    ))
                  ) : (
                    <ApiStatus
                      status="empty"
                      title="No matching options found"
                      description="Try searching with a different keyword or clear the search."
                      className="min-h-30!"
                    />
                  )}
                </ul>
              </div>
            )}
          </div>
          <InputIcon icon={icons?.right} />
        </div>
      </div>
      <InputError error={error} />
    </div>
  );
};

export default HierarchySelect;
