import { FC } from "react";
import { RadioProps } from "../../types";

const Radio: FC<RadioProps> = ({
  value,
  onChange,
  options,
  className = "",
}) => {
  const index = options.findIndex((opt) => opt.value === value);
  const translatePercent = `${index * 100}%`;

  return (
    <div
      className={`w-full flex items-center justify-center gap-4 border border-primary-battleship-davys-gray mx-auto rounded-full overflow-hidden ${className}`}
    >
      <div className="relative flex items-center justify-between w-full h-9 bg-smoke-eerie rounded-full shadow-primary-btn">
        {/* Toggle Background */}
        <div
          className="absolute h-full bg-accent-duo rounded-full shadow-lg transform transition-transform duration-300 ease-in-out"
          style={{
            width: `${100 / options.length}%`,
            transform: `translateX(${translatePercent})`,
          }}
        />

        {options.map((option) => (
          <label
            key={option.value}
            className={`relative z-10 flex-1 text-center text-sm cursor-pointer ${
              value === option.value
                ? "text-white/90 font-semibold"
                : "text-primary-50 font-medium"
            }`}
          >
            <input
              type="radio"
              name="radio"
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
              className="sr-only"
            />
            {option.label}
          </label>
        ))}
      </div>
    </div>
  );
};

export default Radio;
