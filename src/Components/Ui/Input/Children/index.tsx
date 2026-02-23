import { InfoIcon } from '@/Icons';
import type { TClassName, TInputIcon } from '@/Types';
import type { LabelHTMLAttributes } from 'react';

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

export const InputIcon = ({ onClick, icon, text }: TInputIcon) => {
  if (!icon && !text) return null;
  return text ? (
    <p className="text-primary/50 border-r-primary/10 flex h-full items-center justify-center border-r p-3 text-sm capitalize">
      {text}
    </p>
  ) : (
    <span
      onClick={onClick}
      className="group flex h-full cursor-pointer items-center justify-center overflow-hidden p-2"
    >
      {icon}
    </span>
  );
};

export const InputLabel = (props: LabelHTMLAttributes<HTMLLabelElement>) => {
  if (!props.children) return null;
  return (
    <label
      {...props}
      className={`text-primary/50 border-primary/10 bg-smoke-eerie absolute top-0 left-3 -translate-y-1/2 transform cursor-pointer rounded-sm border px-1 py-0.5 text-[10px] leading-none md:px-2 lg:text-xs ${props.className}`}
    />
  );
};
