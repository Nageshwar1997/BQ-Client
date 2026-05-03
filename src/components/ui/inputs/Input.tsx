import type { IInput } from '@/types/input.type';
import { useEffect, useRef, type ChangeEvent } from 'react';
import { InputError, InputIcon, InputLabel } from './children';

const Input = ({
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
        <InputLabel children={label} htmlFor={inputProps?.name} />
        <div
          className={`border-primary/10 bg-smoke-eerie flex h-full w-full items-center gap-1 overflow-hidden rounded-lg border ${className}`}
        >
          {/* Left Icon */}
          <InputIcon {...icons} position="left" />
          {/* Input */}
          <input
            aria-autocomplete="none"
            {...register}
            {...inputProps}
            {...(needRef && { ref: inputRef })}
            id={inputProps.id || inputProps.name}
            onChange={handleChange}
            onWheel={(event) => (inputProps?.type === 'number' ? event.currentTarget.blur() : null)}
            className={`text-primary placeholder:text-primary/30 autofill-effect line-clamp-1 h-full w-full flex-1 border-none bg-transparent p-3 text-sm font-normal outline-hidden placeholder:text-xs focus:border-none focus:outline-hidden disabled:cursor-not-allowed ${inputProps?.className || ''}`}
          />
          {/* Right Icon */}
          <InputIcon {...icons} position="right" />
        </div>
      </div>
      <InputError error={error} />
    </div>
  );
};

export default Input;
