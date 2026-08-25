const PillLoader: React.FC<{
  description?: string;
  className?: string;
  barClassName?: string;
}> = ({
  description = 'Uploading model, please wait...',
  className = '',
  barClassName = 'w-60',
}) => {
  return (
    <div
      className={`flex flex-col items-center ${description ? 'gap-6' : 'gap-0'} ${className} `}
    >
      <div
        className={`bg-neutral-gray-400 relative flex h-2 ${barClassName} items-center justify-center gap-2 overflow-hidden rounded-full`}
      >
        <div
          className={`bg-neutral-gray-900 absolute h-full w-18 animate-[slideLoader_1.5s_ease-in-out_infinite] rounded-full border-amber-50`}
        />
      </div>
      {description ? (
        <span className="text-neutral-gray-600 font-metropolis text-sm font-normal">
          {description}
        </span>
      ) : null}
    </div>
  );
};

export default PillLoader;
