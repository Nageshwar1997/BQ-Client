import type { TInputIcon } from '../../../types';

const InputIcon = ({ onClick, icon }: Omit<TInputIcon, 'text'>) => {
  if (!icon) return null;
  return (
    <span
      onClick={onClick}
      className="group flex h-full cursor-pointer items-center justify-center overflow-hidden p-2"
    >
      {icon}
    </span>
  );
};

export default InputIcon;
