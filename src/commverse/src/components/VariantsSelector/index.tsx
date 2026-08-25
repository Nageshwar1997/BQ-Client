import { Icon } from '@iconify/react';
import { useEffect, useState } from 'react';

interface VariantSelectorProps {
  title: string;
  data: string[];
  className?: string;
  initialDataIndex?: number;
  onSelect: (index: number) => void;
}

const getValidatedTotalData = (steps: number) => {
  if (!Number.isFinite(steps)) return 1;
  return Math.max(1, Math.floor(steps));
};

const getValidatedinitialDataIndex = (
  step: number | undefined,
  steps: number
) => {
  if (typeof step !== 'number' || !Number.isFinite(step)) return 1;
  return Math.min(Math.max(1, Math.floor(step)), steps);
};

const VariantsSelector = ({
  title,
  data,
  className = '',
  initialDataIndex,
  onSelect,
}: VariantSelectorProps) => {
  const validatedTotalData = getValidatedTotalData(data.length);
  const [currentData, setCurrentData] = useState<number>(() =>
    getValidatedinitialDataIndex(initialDataIndex, validatedTotalData)
  );

  useEffect(() => {
    setCurrentData(
      getValidatedinitialDataIndex(initialDataIndex, validatedTotalData)
    );
  }, [initialDataIndex, validatedTotalData]);

  return (
    <div
      className={`text-neutral-gray-900 flex items-center gap-4 leading-5 font-medium ${className}`}
    >
      <div>{title}</div>
      <div className="flex gap-2">
        {data.map((item, index) => {
          const stepNumber = index + 1;
          const isSelected = stepNumber === currentData;

          return (
            <div
              key={index}
              onClick={() => {
                setCurrentData(stepNumber);
                onSelect(stepNumber);
              }}
              className="relative h-8 w-8 cursor-pointer"
            >
              <img
                src={item}
                className="border-neutral-gray-400 h-full w-full rounded-lg border object-cover"
              />
              {isSelected && (
                <Icon
                  icon="lucide:check"
                  className="text-neutral-gray-100 absolute inset-0 size-6 h-full w-full p-1"
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default VariantsSelector;
