import { ChangeEvent, useEffect, useRef } from "react";
import { InfoIcon } from "../../icons";
import { ITextArea } from "../../types";

const Textarea = ({
  label = "",
  register,
  className = "",
  error,
  containerClassName = "",
  textAreaProps = { rows: 4 },
  needRef = false,
}: ITextArea) => {
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    textAreaProps.onChange?.(event);
    register?.onChange?.(event);
  };

  useEffect(() => {
    if (needRef) {
      inputRef.current?.focus();
    }
  }, [needRef]);

  return (
    <div className={`w-full flex flex-col gap-1.5 ${containerClassName}`}>
      <div className="relative h-20 lg:h-24">
        {label && (
          <label
            htmlFor={textAreaProps.name}
            className={`text-[10px] lg:text-xs text-primary-50 absolute top-0 left-3 transform -translate-y-1/2 border border-primary-10 leading-none px-1 md:px-2 py-0.5 bg-smoke-eerie rounded cursor-pointer`}
          >
            {label}
          </label>
        )}
        <div
          className={`w-full h-full flex items-center gap-1 border border-primary-10 bg-smoke-eerie rounded-lg overflow-hidden p-3 ${className}`}
        >
          {/* Input */}
          <textarea
            aria-autocomplete="none"
            {...register}
            {...textAreaProps}
            ref={inputRef}
            id={textAreaProps.name}
            disabled={textAreaProps.readOnly}
            onChange={handleChange}
            className="flex-1 w-full h-full outline-none border-none focus:outline-none focus:border-none bg-transparent font-normal text-sm text-primary placeholder:text-primary-50 placeholder:text-sm resize-none autofill-effect"
          />
        </div>
      </div>
      {!textAreaProps.readOnly && error && (
        <p
          className={`w-full text-start flex gap-1 items-center text-[11px] leading-tight text-red-500`}
        >
          <InfoIcon className="w-3 h-3 md:w-4 md:h-4 fill-red-500" />
          <span className="leading-none">{error}</span>
        </p>
      )}
    </div>
  );
};

export default Textarea;
