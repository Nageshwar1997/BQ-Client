const ToggleGroup = ({
  data,
  value,
  onSelect,
}: {
  data: string[];
  value?: string;
  onSelect: (item: string) => void;
}) => {
  return (
    <div className="border-neutral-gray-400 bg-neutral-gray-300 text-neutral-gray-900 flex h-8 w-min overflow-hidden rounded-lg border text-xs">
      {data.map((item) => (
        <div
          key={item}
          onClick={() => onSelect(item)}
          className={`flex h-full w-[82px] cursor-pointer items-center justify-center px-3 py-2 capitalize ${value === item ? 'bg-neutral-gray-800 text-white' : ''}`}
        >
          {item}
        </div>
      ))}
    </div>
  );
};

export default ToggleGroup;
