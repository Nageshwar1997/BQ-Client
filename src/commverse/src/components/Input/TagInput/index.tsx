import { useEffect, useState, type ChangeEvent, type FC } from 'react';
import type { TagInputProps } from '../../../types';
import Input from '..';
import { Icon } from '@iconify/react';
import { CloseIcon } from '../../../icons';

const TagInput: FC<TagInputProps> = ({
  label,
  placeholder = '',
  setValue,
  errorText,
  selectedTagsData = [],
  className = '',
  multiSelect = true,
  disabled = false,
}) => {
  const [selectedTags, setSelectedTags] = useState<string[]>(
    selectedTagsData.map((item) => item.value)
  );
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    if (!Array.isArray(selectedTagsData)) return;
    const sanitized = selectedTagsData.filter(
      (tag) => tag.value?.trim().length > 0
    );
    setSelectedTags(sanitized.map((item) => item.value));
  }, [selectedTagsData]);

  // Handle input change
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
  };

  // Handle tag add
  const handleTagAdd = (tag: string) => {
    const updatedTags = multiSelect ? [...selectedTags, tag] : [tag];
    setSelectedTags(updatedTags);
    setValue(updatedTags);
    setInputValue('');
  };

  // Handle tag removal
  const handleTagRemove = (tagToRemove: string) => {
    const updatedTags = selectedTags.filter((tag) => tag !== tagToRemove);
    setSelectedTags(updatedTags);
    setValue(updatedTags);
  };

  return (
    <div className={`font-metropolis flex w-full flex-col gap-1 ${className}`}>
      <div
        className={`${
          errorText ? 'text-ui-error' : 'text-background-dark-500'
        } text-xs font-medium text-gray-700`}
      >
        {label}
      </div>
      <div
        className={`focus-within:ring-brand focus-within:border-brand focus-within:bg-primary-50 relative flex h-10 items-end gap-2 rounded-md border px-4 py-2 focus-within:ring-1 ${errorText ? 'border-ui-error' : 'border-neutral-gray-400 hover:border-neutral-gray-900'} ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}
      >
        {selectedTags.length > 0 && (
          <div className="flex h-full max-h-6 gap-2">
            {selectedTags.map((tag, index) => (
              <div
                key={`${tag}-${index}`}
                className="bg-neutral-gray-200 border-neutral-gray-400 flex items-center gap-1 rounded-sm border px-2 py-0.5 leading-0"
              >
                <span className="text-neutral-gray-900 text-xs capitalize">
                  {tag}
                </span>
                <CloseIcon
                  className={`[&_path]:stroke-neutral-gray-500 h-3.5 w-3.5 ${!disabled ? 'cursor-pointer' : ''}`}
                  onClick={() => !disabled && handleTagRemove(tag)}
                />
              </div>
            ))}
          </div>
        )}
        <Input
          id={label}
          type="text"
          placeholder={selectedTags.length > 0 ? undefined : placeholder}
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={(e) => {
            if (
              (e.key === 'Backspace' || e.key === 'Delete') &&
              inputValue.length === 0 &&
              selectedTags.length > 0
            ) {
              e.preventDefault();
              handleTagRemove(selectedTags[selectedTags.length - 1]);
            }
            if (e.key === 'Enter') {
              e.preventDefault();
              handleTagAdd(inputValue);
            }
          }}
          containerClassName="w-full"
          className="h-full! w-full! rounded-none! border-none! p-0! text-xs! focus:border-none! focus:ring-0! focus:hover:border-none! enabled:hover:border-none!"
          disabled={disabled}
        />
      </div>
      {errorText && (
        <span className="font-metropolis text-ui-error! flex gap-1 text-xs font-normal">
          <Icon icon="solar:info-circle-outline" className="h-4 min-w-4" />
          {errorText}
        </span>
      )}
    </div>
  );
};

export default TagInput;
