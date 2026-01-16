import { InfoIcon } from '../../icons';

const InputError = ({ error }: { error?: string }) => {
  if (!error) return null;
  return (
    <p className="text-red-c flex w-full items-center gap-1 text-start text-[11px] leading-tight">
      <InfoIcon className="fill-red-c h-3 min-h-3 w-3 min-w-3 md:h-4 md:min-h-4 md:w-4 md:min-w-4" />
      <span className="line-clamp-2 leading-none">{error}</span>
    </p>
  );
};

export default InputError;
