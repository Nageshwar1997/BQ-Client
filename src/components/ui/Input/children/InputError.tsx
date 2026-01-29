import { InfoIcon } from '../../../../icons';
import type { TClassName } from '../../../../types';

export const InputError = ({ error, className = '' }: { error?: string } & TClassName) => {
  if (!error) return null;
  return (
    <p
      className={`text-red-c flex w-full items-center gap-1 text-start text-[11px] leading-tight ${className}`}
    >
      <InfoIcon className="fill-red-c size-3 md:size-4" />
      <span className="line-clamp-2 leading-none">{error}</span>
    </p>
  );
};
