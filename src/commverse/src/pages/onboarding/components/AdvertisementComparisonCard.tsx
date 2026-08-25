import { Icon } from '@iconify/react';

type AdvertisementComparisonCardProps = {
  originalImageUrl: string;
  resultUrl: string;
  onArTryOn?: () => void;
};

const AdvertisementComparisonCard = ({
  originalImageUrl,
  resultUrl,
  // onArTryOn,
}: AdvertisementComparisonCardProps) => {
  return (
    <div className="flex items-start gap-4 overflow-hidden rounded-xl bg-neutral-gray-150 p-6">
      {/* Left: without brand DNA */}
      <div className="flex shrink-0 flex-col items-start gap-2.5">
        <div className="size-[270px] overflow-hidden rounded-xl">
          <img
            src={originalImageUrl}
            alt="Without Brand DNA"
            className="h-full w-full object-cover"
          />
        </div>
        <div className="flex items-center rounded-[4px] bg-neutral-gray-300 px-1 py-0.5">
          <span className="text-[10px] font-semibold leading-[1.35] text-neutral-gray-900">
            Without Brand DNA
          </span>
        </div>
      </div>

      {/* Divider */}
      <div className="mx-1 h-[120px] self-center border-l border-neutral-gray-400" />

      {/* Right: with brand DNA */}
      <div className="flex shrink-0 flex-col items-end gap-2.5">
        <div className="size-[270px] overflow-hidden rounded-xl">
          <img
            src={resultUrl}
            alt="With Brand DNA"
            className="h-full w-full object-cover"
          />
        </div>
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-0.5 rounded-[4px] bg-neutral-gray-900 px-1 py-0.5 self-end">
            <Icon icon="lucide:brain" className="size-3 shrink-0 text-white" />
            <span className="text-[10px] font-semibold leading-[1.35] text-white">
              With Brand DNA
            </span>
          </div>
          {/* {onArTryOn && (
            <Button
              content="AR Try On"
              variant="primary"
              size="sm"
              className="mt-6"
              onClick={onArTryOn}
            />
          )} */}
        </div>
      </div>
    </div>
  );
};

export default AdvertisementComparisonCard;
