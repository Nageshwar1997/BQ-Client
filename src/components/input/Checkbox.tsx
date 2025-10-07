import { ChangeEvent } from "react";

const Checkbox = ({
  register,
  className = "",
  labelClassName = "",
  checked = false,
  onChange,
}: {
  register?: object;
  className?: string;
  labelClassName?: string;
  checked?: boolean;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
}) => {
  return (
    <label
      className={`relative inline-flex items-center cursor-pointer border border-primary-10 bg-smoke-eerie rounded-full ${labelClassName}`}
    >
      <input
        name="remember"
        type="checkbox"
        className="sr-only peer outline-none"
        checked={checked}
        onChange={onChange}
        {...register}
      />
      <div
        className={`w-10 md:w-11 h-5 md:h-6 rounded-full peer-checked:after:translate-x-5 after:content-[''] after:absolute after:top-1 after:left-1 after:bg-silver-jet-2 after:peer-checked:bg-white after:border after:border-primary-10 after:rounded-full after:h-3 after:w-3 after:md:h-4 after:md:w-4 after:transition-all peer-checked:bg-accent-duo ${className}`}
      />
    </label>
  );
};

export default Checkbox;
