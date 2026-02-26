import { useEffect, useRef, type ChangeEvent } from 'react';
import type { ITextArea } from '@/Types/Common.type';
import { InputError, InputLabel } from './Children';

export const Textarea = ({
  label = '',
  register,
  className = '',
  error,
  containerClassName = '',
  textAreaProps = { rows: 4 },
  needRef = false,
}: ITextArea) => {
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    if (textAreaProps.disabled) return;
    textAreaProps.onChange?.(event);
    register?.onChange?.(event);
  };

  useEffect(() => {
    if (needRef) {
      inputRef.current?.focus();
    }
  }, [needRef]);

  return (
    <div className={`flex w-full flex-col gap-1.5 ${containerClassName}`}>
      <div className="relative h-20 lg:h-24">
        <InputLabel children={label} htmlFor={textAreaProps?.name} />
        <div
          className={`border-primary/10 bg-smoke-eerie flex h-full w-full items-center gap-1 overflow-hidden rounded-lg border p-3 ${className}`}
        >
          {/* Textarea */}
          <textarea
            aria-autocomplete="none"
            {...register}
            {...textAreaProps}
            {...(needRef && { ref: inputRef })}
            id={textAreaProps.id || textAreaProps.name}
            onChange={handleChange}
            className="text-primary placeholder:text-primary/50 autofill-effect h-full w-full flex-1 resize-none border-none bg-transparent text-sm font-normal outline-hidden placeholder:text-sm focus:border-none focus:outline-hidden disabled:cursor-not-allowed"
          />
        </div>
      </div>
      <InputError error={error} />
    </div>
  );
};
