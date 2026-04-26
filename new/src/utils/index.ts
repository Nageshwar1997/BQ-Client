import type { IButton } from "@/types/component.type";

export const getButtonCss = (pattern: IButton['pattern']) => {
  switch (pattern) {
    case 'primary':
      return 'text-white bg-sky-blue-burst shadow-primary-btn hover:shadow-primary-btn-hover';
    case 'secondary':
      return 'text-secondary-invert bg-secondary shadow-secondary-btn hover:shadow-secondary-btn-hover';
    case 'tertiary':
      return 'text-tertiary-invert bg-tertiary shadow-tertiary-btn hover:shadow-tertiary-btn-hover';
    case 'outline':
      return 'text-primary border border-primary shadow-outline-btn hover:shadow-outline-btn-hover';
    case 'transparent':
    default:
      return 'shadow-inner shadow-primary/20 hover:shadow-primary/30 bg-transparent border border-primary/30 text-secondary rotate-180 [&>span]:-rotate-180';
  }
};
