import type { TClassName } from '@/types/component.type';
import type { IInput } from '@/types/input.type';
import { Icon } from '@iconify/react';
import type { LabelHTMLAttributes } from 'react';

export const InputError = ({ error, className = '' }: { error?: string } & TClassName) => {
  if (!error) return null;
  return (
    <p
      className={`text-red-c flex w-full items-center gap-1 text-start text-[11px] leading-tight ${className}`}
    >
      <Icon icon="solar:info-circle-linear" className="text-red-c size-3 shrink-0 md:size-4" />
      <span className="line-clamp-2 leading-none whitespace-pre-line">{error}</span>
    </p>
  );
};

export const InputIcon = ({
  position,
  ...props
}: IInput['icons'] & { position: 'left' | 'right' }) => {
  if (!props) return null;

  // 👉 LEFT
  if ('left' in props && props.left && position === 'left') {
    const value = props.left;

    if (typeof value === 'string') {
      return (
        <p className="text-primary/50 border-r-primary/10 flex h-full items-center border-r p-3 text-xs leading-none capitalize">
          {value}
        </p>
      );
    }

    return (
      <span className="flex h-full items-center p-3">
        <Icon {...value} />
      </span>
    );
  }

  // 👉 RIGHT
  if ('right' in props && props.right && position === 'right') {
    return (
      <p className="flex h-full items-center p-3">
        <Icon {...props.right} />
      </p>
    );
  }

  return null;
};

export const InputLabel = (props: LabelHTMLAttributes<HTMLLabelElement>) => {
  if (!props.children) return null;
  return (
    <label
      {...props}
      className={`text-primary/50 border-primary/10 bg-smoke-eerie absolute top-0 left-3 -translate-y-1/2 transform cursor-pointer rounded-sm border px-1 py-0.5 pt-1 text-[10px] leading-none md:px-2 ${props.className}`}
    />
  );
};
