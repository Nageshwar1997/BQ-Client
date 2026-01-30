import { MessageIcon } from '../../../../../icons';
import { getTodaysFeedback } from '../../../../../utils';
import { GradientText } from '../../../../ui';
import type { TForwardIdx } from '../../../../../types';

const Feedback = ({ forwardIndex = 0 }: { forwardIndex?: TForwardIdx }) => {
  const FEEDBACK = getTodaysFeedback(forwardIndex);
  return (
    <div className="border-primary/50 flex w-full flex-col gap-2 border-b pt-0 pb-4 lg:flex-row lg:items-center lg:border-t lg:border-b-transparent lg:pt-4 lg:pb-0">
      <div className="flex w-fit items-center gap-2">
        <MessageIcon className="fill-secondary size-4 2xl:size-5" />
        <p className="text-secondary text-sm font-medium text-nowrap lg:text-[11px] xl:text-sm">
          User's Feedback:
        </p>
      </div>
      {FEEDBACK.map((item) => (
        <GradientText
          key={item.text}
          text={item.text}
          type={item.accent ? 'accent' : 'silver'}
          className="text-[11px] xl:text-sm"
        />
      ))}
    </div>
  );
};

export default Feedback;
