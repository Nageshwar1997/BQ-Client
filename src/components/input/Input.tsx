import { useEffect, useRef, type ChangeEvent } from 'react';

import type { IInput } from '../../types';
import InputError from '../ui/InputError';
import InputIcon from './children/InputIcon';
import InputLabel from './children/InputLabel';

export const Input = ({
  label = '',
  register,
  className = '',
  error = '',
  containerClassName = '',
  icons,
  inputProps,
  needRef = false,
}: IInput) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (inputProps?.disabled) return;
    inputProps.onChange?.(event);
    register?.onChange?.(event);
  };

  useEffect(() => {
    if (needRef) inputRef.current?.focus();
  }, [needRef]);

  return (
    <div className={`flex w-full flex-col gap-1.5 ${containerClassName}`}>
      <div className="relative h-10 lg:h-12">
        <InputLabel label={label} name={inputProps?.name} />
        <div
          className={`border-primary/10 bg-smoke-eerie flex h-full w-full items-center gap-1 overflow-hidden rounded-lg border ${className}`}
        >
          {/* Left Icon */}
          <InputIcon
            icon={icons?.left?.icon}
            text={icons?.left?.text}
            onClick={icons?.left?.onClick}
          />
          {/* Input */}
          <input
            aria-autocomplete="none"
            {...register}
            {...inputProps}
            {...(needRef && { ref: inputRef })}
            id={inputProps.id || inputProps.name}
            onChange={handleChange}
            onWheel={(event) => (inputProps?.type === 'number' ? event.currentTarget.blur() : null)}
            className={`text-primary placeholder:text-primary/50 autofill-effect line-clamp-1 h-full w-full flex-1 border-none bg-transparent p-3 text-sm font-normal outline-hidden placeholder:text-sm focus:border-none focus:outline-hidden disabled:cursor-not-allowed ${
              icons?.left?.icon
                ? 'pl-0'
                : icons?.right?.icon
                  ? 'pr-0'
                  : icons?.left?.text
                    ? 'pl-2'
                    : ''
            } ${inputProps?.className || ''}`}
          />
          {/* Right Icon */}
          <InputIcon icon={icons?.right?.icon} onClick={icons?.right?.onClick} />
        </div>
      </div>
      <InputError error={error} />
    </div>
  );
};
