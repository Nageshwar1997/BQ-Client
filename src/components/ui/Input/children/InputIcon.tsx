import type { TInputIcon } from '../../../../types';

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
