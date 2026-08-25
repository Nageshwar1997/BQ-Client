import { forwardRef, type TextareaHTMLAttributes } from 'react';

export interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  placeholder: string;
  containerClassName?: string;
}

const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  (
    {
      label,
      placeholder,
      error,
      containerClassName = '',
      className = '',
      ...props
    },
    ref
  ) => {
    return (
      <div className={`flex flex-col gap-1 ${containerClassName}`}>
        {label && (
          <label className="font-metropolis text-xs font-medium text-gray-700">
            {label}
          </label>
        )}

        <div className="relative">
          <textarea
            ref={ref}
            placeholder={placeholder}
            className={`bg-neutral-gray-100 border-neutral-gray-400 font-metropolis placeholder:text-neutral-gray-400 text-neutral-gray-900 disabled:border-neutral-gray-400 disabled:bg-neutral-gray-200 disabled:text-neutral-gray-500 w-full resize-none rounded-lg border px-3 py-2 text-xs transition outline-none placeholder:text-xs focus:ring-1 disabled:cursor-not-allowed ${
              error
                ? 'border-ui-error focus:ring-ui-error focus:hover:border-ui-error'
                : 'focus:ring-brand focus:hover:border-brand! enabled:hover:border-neutral-gray-900'
            } ${className}`}
            {...props}
          />
        </div>

        {error && (
          <span className="font-metropolis text-ui-error text-xs font-normal">
            {error}
          </span>
        )}
      </div>
    );
  }
);

export default TextArea;
