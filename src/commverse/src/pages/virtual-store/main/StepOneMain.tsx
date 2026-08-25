import Chip from '../../../components/Chip';
import { CreateIcon } from '../../../icons';

const StepOneMain = () => {
  return (
    <div className="flex w-full flex-col items-start gap-10">
      StepOneMain
      <div className="bg-neutral-gray-900 grid w-full grid-cols-4 gap-10 p-10">
        {Array.from({ length: 4 }).map(() => (
          <Chip
            text="3 Primary Spots"
            variant="secondary"
            leftIcon={<CreateIcon className="size-3!" />}
            className="bg-neutral-gray-100! justify-center gap-2 rounded-[10px] px-4 py-2 text-[14px] font-medium!"
          />
        ))}
      </div>
    </div>
  );
};

export default StepOneMain;
