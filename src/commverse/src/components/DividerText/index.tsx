interface DividerTextProps {
  text: string;
  className?: string;
  lineClassName?: string;
  textClassName?: string;
}

const DividerText = ({
  text,
  className = '',
  lineClassName = '',
  textClassName = '',
}: DividerTextProps) => {
  return (
    <div className={`flex items-center justify-between gap-4 ${className}`}>
      <span
        className={`bg-neutral-gray-200 block h-px w-full ${lineClassName}`}
      />
      <span
        className={`text-neutral-gray-500 font-metropolis shrink-0 text-sm leading-4.5 font-normal ${textClassName}`}
      >
        {text}
      </span>
      <span
        className={`bg-neutral-gray-200 block h-px w-full ${lineClassName}`}
      />
    </div>
  );
};

export default DividerText;
