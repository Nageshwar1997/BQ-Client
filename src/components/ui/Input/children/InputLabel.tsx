import type { LabelHTMLAttributes } from 'react';

export const InputLabel = (props: LabelHTMLAttributes<HTMLLabelElement>) => {
  if (!props.children) return null;
  return (
    <label
      {...props}
      className={`text-primary/50 border-primary/10 bg-smoke-eerie absolute top-0 left-3 -translate-y-1/2 transform cursor-pointer rounded-sm border px-1 py-0.5 text-[10px] leading-none md:px-2 lg:text-xs ${props.className}`}
    />
  );
};
