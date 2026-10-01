import { Icon } from '@iconify/react';
interface Props {
  compareProps: { disabled: boolean; onClick: () => void; active: boolean };
  downloadProps: { disabled: boolean; onClick: () => void };
}
const TryOnTopControls = ({ compareProps, downloadProps }: Props) => {
  return (
    <div className="absolute top-3 right-3 z-5 flex items-center gap-2">
      <button
        type="button"
        aria-label={compareProps.active ? 'Hide before/after compare' : 'Compare before/after'}
        onClick={compareProps.onClick}
        disabled={compareProps.disabled}
        className={`flex size-9 cursor-pointer items-center justify-center rounded-full border backdrop-blur-xs transition-colors duration-300 disabled:cursor-not-allowed disabled:opacity-50 ${
          compareProps.active
            ? 'bg-sky-blue-burst border-transparent text-white'
            : 'bg-primary-invert/70 text-primary border-primary/10'
        }`}
      >
        <Icon icon="iconamoon:compare-fill" className="size-4" />
      </button>

      <button
        type="button"
        aria-label="Download snapshot"
        onClick={downloadProps.onClick}
        disabled={downloadProps.disabled}
        className="bg-primary-invert/70 text-primary border-primary/10 flex size-9 cursor-pointer items-center justify-center rounded-full border backdrop-blur-xs disabled:cursor-not-allowed disabled:opacity-50"
      >
        <Icon icon="solar:download-linear" className="size-4" />
      </button>
    </div>
  );
};

export default TryOnTopControls;
