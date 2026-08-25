import type { InputHTMLAttributes, ReactNode } from 'react';
import {
  getCountries,
  getCountryCallingCode,
  type Country,
} from 'react-phone-number-input';
import en from 'react-phone-number-input/locale/en.json';

type PhoneInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'onChange' | 'value'
> & {
  value?: string;
  onChange?: (value: string) => void;
  label?: string;
  error?: string;
  containerClassName?: string;
  labelClassName?: string;
  errorClassName?: string;
  rightAddon?: ReactNode;
  country?: Country;
  onCountryChange?: (country?: Country) => void;
  maxDigits?: number;
};

const sanitizeDigits = (value: string, maxDigits: number) =>
  value.replace(/\D/g, '').slice(0, maxDigits);

const getFlagEmoji = (country: Country) =>
  country
    .split('')
    .map((char) => String.fromCodePoint(char.charCodeAt(0) + 127397))
    .join('');

const PhoneInput = ({
  value = '',
  onChange,
  label,
  error,
  placeholder,
  className = '',
  containerClassName = '',
  labelClassName = '',
  errorClassName = '',
  rightAddon,
  disabled,
  country = 'IN',
  onCountryChange,
  maxDigits = 15,
  ...props
}: PhoneInputProps) => {
  const countryCallingCode = `+${getCountryCallingCode(country)}`;
  const sanitizedValue = sanitizeDigits(value, maxDigits);
  const isDisabled = Boolean(disabled);
  const isLocked = isDisabled || props.readOnly;

  return (
    <div
      className={`flex flex-col gap-1 ${isDisabled || isLocked ? 'cursor-not-allowed opacity-50 select-none' : ''} ${containerClassName}`}
    >
      {label && (
        <label
          className={`font-metropolis text-xs font-medium text-gray-700 ${labelClassName}`}
        >
          {label}
        </label>
      )}

      <div className="relative">
        <div
          className={`bg-neutral-gray-100 border-neutral-gray-400 flex w-full rounded-lg border transition outline-none focus-within:ring-1 ${
            error
              ? 'border-ui-error focus-within:ring-ui-error'
              : 'focus-within:ring-brand hover:border-neutral-gray-900'
          } ${isDisabled ? 'pointer-events-none' : ''} ${className}`}
        >
          <div className="border-neutral-gray-200 relative flex min-w-[80px] items-center gap-2 border-r px-4">
            <span className="text-base leading-none">
              {getFlagEmoji(country)}
            </span>
            <span className="font-metropolis text-neutral-gray-900 text-xs font-medium">
              {countryCallingCode}
            </span>
            <span className="text-neutral-gray-600 flex h-full pt-2 text-xs leading-none">
              ⌄
            </span>
            <select
              value={country}
              disabled={isLocked}
              onChange={(e) => onCountryChange?.(e.target.value as Country)}
              className="absolute inset-0 cursor-pointer opacity-0"
              aria-label={label ?? 'Select country'}
            >
              {getCountries().map((countryOption) => (
                <option key={countryOption} value={countryOption}>
                  {en[countryOption]} (+{getCountryCallingCode(countryOption)})
                </option>
              ))}
            </select>
          </div>

          <input
            type="tel"
            disabled={isLocked}
            placeholder={placeholder}
            value={sanitizedValue}
            onChange={(e) =>
              onChange?.(sanitizeDigits(e.target.value, maxDigits))
            }
            className="font-metropolis placeholder:text-neutral-gray-400 text-neutral-gray-900 w-full bg-transparent px-4 py-2 text-sm outline-none placeholder:text-xs"
            {...props}
          />

          {rightAddon && (
            <div
              className={`flex items-center gap-1 pr-1 ${
                isLocked ? 'pointer-events-none' : ''
              }`}
            >
              {rightAddon}
            </div>
          )}
        </div>
      </div>

      {error && (
        <span
          className={`font-metropolis text-ui-error flex gap-1 text-xs font-normal ${errorClassName}`}
        >
          {error}
        </span>
      )}
    </div>
  );
};

export default PhoneInput;
